import { commandExecutor } from '../utils/core/command-handler.js'
import { logger } from '../utils/modules.js'

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

async function ifButton(_interaction) {
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
