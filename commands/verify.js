import {
  // eslint-disable-next-line no-unused-vars
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import logger from '@pino'

const data = {
  name: 'verify',
}

let dmMember, dmPlus, dmCouple

/**
 * @param {ChatInputCommandInteraction} interaction
 * @returns void
 */

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true })

  // Determine action, content
  const subCommand = interaction.options.getSubcommand()
  const awardRoleID =
    subCommand === 'couple'
      ? interaction.client.keyv.get('ROLE_COUPLE')
      : subCommand === 'member'
        ? interaction.client.keyv.get('ROLE_VERIFIED')
        : interaction.client.keyv.get('ROLE_VERIFIED_PLUS')

  let messageContent =
    subCommand === 'couple'
      ? bot.keyv.log_msg_new_couple
      : subCommand === 'member'
        ? bot.keyv.log_msg_new_verified_member
        : bot.keyv.log_msg_new_verified_plus

  const personalMessage =
    subCommand === 'couple' ? dmCouple : subCommand === 'member' ? dmMember : dmPlus

  // target, add role
  const targetUser = interaction.options.getUser('member')
  const target = await interaction.guild.members.fetch(targetUser)
  await target.roles.add(awardRoleID)

  // target, embed
  const targetMemberEmbed = generateVerificationDetails(target, interaction.user)
  const embedsToSend = [targetMemberEmbed]
  messageContent = messageContent.concat(`  <@${target.id}>`)

  // partner, add role
  let targetPartnerUser
  if (subCommand === 'couple') {
    targetPartnerUser = interaction.options.getUser('partner')
    const targetPartner = await interaction.guild.members.fetch(targetPartnerUser)
    await targetPartner.roles.add(awardRoleID)

    // partner, embed
    const targetMemberPartnerEmbed = generateVerificationDetails(targetPartner, interaction.user)
    embedsToSend.push(targetMemberPartnerEmbed)
    messageContent = messageContent.concat(`  <@${targetPartner.id}>`)
  }

  // log messages
  const logChannelID =
    subCommand === 'couple'
      ? interaction.client.keyv.get('CHANNEL_VERIFICATION_LOGS_COUPLE')
      : subCommand === 'member'
        ? interaction.client.keyv.get('CHANNEL_VERIFICATION_LOGS_MEMBER')
        : interaction.client.keyv.get('CHANNEL_VERIFICATION_LOGS_PLUS')
  const logChannel = await interaction.client.channels.fetch(logChannelID)
  await logChannel.send({
    content: messageContent,
    embeds: embedsToSend,
  })

  // mod log messages
  const modLogChannelID = interaction.client.keyv.get('CHANNEL_VERIFICATION_LOGS_MODS')
  const modLogChannel = await interaction.client.channels.fetch(modLogChannelID)
  await modLogChannel.send({
    content: subCommand, // name of subcommand, different thn log
    embeds: embedsToSend,
  })

  // dm message
  let msg = 'Done'
  try {
    const dms = await target.createDM()
    if (dms) await dms.send({ embeds: [personalMessage] })
    msg = msg.concat('\nDM message sent')
    msg = msg.concat('\nDM message sent')
  }
  catch (e) {
    msg = msg.concat('\nCan not send dm message', target.id)
  }
  try {
    if (targetPartnerUser) {
      const dmsPartner = await targetPartnerUser.createDM()
      if (dmsPartner) await dmsPartner.send({ embeds: [personalMessage] })
    }
  }
  catch (e) {
    msg = msg.concat('\nCan not send dm message', targetPartnerUser.id)
  }

  // edit reply, done
  await interaction.editReply({
    content: msg,
    ephemeral: true,
  })
  logger.info(`Verify command executed, subcommand: ${subCommand}`)
}

/**
 * This function generates verification details embed to be sent in log and modlog channel
 * @param {GuildMember} target the member to be verified
 * @param {GuildMember} user the moderator
 * @returns void
 */
function generateVerificationDetails(target, user) {
  return new EmbedBuilder()
    .setTitle(target.displayName)
    .setDescription(`${target.user.tag}\n\n**Moderator**\n<@${user.id}>`)
    .setThumbnail(target.displayAvatarURL())
}

/**
 * This function generates the embeds to be used in personal notice message
 * @param {Client} _client
 */

async function preExecute(_client) {
  dmMember = new EmbedBuilder()
    .setTitle('Verified Member')
    .setDescription(bot.keyv.personal_msg_new_member)
  dmPlus = new EmbedBuilder()
    .setTitle('Verified Plus Member')
    .setDescription(bot.keyv.personal_msg_new_plus)
  dmCouple = new EmbedBuilder()
    .setTitle('Verified Couple')
    .setDescription(bot.keyv.personal_msg_new_couple)
}

const builder = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Verify the user')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('member')
      .setDescription('Give \'Verified\' role')
      .addUserOption((option) =>
        option.setName('member').setDescription('The member').setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('plus')
      .setDescription('Give \'Verified Plus\' role')
      .addUserOption((option) =>
        option.setName('member').setDescription('The member').setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('couple')
      .setDescription('Give \'Couple\' role')
      .addUserOption((option) =>
        option.setName('member').setDescription('The member').setRequired(true),
      )
      .addUserOption((option) =>
        option.setName('partner').setDescription('The partner').setRequired(true),
      ),
  )
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewGuildInsights)

export default {
  data,
  builder,
  execute,
  preExecute,
}
