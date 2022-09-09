import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:h:MM:ss.l tt',
    },
  },
})

logger.addListener('err', (errors) => {
  for (const err of errors) {
    logger.error(err)
  }
  return
})

export default logger
