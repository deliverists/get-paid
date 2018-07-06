import { setup } from 'lib/config'
import createOrUpdateStack from 'lib/cloudformation'
import updateContent from 'lib/s3'
import createOrUpdateLambda from 'lib/lambda'

const executeasync = async () => {
  await setup()
  await createOrUpdateStack()
  await updateContent()
  await createOrUpdateLambda()
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
