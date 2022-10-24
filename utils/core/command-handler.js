import { Collection } from 'discord.js'
import { commandsList } from '../commands.js'
import logger from '@pino'

const commands = new Collection()
/**
 * This function creates commands collection from commands list
 * @param {Client} client
 */

export default async function commandHandler(client) {
  for await (const command of commandsList) {
    if (typeof command !== 'object') throw new Error('Invalid Command Object')
    if (!command.data || !command.execute) throw new Error('Invalid Command Structre')
    commands.set(command.data.name, command.execute)

    if ('preExecute' in command) {
      try {
        await command.preExecute(client)
        logger.info(`Pre excute succeeded. Command name: ${command.data.name}`)
      }
      catch (err) {
        throw new bot.Error(`Pre execute failed. Command name: ${command.data.name}`, err)
      }
    }
  }
}

/**
 * This function handles the execution of commands
 * @param {Interaction} interaction
 */
export async function commandExecutor(interaction) {
  const executeCommand = commands.get(interaction.commandName)
  if (!executeCommand) {
    logger.error(`Unknown command Interaction. Command name: ${interaction.commandName}`)
    return
  }

  try {
    await executeCommand(interaction)
  }
  catch (e) {
    bot.error(`Command Execution failed. Command name: ${interaction.commandName}`, e)
  }
}
