import { Client, Collection } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()
globalThis.bot = new Collection()

const client = new Client({
  intents: Number(process.env.INTENTS),
  presence: {
    status: 'online',
    activities: [
      {
        name: process.env.activityName,
        type: Number(process.env.activityType),
      },
    ],
  },
})

import { preLogin } from './utils/modules.js'
await preLogin(client)

client.login(process.env.TOKEN)
