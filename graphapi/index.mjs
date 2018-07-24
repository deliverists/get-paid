const executeasync = async () => {
  console.log('graph')
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
