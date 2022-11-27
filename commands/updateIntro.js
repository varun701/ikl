import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js'
import { Intro } from '../utils/core/database.js'
import { introAssets, getAssets } from '../utils/assets.js'
import { getProfileRoles, getProfileDetails, getIntroObject } from '../utils/modules.js'
import { profileCardGenerator } from '../utils/modules.js'

const data = {
  name: 'Update Intro',
}

const builder = new ContextMenuCommandBuilder()
  .setName('Update Intro')
  .setDMPermission(false)
  .setType(ApplicationCommandType.User)

/**
 * @param {UserContextMenuCommandInteraction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply({ ephemeral: true })

  const targetMember = interaction.targetMember
  const intro_fetched = await Intro.findByPk(interaction.targetId)
  if (intro_fetched === null) {
    await interaction.editReply(introAssets('no_intro'))
    return
  }

  const profileRoles = getProfileRoles(targetMember)
  const profileDetails = getProfileDetails(targetMember)

  const introObject_fetched = intro_fetched.get('data')
  const introObject = getIntroObject(introObject_fetched, profileRoles, profileDetails, {}, {})
  try {
    await profileCardGenerator(introObject, interaction.client)
  }
  catch (e) {
    throw new bot.Error('Intro not created.', e)
  }

  await interaction.editReply(getAssets('success'))
}

export default {
  data,
  builder,
  execute,
}