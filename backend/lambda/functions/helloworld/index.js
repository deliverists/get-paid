exports.handler = (event, context, callback) => {
  console.log(`DEBUG: name is ${event.name}`)
  callback(null, `hello ${event.name}`)
}
