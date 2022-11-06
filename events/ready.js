import { onLogin } from '../utils/modules.js'

async function execute(client) {
  logger.info('Bot is online')
  await onLogin(client)
}

export default {
  name: 'ready',
  once: true,
  execute,
}
