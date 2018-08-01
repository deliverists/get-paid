import path from 'path'

const dirname = path.dirname(new URL(import.meta.url).pathname)

export const filenameRelativeToInfrastructure = filename => path.join(dirname, '../..', filename)
export const filenameRelativeToProjectRoot = filename => path.join(dirname, '../../..', filename)
