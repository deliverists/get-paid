import Aws from 'aws-sdk'
import create from 'lib/create'

const initialiseAws = () => {
  Aws.config.update({ region: 'us-east-1' })
}

const initialiseDyanmo = () =>
  new Aws.DynamoDB({
    endpoint: new Aws.Endpoint('http://localhost:8000'),
  })

const executeasync = async () => {
  initialiseAws()
  const dynamo = initialiseDyanmo()

  await create(dynamo)
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
