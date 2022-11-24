// eslint-disable-next-line no-unused-vars
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js'
import { getAssets, verifyAssets } from '../utils/assets.js'

const data = {
  name: 'verify',
}

const builder = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Verify members')
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('member')
      .setDescription('Give \'Verified\' role')
      .addUserOption((option) => option.setName('member').setDescription('The member').setRequired(true)),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('plus')
      .setDescription('Give \'Verified Plus\' role')
      .addUserOption((option) => option.setName('member').setDescription('The member').setRequired(true)),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('couple')
      .setDescription('Give \'Couple\' role')
      .addUserOption((option) => option.setName('member').setDescription('The member').setRequired(true))
      .addUserOption((option) => option.setName('partner').setDescription('The partner').setRequired(false)),
  )

/**
 * @param {GuildMember} member
 */
const verifyAndLog = async (member, moderator, type) => {
  const message = {
    content: verifyAssets(`message_content_${type}`, { id: member.id }),
    embeds: [
      {
        title: member.displayName,
        description: member.user.tag,
        color: 3092790,
        thumbnail: {
          url: member.displayAvatarURL(),
        },
        fields: [{ name: 'Moderator', value: `<@${moderator.id}>` }],
      },
    ],
  }
  await member.roles.add(keyv.get(`role_verified_${type}`))
  const channel = await member.client.channels.fetch(keyv.get(`channel_verified_${type}`))
  await channel?.send(message)
  const logChannel = await member.client.channels.fetch(keyv.get('channel_logs_verified'))
  await logChannel?.send(message)
}

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply()

  const type = interaction.options.getSubcommand()
  const member = interaction.options.getMember('member')
  const partner = interaction.options.getMember('partner')

  await verifyAndLog(member, interaction.member, type)
  if (partner === null || partner === undefined) {
    await verifyAndLog(partner, interaction.member, type)
  }
  await interaction.editReply(getAssets('success'))
}

export default {
  data,
  builder,
  execute,
}
