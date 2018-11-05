import pgPromise from 'pg-promise'

const connStr = 'postgresql://postgres:password@localhost:5432/postgres'

const pgp = pgPromise({})
const psql = pgp(connStr)

export default psql
