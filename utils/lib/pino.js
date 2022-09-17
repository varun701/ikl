import pino from 'pino'

const logger = pino({
  level: 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:h:MM:ss.l tt',
    },
  },
})

/**
 * Event listner of logger
 * * 'ERR' event
 * Logs pretty errors with pino
 */

logger.addListener('err', (error) => {
  if (typeof error === 'string') return logger.error(error)
  if (error.details) {
    logger.error(error.details, 'Error Stack')

    /**
     * * Alternate
     * Separate error logging */
    // for (const detail of error.details) logger.error(detail)
  }
  if (error.trace) return logger.trace(...error.trace)
  logger.trace(error.stack.split('\n'))
})

export default logger

/**
 * Custom error class to work with pino logger
 * @class MyError
 * @extends Error
 */

class MyError extends Error {
  /**
   * @param {Error} error
   * @param {String | String[]} message
   * @returns {this}
   */
  constructor(error = null, message) {
    super(message)
    if (error === null) {
      this.details = [message]
      this.trace = []
      return this
    }
    if (error.details) {
      this.details = [...error.details, message]
      this.trace = [...error.stack.split('/n'), ...error.trace]
    }
    else {
      this.details = [error.message, message]
      this.trace = [...error.stack.split('/n')]
    }
    return this
  }
  /**
   * To push more stack
   * @param {String | String[]} details
   * @returns
   */
  push(details) {
    this.details.push(details)
    return this
  }
}

globalThis.MyError = MyError
