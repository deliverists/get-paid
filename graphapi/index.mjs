import init from 'lib/schema'

const executeasync = async () => {
  init()
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
