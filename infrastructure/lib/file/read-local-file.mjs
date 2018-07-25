import fs from 'fs'
import path from 'path'
import util from 'util'
import dirname from './dir-name'

const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

const getAbsolutePath = filename => path.join(dirname, '../..', filename)

const readTextFile = async filename => {
  const filePath = getAbsolutePath(filename)
  return read(filePath, 'utf8')
}

const writeTextToFile = async (filename, string) => {
  const filePath = getAbsolutePath(filename)
  return write(filePath, string, 'utf8')
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

export const writeObjectToJsonFile = async (filename, object) =>
  writeTextToFile(filename, JSON.stringify(object))

export const deleteFile = async filename => unlink(getAbsolutePath(filename))
