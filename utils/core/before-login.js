import eventHandler from '@core/event-handler.js'
import { commandHandlerInitial } from '@core/command-handler.js'

export default async function(client) {
  commandHandlerInitial(client)
  eventHandler(client)
  return
}
