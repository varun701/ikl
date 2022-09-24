import DBs from '../database.js'
import logger from '@pino'

const force = process.argv.slice(2)[0] === 'force'

for (const DB in DBs) {
  await DBs[DB].sync(force)
}

logger.info('Database Initiated')
