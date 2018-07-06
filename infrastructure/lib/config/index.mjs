import Aws from 'aws-sdk'
import { readJsonFile } from 'lib/file/read-local-file'
import getBranchName from './branch-name'
import { interpolateAllValues } from './interpolate'

const configFilename = 'config.json'

let config

const getConfig = async () => {
  if (config) return config
  const configTemplate = await readJsonFile(configFilename)
  const branchName = await getBranchName()
  config = interpolateAllValues(configTemplate, {
    BRANCH_NAME: branchName,
  })
  config.branchName = branchName
  console.log('config setup:')
  console.log(config)
  return config
}

export const setup = async () => {
  await getConfig()
  Aws.config.update({ region: config.defaultRegion })
}

export default getConfig
