import ready from '../events/ready.js'
import debug from '../events/debug.js'
import error from '../events/error.js'
import messageCreate from '../events/messageCreate.js'
import interactionCreate from '../events/interactionCreate.js'

export const eventsList = [ready, debug, error, interactionCreate, messageCreate]
