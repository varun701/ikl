import pino from 'pino'
import pretty from 'pino-pretty'
import path from 'path'
import SonicBoom from 'sonic-boom'
import dateFormat from 'dateformat'

const streams = [
  {
    level: 'trace',
    stream: pretty({
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:hh:MM TT',
    }),
  },
  {
    level: 'trace',
    stream: pretty({
      colorize: false,
      ignore: 'hostname',
      translateTime: 'SYS:hh:MM:ss.l TT, dd-mm-yy',
      destination: new SonicBoom({
        sync: true,
        mkdir: true,
        // dest: path.resolve('logs', 'logs.log'),
        dest: path.resolve('logs', `${dateFormat(Date.now(), 'ddmmyyhhMM')}.log`),
      }),
    }),
  },
]

const logger = pino(
  {
    level: 'trace',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream(streams),
)

/**
 * Event listner of logger
 * * 'ERR' event
 * Logs pretty errors with pino
 */

logger.addListener('err', (error) => {
  // if (typeof error === 'string') return logger.error(error)
  if (error.details) {
    logger.error(error.details, 'Error Stack')
    logger.trace(...error.trace)
    return

    /**
     * * Alternate
     * Separate error logging */
    // for (const detail of error.details) logger.error(detail)
  }
  else {
    logger.trace(...error.stack.split('/n'))
    console.log(error.stack)
    // logger.trace(error)
  }
})

export default logger

/**
 * Custom error class to work with pino logger
 * @class MyError
 * @extends Error
 */

class MyError extends Error {
  /**
   * @param {String | String[]} message
   * @param {Error} error
   * @returns {this}
   */
  constructor(message, error = null) {
    super(message)
    if (error === null) {
      this.details = [message]
      this.trace = this.stack.split('\n')
      return this
    }
    if (error.details) {
      this.details = [...error.details, message]
      const oldTrace = error.trace
      const newTrace = this.stack.split('\n')
      oldTrace.push(...newTrace)
      this.trace = oldTrace
    }
    else {
      this.details = [error.message, message]
      this.trace = [...error.stack.split('/n'), ...this.stack.split('/n')]
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
