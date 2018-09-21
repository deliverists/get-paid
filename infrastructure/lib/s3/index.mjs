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

export const bucketExists = async bucketName => {
  const s3 = new Aws.S3({ apiVersion: '2006-03-01' })
  let exists
  try {
    await s3.headBucket({ Bucket: bucketName }).promise()
    exists = true
  } catch (e) {
    exists = false
  }
  return exists
}

export const createBucket = async bucketName => {
  if (await bucketExists(bucketName)) {
    console.log('bucket already exists...', bucketName)
  } else {
    const s3 = new Aws.S3({ apiVersion: '2006-03-01' })

    console.log('creating bucket...', bucketName)

    console.log(
      await s3
        .createBucket({
          Bucket: bucketName,
          CreateBucketConfiguration: {
            LocationConstraint: 'us-east-1',
          },
        })
        .promise(),
    )
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
