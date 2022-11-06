import { Client } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({
  intents: Number(process.env.INTENTS),
  presence: {
    status: 'online',
    activities: [
      {
        name: process.env.ACTIVITY_NAME,
        type: Number(process.env.ACTIVITY_TYPE),
      },
    ],
  },
})

import { preLogin } from './utils/modules.js'
await preLogin(client)

client.login(process.env.TOKEN)
