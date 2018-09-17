import { setup } from 'lib/config'
import createOrUpdateStack from 'lib/cloudformation'
import updateContent, { createBucket } from 'lib/s3'
import createOrUpdateLambda from 'lib/lambda'

const executeasync = async () => {
  await setup()
  await createBucket('nickmeldrum2-com-cloudformation')
  process.exit(69)
  await createOrUpdateStack()
  await updateContent()
  await createOrUpdateLambda()
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
