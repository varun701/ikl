import ping from '@commands/ping.js'
import verify from '@commands/verify.js'

export const commandsList = [ping, verify]

import ready from '@events/ready.js'
import interactionCreate from '@events/interactionCreate.js'

export const eventsList = [ready, interactionCreate]
