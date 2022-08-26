import { eventsList } from '@core/list.js'

export default function(client) {
  for (const event of eventsList) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    }
    else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
}
