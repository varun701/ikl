import eventHandler from './event-handler.js'
import { commandHandlerInitial } from './command-handler.js'
import { botInitial } from '../database.js'
import logger from '@pino'

/**
 * * This function is executed before client login
 * @param {Client} client
 * @returns void
 */

export async function preLogin(client) {
  try {
    await botInitial(client) // script for client.keyv(keyv.sqlite), bot.keyv(key.env), sqlite databases
    eventHandler(client)
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
