import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ContextMenuCommandBuilder,
  // eslint-disable-next-line no-unused-vars
  UserContextMenuCommandInteraction,
} from 'discord.js'
import { getFromDatabase } from '../utils/modules/profile-manager.js'

const data = {
  name: 'View Profile',
}

/**
 * @param {UserContextMenuCommandInteraction} interaction
 */

async function execute(interaction) {
  const targetUser = interaction.targetUser

  const profile = await getFromDatabase(targetUser.id)

  if (profile === null) {
    await interaction.reply({
      content: 'The target user does not have profile.',
      ephemeral: true,
    })
    return
  }

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel('Full Profile').setStyle(ButtonStyle.Link).setURL(profile.msgUrl),
  )

  await interaction.reply({
    content: profile.imgUrl,
    components: [actionRow],
    ephemeral: true,
  })
}

const builder = new ContextMenuCommandBuilder()
  .setName('Show Profile')
  .setType(ApplicationCommandType.User)
  .setDMPermission(false)

export default {
  data,
  execute,
  builder,
}
