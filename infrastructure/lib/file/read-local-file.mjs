import fs from 'fs'
import path from 'path'
import util from 'util'
import dirname from './dir-name'

const getAbsolutePath = filename => path.join(dirname, '../..', filename)

const readTextFile = async filename => {
  const filePath = getAbsolutePath(filename)
  const readFile = util.promisify(fs.readFile)
  return readFile(filePath, 'utf8')
}

const writeTextToFile = async (filename, string) => {
  const filePath = getAbsolutePath(filename)
  const writeFile = util.promisify(fs.writeFile)
  return writeFile(filePath, string, 'utf8')
}

export const readBinaryFileSync = filename => {
  const filePath = getAbsolutePath(filename)
  return fs.readFileSync(filePath)
}

export const getStream = filename => {
  const filePath = getAbsolutePath(filename)
  const stream = fs.createReadStream(filePath)
  stream.on('error', err => {
    throw err
  })
  return stream
}

export const readJsonFile = async filename =>
  JSON.parse(await readTextFile(filename))

export const writeObjectToFileAsJson = async (filename, object) =>
  writeTextToFile(filename, JSON.stringify(object))
