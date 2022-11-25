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
        this.trace = error.trace
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

  Reflect.defineProperty(global.bot, 'Error', {
    value: MyError,
  })

  Reflect.defineProperty(global.bot, 'error', {
    value: (msg, err = null) => {
      const error = new MyError(msg, err)
      error.trace.splice(1, 1)
      logger.emit('err', error)
    },
  })
}
