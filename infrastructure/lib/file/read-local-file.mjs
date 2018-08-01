import fs from 'fs'
import util from 'util'

const read = util.promisify(fs.readFile)
const write = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

export const readTextFile = async filename => read(filename, 'utf8')
export const writeTextToFile = async (filename, string) =>
  write(filename, string, 'utf8')

export const readBinaryFileSync = filename => fs.readFileSync(filename)

export const getStream = filename => {
  const stream = fs.createReadStream(filename)
  stream.on('error', err => {
    throw err
  })
  return stream
}

export const readJsonFile = async filename =>
  JSON.parse(await readTextFile(filename))

export const writeObjectToJsonFile = async (filename, object) =>
  writeTextToFile(filename, JSON.stringify(object))

export const deleteFile = async filename => unlink(filename)
