import Sequelize from 'sequelize'

const executeasync = async () => {
  const sequelize = new Sequelize('postgres', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorsAliases: false,
  })

  const Timesheet = sequelize.define('timesheet', {
    name: Sequelize.STRING,
  })

  await sequelize.sync()
  const result = await Timesheet.create({
    name: 'nick',
  })
  console.log(result.toJSON())
  await sequelize.close()
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
