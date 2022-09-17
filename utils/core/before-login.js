import eventHandler from '@core/event-handler.js'
import { commandHandlerInitial } from '@core/command-handler.js'
import { botInitial } from '@core/database-handler.js'
import logger from '@pino'

/**
 * * This function is executed before client login
 * @param {Client} client
 * @returns void
 */

export default async function(client) {
  try {
    await botInitial(client) // script for client.keyv(keyv.sqlite), bot.keyv(key.env), sqlite databases
    await eventHandler(client)
    await commandHandlerInitial(client)
  }
  catch (e) {
    await logger.emit(
      'err',
      new MyError(e, 'Error occured during bot initialisation in before Login Script'),
    )
  }
  return true
}
