import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'
import { Intro } from '../utils/core/database.js'
import { introAssets } from '../utils/assets.js'

const data = {
  name: 'View Intro',
}

const builder = new ContextMenuCommandBuilder()
  .setName('View Intro')
  .setDMPermission(false)
  .setType(ApplicationCommandType.User)

const execute = async (interaction) => {
  await interaction.deferReply({ ephemeral: true })

  const intro = await Intro.findByPk(interaction.targetId)
  if (intro === null) {
    await interaction.editReply(introAssets('no_intro'))
    return
  }

  await interaction.editReply({
    files: [intro.get('profileCardUrl')],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'Full Intro',
            url: intro.get('introUrl'),
          },
        ],
      },
    ],
  })
}

export default {
  data,
  builder,
  execute,
}
