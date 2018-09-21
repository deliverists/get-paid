import util from 'util'
import process from 'child_process'
import Aws from 'aws-sdk'
import getConfig from 'lib/config'
import {
  getStream,
  readJsonFile,
  readTextFile,
  writeObjectToJsonFile,
  deleteFile,
} from 'lib/file/read-local-file'
import {
  filenameRelativeToInfrastructure,
  filenameRelativeToProjectRoot,
} from 'lib/file/dir-name'
import tables from '../../../backend/dynamo/templates'

let config
let s3
let cloudformation
let templateUrl
let stackFile
let cfBucket

const templatesFileGenerator = configProperty =>
  filenameRelativeToInfrastructure(
    `${config.templatesSourceLocation}/${config[configProperty]}`,
  )

const exec = util.promisify(process.exec)

const init = async () => {
  if (s3) return
  config = await getConfig()
  s3 = new Aws.S3({
    params: { Bucket: config.stackTemplateBucket },
  })
  cloudformation = new Aws.CloudFormation()
  templateUrl = `${cfBucket}/${config.stackTemplateName}`
  stackFile = templatesFileGenerator('stackFilename')
  cfBucket = `https://${config.stackTemplateBucket}.s3.amazonaws.com/`
}

const created = async () => {
  const list = await cloudformation
    .listStacks({
      StackStatusFilter: [
        'CREATE_IN_PROGRESS',
        'CREATE_FAILED',
        'CREATE_COMPLETE',
        'UPDATE_IN_PROGRESS',
        'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_COMPLETE',
        'UPDATE_ROLLBACK_IN_PROGRESS',
        'UPDATE_ROLLBACK_FAILED',
        'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_ROLLBACK_COMPLETE',
        'REVIEW_IN_PROGRESS',
      ],
    })
    .promise()

  return list.StackSummaries.some(stack => stack.StackName === config.stackName)
}

const generateCloudFormationTemplates = async () => {
  const templateFile = templatesFileGenerator('stackTemplateName')
  const unpackagedStackFile = templatesFileGenerator('stackUnpackagedFilename')
  const graphQlSchema = filenameRelativeToProjectRoot(config.graphqlSchemaLocation)
  const invoicesRequestMappingTemplate = templatesFileGenerator(
    'invoices.requestMappingTemplate',
  )
  const invoicesResponseMappingTemplate = templatesFileGenerator(
    'invoices.responseMappingTemplate',
  )

  console.log('generating cloudformation template...')
  const templateJson = await readJsonFile(templateFile, 'utf8')
  const resources = templateJson.Resources
  tables.forEach(table => {
    resources[`${table.TableName}DynamoTable`] = {
      Type: 'AWS::DynamoDB::Table',
      Properties: table.Properties,
    }

    resources.AppSyncDynamoDBPolicy.Properties.PolicyDocument.Statement[0].Resource.push(
      {
        'Fn::Join': [
          '',
          [{ 'Fn::GetAtt': [`${table.TableName}DynamoTable`, 'Arn'] }, '*'],
        ],
      },
    )
  })

  resources.AppSyncSchema.Properties.Definition = await readTextFile(graphQlSchema)
  // todo - make schema s3location now we are packaging our cf template
  const resolverProperties = resources.AppSyncGetInvoiceQueryResolver.Properties
  resolverProperties.RequestMappingTemplate = await readTextFile(
    invoicesRequestMappingTemplate,
  )
  resolverProperties.ResponseMappingTemplate = await readTextFile(
    invoicesResponseMappingTemplate,
  )
  await writeObjectToJsonFile(unpackagedStackFile, templateJson)

  console.log('packaging cloudformation resources...')
  const { stdout, stderr } = await exec(
    `aws cloudformation package --template-file ${unpackagedStackFile} --s3-bucket ${
      config.stackTemplateBucket
    } --output-template-file ${stackFile}`,
  )
  if (stdout) console.log('output from package command:', stdout)
  if (stderr) console.error('error output from package command:', stderr)
  deleteFile(unpackagedStackFile)
}

const syncTemplates = async () => {
  console.log('syncing templates...')
  console.log(
    await s3
      .upload({
        Key: config.stackTemplateName,
        Body: getStream(stackFile),
      })
      .promise(),
  )
  deleteFile(stackFile)
}

const validateTemplate = async () => {
  console.log('validating template...')
  await cloudformation
    .validateTemplate({
      TemplateURL: templateUrl,
    })
    .promise()
}

const waitFor = (type, describeMethod) => async params => {
  console.log(`wait for ${type}...`)
  await cloudformation.waitFor(type, params).promise()

  console.log('wait over!')
  const description = await cloudformation[describeMethod](params).promise()

  console.log(description)
}

const waitForStackCreateCompletion = waitFor(
  'stackCreateComplete',
  'listStackResources',
)
const waitForStackUpdateCompletion = waitFor(
  'stackUpdateComplete',
  'listStackResources',
)
const waitForChangesetCompletion = waitFor(
  'changeSetCreateComplete',
  'describeChangeSet',
)

const getParameters = () => [
  {
    ParameterKey: 'BranchName',
    ParameterValue: config.branchName,
  },
]

const createStack = async () => {
  console.log('creating stack...')
  const stack = await cloudformation
    .createStack({
      StackName: config.stackName,
      TemplateURL: templateUrl,
      OnFailure: 'ROLLBACK',
      Parameters: getParameters(),
      ResourceTypes: ['AWS::*'],
    })
    .promise()
  console.log(stack)
  await waitForStackCreateCompletion({
    StackName: stack.StackId,
  })
  return stack
}

const getStackId = async () => {
  const stack = await cloudformation
    .describeStacks({
      StackName: config.stackName,
    })
    .promise()
  const stackId = stack.Stacks[0].StackId
  console.log(`stack id: ${stackId}`)
  return stackId
}

const createChangeSet = async StackName => {
  console.log('creating changeset...')
  const timestamp = Number(new Date())
  const changeSet = await cloudformation
    .createChangeSet({
      StackName,
      ChangeSetName: `${config.stackName}-changeset-${timestamp}`,
      TemplateURL: templateUrl,
      ChangeSetType: 'UPDATE',
      Parameters: getParameters(),
      Capabilities: ['CAPABILITY_NAMED_IAM'],
    })
    .promise()

  const changeSetDescription = await cloudformation
    .describeChangeSet({
      StackName,
      ChangeSetName: changeSet.Id,
    })
    .promise()

  console.log(changeSetDescription)

  try {
    await waitForChangesetCompletion({
      StackName,
      ChangeSetName: changeSet.Id,
    })
  } catch (e) {
    console.warn('wait for changeset complete failed', e)
  }

  if (changeSetDescription.Status === 'FAILED') {
    if (changeSetDescription.StatusReason.includes("didn't contain changes")) {
      console.log('changeset had no changes...')
      return null
    }
    throw new Error(changeSetDescription.StatusReason)
  }

  return changeSet.Id
}

const executeChangeSet = async (StackName, ChangeSetName) => {
  console.log('executing changeset...')
  await cloudformation
    .executeChangeSet({
      StackName,
      ChangeSetName,
    })
    .promise()
  await waitForStackUpdateCompletion({
    StackName,
  })
}

const create = async () => {
  if (await created()) throw new Error('stack already created')

  await validateTemplate()

  await createStack()
}

const update = async () => {
  const isCreated = await created()
  if (!isCreated) throw new Error('stack not created yet')

  const StackName = await getStackId()
  const ChangeSetId = await createChangeSet(StackName)
  if (ChangeSetId) await executeChangeSet(StackName, ChangeSetId)
}

const createOrUpdate = async () => {
  console.log('## create or update stack ##')
  await init()
  await generateCloudFormationTemplates()
  await syncTemplates()
  if (await created()) await update()
  else await create()
}

const getStackResourceInfo = async () => {
  const StackName = await getStackId()

  console.log('getting stack resource info...')
  const resources = await cloudformation
    .listStackResources({
      StackName,
    })
    .promise()

  console.log(resources)
  return resources
}

export const getResourceId = async resourceName => {
  await init()
  const resources = await getStackResourceInfo()
  return resources.StackResourceSummaries.find(
    r => r.LogicalResourceId === resourceName,
  ).PhysicalResourceId
}

export default createOrUpdate
