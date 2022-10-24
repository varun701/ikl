import logger from '@pino'

export default function errorHandler() {
  /**
   * Custom error class to work with pino logger
   * @extends Error
   */

  class MyError extends Error {
    /**
     * @param {String} message
     * @param {Error} error default `null`
     * @returns {MyError}
     */
    constructor(message, error = null) {
      super(message)
      if (error === null) {
        this.details = [message]
        this.trace = this.stack.split('\n')
      }
      else if ('details' in error) {
        this.details = [...error.details, message]
      }
      else {
        this.details = [error.message, message]
        this.trace = error.stack.split('\n')
      }
      return this
    }
    /**
     * To push more stack
     * @param {string[]} details
     * @returns {MyError}
     */
    push(details) {
      this.details.push(...details)
      return this
    }
  }

  bot.Error = MyError
  bot.error = (msg, err = null) => {
    logger.emit('err', new MyError(msg, err))
  }
}
