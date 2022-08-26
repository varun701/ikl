import { SlashCommandBuilder } from 'discord.js'

const data = {
  name: 'ping',
}

async function execute(interaction) {
  await interaction.reply({
    content: 'Pong!',
    ephemeral: true,
  })
}

const builder = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')

export default {
  data,
  execute,
  builder,
}
