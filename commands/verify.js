import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

const data = {
  name: 'verify',
}

async function execute(interaction) {
  // MARK: Remove this and support config at start up
  config.dCode = {
    NEW_COUPLE_LOG_MSG: 'New couple have arrived!!',
    NEW_VERIFIED_MEMBER_LOG_MSG: 'Welcome to verified only section of server!',
    NEW_VERIFIED_PLUS_MEMBER_LOG_MSG: 'Congratulations! You are now verified plus member!',
  }

  const subCommand = interaction.options.getSubcommand()
  const awardRoleID =
    subCommand === 'couple'
      ? interaction.client.KeyVC.get('ROLE_COUPLE')
      : subCommand === 'member'
        ? interaction.client.KeyVC.get('ROLE_VERIFIED')
        : interaction.client.KeyVC.get('ROLE_VERIFIED_PLUS')

  let messageContent =
    subCommand === 'couple'
      ? config.dCode.NEW_COUPLE_LOG_MSG
      : subCommand === 'member'
        ? config.dCode.NEW_VERIFIED_MEMBER_LOG_MSG
        : config.dCode.NEW_VERIFIED_PLUS_MEMBER_LOG_MSG

  const targetUser = await interaction.options.getUser('member')
  const targetMember = await interaction.guild.members.fetch(targetUser)
  await targetMember.roles.add(awardRoleID)
  const targetMemberEmbed = generateSimpleInfo(targetMember, interaction.user)
  const embedsToSend = [targetMemberEmbed]
  messageContent = messageContent.concat(`  <@${targetUser.id}>`)

  if (subCommand === 'couple') {
    const targetUserPartner = await interaction.options.getUser('partner')
    const targetMemberPartner = await interaction.guild.members.fetch(targetUserPartner)
    await targetMemberPartner.roles.add(awardRoleID)
    const targetMemberPartnerEmbed = generateSimpleInfo(targetMemberPartner, interaction.user)
    embedsToSend.push(targetMemberPartnerEmbed)
    messageContent = messageContent.concat(`  <@${targetUserPartner.id}>`)
  }

  const generalLogChannelID =
    subCommand === 'couple'
      ? interaction.client.KeyVC.get('CHANNEL_VERIFICATION_LOGS_COUPLE')
      : subCommand === 'member'
        ? interaction.client.KeyVC.get('CHANNEL_VERIFICATION_LOGS_MEMBER')
        : interaction.client.KeyVC.get('CHANNEL_VERIFICATION_LOGS_PLUS')
  const generalLogChannel = await interaction.client.channels.fetch(generalLogChannelID)
  await generalLogChannel.send({
    content: messageContent,
    embeds: embedsToSend,
  })

  const modLogChannelID = interaction.client.KeyVC.get('CHANNEL_VERIFICATION_LOGS_MODS')
  const modLogChannel = await interaction.client.channels.fetch(modLogChannelID)
  await modLogChannel.send({
    content: subCommand,
    embeds: embedsToSend,
  })

  await interaction.reply({
    content: 'Done',
    ephemeral: true,
  })
  return
}

function generateSimpleInfo(target, user) {
  return new EmbedBuilder()
    .setTitle(target.displayName)
    .setDescription(`${target.user.tag}\n\n**Moderator**\n<@${user.id}>`)
    .setThumbnail(target.displayAvatarURL())
}

async function preExecute(_client) {
  return
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
