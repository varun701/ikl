import { Collection } from 'discord.js'
import { commandsList } from '../../commands.js'
import logger from '@pino'

const commands = new Collection()
/**
 * This function creates commands collection from commands list
 * @param {Client} client
 * @returns void
 */

export async function commandHandlerInitial(client) {
  for await (const command of commandsList) {
    if (typeof command !== 'object') throw new Error('Invalid Command Object')
    if (!command.data || !command.execute) throw new Error('Invalid Command Structre')
    commands.set(command.data.name, command.execute)

    if (command.preExecute) {
      try {
        await command.preExecute(client)
        logger.info(`Pre excute succeeded. Command name: ${command.data.name}`)
      }
      catch (e) {
        throw new MyError(e, `Pre execute failed. Command name: ${command.data.name}`)
      }
    }
  }
}

/**
 * This function handles the execution of commands
 * @param {Interaction} interaction
 * @returns void
 */
export default async function commandHandler(interaction) {
  const executeCommand = commands.get(interaction.commandName)
  if (!executeCommand) {
    logger.emit('err', `Unknown command Interaction. Command name: ${interaction.commandName}`)
    return
  }

  try {
    await executeCommand(interaction)
  }
  catch (e) {
    logger.emit(
      'err',
      new MyError(e, `Command Execution failed. Command name: ${interaction.commandName}`),
    )
  }
}
