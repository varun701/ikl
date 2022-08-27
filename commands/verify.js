import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

const data = {
  name: 'verify',
}

async function execute(interaction) {
  const subCommand = interaction.options.getSubcommand()
  const awardRoleID =
    subCommand === 'couple'
      ? interaction.client.KeyVC.get('ROLE_COUPLE')
      : subCommand === 'member'
        ? interaction.client.KeyVC.get('ROLE_VERIFIED')
        : interaction.client.KeyVC.get('ROLE_VERIFIED_PLUS')

  const targetUser = await interaction.options.getUser('member')
  const targetMember = await interaction.guild.members.fetch(targetUser)
  await targetMember.roles.add(awardRoleID)

  if (subCommand === 'couple') {
    const targetUserPartner = await interaction.options.getUser('partner')
    const targetMemberPartner = await interaction.guild.members.fetch(targetUserPartner)
    await targetMemberPartner.roles.add(awardRoleID)
  }
  await interaction.reply({
    content: 'Done',
    ephemeral: true,
  })
  return
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
