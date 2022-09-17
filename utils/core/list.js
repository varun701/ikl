import ping from '@commands/ping.js'
import verify from '@commands/verify.js'
import test from '@commands/test.js'
import profile from '@commands/profile.js'

// export const commandsList = [ping, profile, test]
export const commandsList = [test, verify, ping, profile]

import ready from '@events/ready.js'
import interactionCreate from '@events/interactionCreate.js'

export const eventsList = [ready, interactionCreate]
