// eslint-disable-next-line no-unused-vars
import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from 'discord.js'
import https from 'https'
import fs from 'fs'
import { jsonDataParser, getAssets } from '../utils/assets.js'

const data = {
  name: 'notice',
}

const builder = new SlashCommandBuilder()
  .setName('notice')
  .setDescription('Send notice from JSON')
  .setDMPermission(false)
  .addSubcommand((subcommand) =>
    subcommand
      .setName('check')
      .setDescription('Check Message JSON FIle')
      .addAttachmentOption((option) => option.setName('json').setDescription('Message JSON File').setRequired(true)),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('member')
      .setDescription('Send notice to member')
      .addUserOption((option) =>
        option.setName('member').setDescription('The member you want to send notice to').setRequired(true),
      )
      .addAttachmentOption((option) => option.setName('json').setDescription('Message JSON File').setRequired(true)),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('channel')
      .setDescription('Send notice to channel')
      .addChannelOption((option) =>
        option.setName('channel').setDescription('The channel you want to send notice to').setRequired(true),
      )
      .addAttachmentOption((option) =>
        option.setName('json').setDescription('Message JSON File to send').setRequired(true),
      ),
  )

/**
 * @param {ChatInputCommandInteraction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply({ ephemeral: true })

  const jsonAttachment = interaction.options.getAttachment('json')
  const url = jsonAttachment.url

  https.get(url, (res) => {
    const path = `${interaction.id}.json`
    const writeStream = fs.createWriteStream(path)
    res.pipe(writeStream)

    writeStream.on('finish', async () => {
      writeStream.close()
      const messageBuffer = fs.readFileSync(path)
      const message = jsonDataParser(messageBuffer)
      fs.unlinkSync(path)

      const type = interaction.options.getSubcommand()
      if (type === 'check') {
        await interaction.editReply(message)
        return
      }

      const channel =
        type === 'channel'
          ? interaction.options.getChannel('channel')
          : await interaction.options.getUser('member').createDM()

      if (channel === null || channel === undefined) {
        await interaction.editReply('Could not fetch channel')
        return
      }
      if (channel.type !== ChannelType.DM && channel.type !== ChannelType.GuildText) {
        await interaction.editReply('Invalid channel type')
        return
      }
      await channel?.send(message)
      await interaction.editReply(getAssets('success'))
    })
  })
}

export default {
  data,
  builder,
  execute,
}
