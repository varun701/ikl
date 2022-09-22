import commandHandler from '@utils/modules/core/command-handler.js'
import logger from '@pino'

async function execute(interaction) {
  try {
    if (interaction.isButton()) await ifButton(interaction)
    if (interaction.isCommand()) await commandHandler(interaction)
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
