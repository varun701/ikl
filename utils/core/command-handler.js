import { Collection } from 'discord.js'
import { commandsList } from '@core/list.js'

export function commandHandlerInitial(client) {
  client.commands = new Collection()
  for (const command of commandsList) {
    client.commands.set(command.data.name, command.execute)
  }
  return
}

export default async function(interaction) {
  const executeCommand = interaction.client.commands.get(interaction.commandName)
  if (!executeCommand) return
  await executeCommand(interaction)
  return
}
