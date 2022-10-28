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

export const logger = pino(
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

logger.addListener(
  'err',
  /**
   * @param {Error} error
   */
  (error) => {
    if ('details' in error) {
      const traceMessage = error.trace.shift(1)
      const message = error.details.shift(1)
      logger.error(error.details, message)
      logger.trace(error.trace, traceMessage)
      /**
       * * Alternate
       * Separate error logging */
      // for (const detail of error.details) logger.error(detail)
    }
    else {
      const trace = error.stack.split('\n')
      const traceMessage = trace.shift(1)
      logger.error(error.message)
      logger.trace(trace, traceMessage)
    }
  },
)
