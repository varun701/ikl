import botInitial from '../modules/database.js'
import commandHandler from './command-handler.js'
import errorHandler from './error-handler.js'
import eventHandler from './event-handler.js'

/**
 * * This function is executed before client login
 * @param {Client} client
 */

export async function preLogin(client) {
  errorHandler(client)
  await botInitial(client)
  eventHandler(client)
  await commandHandler(client)
}
