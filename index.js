import { Client, Collection, GatewayIntentBits as Intents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()
globalThis.bot = new Collection()

const intents = [Intents.Guilds, Intents.GuildMembers, Intents.GuildBans]

const client = new Client({ intents })

import beforeLogin from '@core/before-login.js'
await beforeLogin(client)

client.login(process.env.TOKEN)
