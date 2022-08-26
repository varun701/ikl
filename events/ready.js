import { info } from '@chalk'

function execute(_client) {
  info('Bot is online')
}

export default {
  name: 'ready',
  once: true,
  execute,
}
