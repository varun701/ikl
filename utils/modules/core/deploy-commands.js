import { Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import logger from '@pino'

import dotenv from 'dotenv'
dotenv.config()

import { commandsList } from '../../commands.js'
const commandBuilders = commandsList.map((command) => command.builder.toJSON())
const commandScope =
  process.argv.slice(2)[0] === 'test'
    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID_MAIN)
    : Routes.applicationCommands(process.env.CLIENT_ID)

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

rest
  .put(commandScope, {
    body: commandBuilders,
  })
  .then(() => logger.info('Successfully registered application commands.'))
  .catch((error) => logger.error`${error}`)
