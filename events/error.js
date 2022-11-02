import { logger } from '../utils/modules.js'

function execute(str) {
  logger.debug(str)
}

export default {
  name: 'error',
  execute,
}
