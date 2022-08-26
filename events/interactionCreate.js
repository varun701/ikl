import commandHandler from '@core/command-handler.js'
import database from '@core/database-handler.js'
import keyv from '@lib/keyv.js'

async function execute(interaction) {
  try {
    if (interaction.isButton()) await ifButton(interaction)
    if (interaction.isCommand()) await commandHandler(interaction)
    if (interaction.isSelectMenu()) await ifSelectMenu(interaction)
    if (interaction.isModalSubmit()) await ifModalSubmit(interaction)
  }
  catch (err) {
    console.error(err)
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
