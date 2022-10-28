import { DBs } from '../modules/database.js'
import { logger } from '../modules.js'

const force = process.argv.slice(2)[0] === 'force'

for (const DB in DBs) {
  await DBs[DB].sync(force)
}

logger.info('Database Initiated')
