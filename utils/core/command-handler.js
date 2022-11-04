import { Collection } from 'discord.js'
import { commandsList } from '../commands.js'

const commands = new Collection()
/**
 * This function creates commands collection from commands list
 * @param {Client} client
 */

export default async function commandHandler(client) {
  for await (const command of commandsList) {
    commands.set(command.data.name, command.execute)

    if ('setup' in command) {
      try {
        await command.setup(client)
        logger.info(`Setup Done. Command name: ${command.data.name}`)
      }
      catch (err) {
        throw new bot.Error(`Setup Failed. Command name: ${command.data.name}`, err)
      }
    }
    logger.info(`Command Enabled. Command name: ${command.data.name}`)
  }
}

/**
 * This function handles the execution of commands
 * @param {Interaction} interaction
 */
export async function commandExecutor(interaction) {
  const executeCommand = commands.get(interaction.commandName)
  if (!executeCommand) {
    logger.error(`Unknown Command Interaction. Command name: ${interaction.commandName}`)
    return
  }

  try {
    await executeCommand(interaction)
  }
  catch (e) {
    bot.error(`Command Execution Failed. Command name: ${interaction.commandName}`, e)
  }
}
