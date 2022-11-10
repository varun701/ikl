import ready from '../events/ready.js'
import { warn, error, debug } from '../events/exceptions.js'
import interactionCreate from '../events/interactionCreate.js'

export const eventsList = [ready, warn, error, debug, interactionCreate]
