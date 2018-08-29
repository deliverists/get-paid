import tables from './tables'

const recreateTable = async (dynamo, table) => {
  const name = { TableName: table.TableName }
  const list = await dynamo.listTables().promise()
  if (list.TableNames.includes(table.TableName))
    await dynamo.deleteTable(name).promise()
  const info = await dynamo
    .createTable(Object.assign({}, table.Properties, name))
    .promise()
  console.log(info)
  const itemInfo = await dynamo
    .putItem({
      TableName: 'Invoices',
      Item: {
        id: { S: '123' },
        date: { S: 'some snoopy string' },
      },
    })
    .promise()
  console.log(itemInfo)
}

export default async dynamo => {
  const recreate = recreateTable.bind(null, dynamo)
  tables.forEach(async params => recreate(params))
}
