import Aws from 'aws-sdk'
import getConfig from 'lib/config'
import { getResourceId } from 'lib/cloudformation'
import { invalidate } from 'lib/cloudfront'
import { filenameRelativeToProjectRoot } from 'lib/file/dir-name'
import uploadDir from './upload-dir'

const addRobotsForNonProd = async (config, Bucket) => {
  if (
    config.branchName !== 'master' ||
    config.branchName === 'master' // remove this line when you want to go live?
  ) {
    console.log('adding robots.txt to disallow all as non prod deployment...')
    const s3 = new Aws.S3({ params: { Bucket } })
    const params = {
      Key: 'robots.txt',
      Body: 'User-agent: *\nDisallow: /',
      ContentType: 'text/plain',
    }
    console.log(await s3.upload(params).promise())
  }
}

export default async () => {
  const config = await getConfig()
  const id = await getResourceId(config.contentBucketName)
  console.log('syncing content with s3...')
  await uploadDir(id, filenameRelativeToProjectRoot(config.contentSourceLocation))
  await addRobotsForNonProd(config, id)
  await invalidate()
}
