import { Client } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({
  intents: Number(process.env.INTENTS),
})

import { preLogin } from './utils/modules.js'
await preLogin(client)

client.login(process.env.TOKEN)
