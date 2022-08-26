import ping from '@commands/ping.js'

export const commandsList = [ping]

import ready from '@events/ready.js'
import interactionCreate from '@events/interactionCreate.js'

export const eventsList = [ready, interactionCreate]
