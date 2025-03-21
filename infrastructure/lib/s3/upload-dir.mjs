import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import Aws from 'aws-sdk'

let s3

const init = async Bucket => {
  if (s3) return
  s3 = new Aws.S3({
    params: { Bucket },
  })
}

export default async (bucket, sourcePath) => {
  await init(bucket)

  const walkSync = (currentDirPath, callback) => {
    fs.readdirSync(currentDirPath).forEach(name => {
      const filePath = path.join(currentDirPath, name)
      const stat = fs.statSync(filePath)
      if (stat.isFile()) {
        callback(filePath, stat)
      } else if (stat.isDirectory()) {
        walkSync(filePath, callback)
      }
    })
  }

  walkSync(sourcePath, async filePath => {
    const bucketPath = filePath.substring(sourcePath.length + 1)
    const params = {
      Key: bucketPath,
      Body: fs.readFileSync(filePath),
      ContentType: mime.lookup(filePath) || 'text/plain',
    }
    console.log(await s3.upload(params).promise())
  })
}
