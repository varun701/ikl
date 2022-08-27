import eventHandler from '@core/event-handler.js'
import { commandHandlerInitial } from '@core/command-handler.js'
import { keyvcInitial } from '@core/database-handler.js'

export default async function(client) {
  await keyvcInitial(client)
  eventHandler(client)
  await commandHandlerInitial(client)
  return
}
