import { Routes } from 'discord.js'
import { REST } from '@discordjs/rest'

import dotenv from 'dotenv'
dotenv.config()

import { commandsList } from '@core/list.js'
const commandBuilders = commandsList.map((command) => command.builder.toJSON())
const commandScope =
  process.argv.slice(2)[0] === 'test'
    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
    : Routes.applicationCommands(process.env.CLIENT_ID)

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

rest
  .put(commandScope, {
    body: commandBuilders,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error)
