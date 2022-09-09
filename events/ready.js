import logger from '@pino'

function execute(_client) {
  logger.info('Bot is online')

  const timeStamp = Date.now()
  bot.set('startedAt', timeStamp.toString())
}

export default {
  name: 'ready',
  once: true,
  execute,
}
