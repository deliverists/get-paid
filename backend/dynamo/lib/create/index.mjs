import tables from '../../templates'

const recreateTable = async (dynamo, { TableName, Properties, Data }) => {
  const name = { TableName }
  const list = await dynamo.listTables().promise()
  if (list.TableNames.includes(TableName)) await dynamo.deleteTable(name).promise()
  const info = await dynamo
    .createTable(Object.assign({}, Properties, name))
    .promise()
  console.log(info)
  Data.forEach(async Item => {
    const itemInfo = await dynamo.putItem({ TableName, Item }).promise()
    console.log(itemInfo)
  })
}

export default async dynamo => {
  const recreate = recreateTable.bind(null, dynamo)
  tables.forEach(async params => recreate(params))
}
