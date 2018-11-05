import pg from 'pg-promise'
import conn from 'lib/db-connection'

const tableName = 'timesheet_entries'

const selectById = tbl => `SELECT * FROM "${tbl}" WHERE id=$1`

export const get = args => {
  const query = new pg.ParameterizedQuery(selectById(tableName), [args.id])
  return conn.one(query)
}

export const add = args => {
  console.log('arse', args)
  const query = new pg.ParameterizedQuery(
    `INSERT INTO "${tableName}"(date, "createdAt", "updatedAt") VALUES($1, $2, $3) RETURNING id, date`,
    [args.date, new Date(), new Date()],
  )
  return conn.one(query)
}
