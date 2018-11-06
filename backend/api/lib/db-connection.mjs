import pgPromise from 'pg-promise'

const connStr = 'postgresql://postgres:password@db:5432/postgres'

const pgp = pgPromise({})
const psql = pgp(connStr)

export default psql
