import { Client, GatewayIntentBits as botIntents } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()
globalThis.config = {}

const guildIntents = [botIntents.Guilds, botIntents.GuildMembers, botIntents.GuildBans]
const guildMessageIntents = [
  botIntents.GuildMessages,
  botIntents.GuildMessageReactions,
  botIntents.MessageContent,
]
const directMessageIntents = [botIntents.DirectMessages, botIntents.DirectMessageReactions]

const intents = [...guildIntents, ...guildMessageIntents, ...directMessageIntents]

const client = new Client({ intents, partials: ['CHANNEL', 'MESSAGE'] })

import beforeLogin from '@core/before-login.js'
await beforeLogin(client)

client.login(process.env.TOKEN)
