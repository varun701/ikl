import { eventsList } from '../events.js'

/**
 * This function configures client events exported from list.js
 * @param {Client} client
 */

export default function eventHandler(client) {
  for (const event of eventsList) {
    if ('once' in event) {
      client.once(event.name, (...args) => event.execute(...args))
    }
    else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
}
