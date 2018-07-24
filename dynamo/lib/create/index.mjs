import tables from './tables'

const recreateTable = async (dynamo, params) => {
  const list = await dynamo.listTables().promise()
  if (list.TableNames.includes(params.TableName))
    await dynamo.deleteTable({ TableName: params.TableName }).promise()
  const table = await dynamo.createTable(params).promise()
  console.log(table)
}

export default async dynamo => {
  const recreate = recreateTable.bind(null, dynamo)
  tables.forEach(async params => recreate(params))
}
