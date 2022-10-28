import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { buttonCollector } from '../utils/functions.js'

const data = {
  name: 'notice',
}

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true })

  const subCommand = interaction.options.getSubcommand()

  if (subCommand === 'role') return

  const targetUser = interaction.options.getUser('member')
  const target = await interaction.guild.members.fetch(targetUser)

  const title = interaction.options.getString('title')
  const description = interaction.options.getString('message')

  const messageEmbed = new EmbedBuilder()
    .setDescription(description)

  if (title !== null) messageEmbed.setTitle(title)

  const message = await interaction.editReply({
    embeds: [messageEmbed],
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Confirm')
            .setCustomId('confirm')
            .setStyle(ButtonStyle.Success),
        )
        .addComponents(
          new ButtonBuilder()
            .setLabel('Cancel')
            .setCustomId('cancel')
            .setStyle(ButtonStyle.Danger),
        ),
    ],
  })

  await buttonCollector(message, async (err, buttonInteraction) => {
    if (err) {
      await interaction.editReply({
        content: 'You did not select any.',
        components: [],
        embeds: [],
      })
      return
    }

    await buttonInteraction.deferReply({ ephemeral: true })
    const buttonSelected = buttonInteraction.customId
    console.log(buttonSelected)
    if (buttonSelected === 'confirm') {
      const dms = await target.createDM()
      if (dms) await dms.send({ embeds: [messageEmbed] })
      await buttonInteraction.editReply('Done')
    }
    else {
      await buttonInteraction.editReply('canceled')
    }
  })

}

const builder = new SlashCommandBuilder()
  .setName('notice')
  .setDescription('Send notice')
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('member')
      .setDescription('Send notice to a member')
      .addUserOption((option) =>
        option.setName('member').setDescription('The member').setRequired(true),
      )
      .addStringOption((option) =>
        option.setName('message').setDescription('The message').setRequired(true),
      )
      .addStringOption((option) =>
        option.setName('title').setDescription('The title').setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('role')
      .setDescription('Send notice to role holders')
      .addRoleOption((option) =>
        option.setName('role').setDescription('The role').setRequired(true),
      ),
  )

export default {
  data,
  builder,
  execute,
}