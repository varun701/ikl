import logger from '@pino'

function execute(str) {
  logger.debug(str)
}

export default {
  name: 'debug',
  execute,
}
