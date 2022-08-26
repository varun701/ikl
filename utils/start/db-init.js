import DBs from '@core/database-handler.js'

const force = process.argv.slice(2)[0] === 'force'

for (const DB in DBs) {
  await DBs[DB].sync(force)
}
