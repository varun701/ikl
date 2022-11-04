import { Collection } from 'discord.js'
import loggerCreator from '../lib/logger.js'
import keyvLoader from '../modules/database.js'
import commandHandler from './command-handler.js'
import errorHandler from './error-handler.js'
import eventHandler from './event-handler.js'

/**
 * * This function is executed before client login
 * @param {Client} client
 */

export async function preLogin(client) {
  globalThis.bot = new Collection()
  globalThis.keyv
  globalThis.logger

  loggerCreator()
  errorHandler()
  await keyvLoader()
  eventHandler(client)
  await commandHandler(client)
}
