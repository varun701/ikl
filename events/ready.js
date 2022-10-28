import { logger } from '../utils/modules.js'
import { time } from 'discord.js'
import dateFormat from 'dateformat'
// import { statusModule } from '../utils/modules.js'

async function execute(client) {
  logger.info('Bot is online')
  const timeStamp = Date.now()

  bot.set('bootTime', dateFormat(timeStamp, 'hh:MM TT, dd mmmm yyyy'))
  bot.set('bootTimeString', time(timeStamp, 'R'))

  // await statusModule(client)
}

export default {
  name: 'ready',
  once: true,
  execute,
}
