import { info } from '@chalk'

function execute(client) {
  info('Bot is online')
  console.log(client.KeyVC)
}

export default {
  name: 'ready',
  once: true,
  execute,
}
