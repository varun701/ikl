// eslint-disable-next-line no-unused-vars
import { ButtonInteraction } from 'discord.js'
import { commandExecutor } from '../utils/core/command-handler.js'
import { introHandler, findModule } from '../utils/modules.js'

async function execute(interaction) {
  try {
    if (interaction.isButton()) await ifButton(interaction)
    if (interaction.isCommand()) await commandExecutor(interaction)
    if (interaction.isSelectMenu()) await ifSelectMenu(interaction)
    if (interaction.isModalSubmit()) await ifModalSubmit(interaction)
  }
  catch (err) {
    logger.error(err)
  }
}

/**
 * @param {ButtonInteraction} interaction
 */
async function ifButton(interaction) {
  if (interaction.customId === 'intro') await introHandler(interaction)
  if (interaction.customId === 'find') await findModule(interaction)
  return
}

async function ifSelectMenu(_interaction) {
  return
}

async function ifModalSubmit(_interaction) {
  return
}

export default {
  name: 'interactionCreate',
  execute,
}
