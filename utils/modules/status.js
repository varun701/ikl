// eslint-disable-next-line no-unused-vars
import { Client, EmbedBuilder } from 'discord.js'

/**
 *
 * @param {Client} client
 */
export const statusModule = async (client) => {
  // todo: get the message and channel id from client.keyv
  // todo: if not make one
  // todo: edit every 10 minutes
  // todo: counter

  console.log(client.keyv)
  if ('CHANNEL_STATUS' in client.keyv === false) {
    client.channels.fetch('1009303050478948382').then((ch) => ch.send('some'))
    return
  }

  const statusChannel = await client.channels.fetch(client.keyv.CHANNEL_STATUS)
  if (statusChannel === null) throw new bot.Error('Status Channel not fetched')

  const statusMessage = await client.channels.fetch(client.keyv.MESSAGE_STATUS)
  if (statusMessage === null) throw new bot.Error('Status Message not fetched')

  const statusEmbed = new EmbedBuilder()
    .setTitle('Bot Status')
    .setDescription(
      `The bot has been running since ${bot.keyv.bootTimeString} and was used ${bot.keyv.useCount} times in that time!`,
    )

  if (bot.keyv.issuesString === null) {
    statusEmbed.setFields(
      {
        name: 'Issues',
        value: bot.keyv.issuesString,
      },
      {
        value: 'If you find any issues that are not mentioned here please let us know.',
      },
    )
  }

  await statusMessage.edit({
    embed: statusEmbed,
  })
}
