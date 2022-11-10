export const warn = {
  name: 'warn',
  execute: (msg) => {
    logger.warn(msg)
  },
}
export const error = {
  name: 'error',
  execute: (msg) => {
    logger.error(msg)
  },
}

export const debug = {
  name: 'debug',
  execute: (msg) => {
    logger.debug(msg)
  },
}
