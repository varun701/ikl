import {
  AttachmentBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js'
import EventEmitter from 'events'
import logger from '@pino'

export const profileManager = new EventEmitter()

profileManager.on('send', async (imgBuff, dataObj, client) => {
  try {
    const img = new AttachmentBuilder(imgBuff)
    const intro = dataObj.intro
    const embeds = []

    if (intro.lookingFor !== '' || intro.lookingFor === null) {
      embeds.push(
        new EmbedBuilder()
          .setTitle('Looking for')
          .setDescription(intro.lookingFor)
          .setColor('#2f3136'),
      )
    }
    if (intro.interests !== '' || intro.interests === null) {
      embeds.push(
        new EmbedBuilder()
          .setTitle('Interests')
          .setDescription(intro.interests)
          .setColor('#2f3136'),
      )
    }
    if (intro.aboutMe !== '' || intro.aboutMe === null) {
      embeds.push(
        new EmbedBuilder().setTitle('About Me').setDescription(intro.aboutMe).setColor('#2f3136'),
      )
    }

    const profileLogChannelId = client.keyv.get('CHANNEL_PROFILES_LOGS')
    const profileLogChannel = await client.channels.fetch(profileLogChannelId)

    const profileLog = await profileLogChannel.send({
      content: `<@${dataObj.userId}>`,
      files: [img],
    })
    dataObj.profileImgUrl = profileLog.attachments.first().url

    const profile = await dataObj.channel.send({
      content: `<@${dataObj.userId}>`,
      embeds,
      files: [dataObj.profileImgUrl],
    })
    dataObj.profileMsgUrl = profile.url

    await addToDatabase(dataObj)

    const descriptionStr = dataObj.ifProfile
      ? bot.keyv.personal_msg_profile_edited
      : bot.keyv.personal_msg_profile_created
    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('View Profile').setStyle(ButtonStyle.Link).setURL(profile.url),
    )

    const dmChannel = await client.users.createDM(dataObj.userId)
    if (dmChannel) {
      // ! error
      await dmChannel.send({
        embeds: [
          new EmbedBuilder().setTitle('Profile').setDescription(descriptionStr).setColor('#2f3136'),
        ],
        components: [actionRow],
      })
    }
  }
  catch (e) {
    logger.error(e)
  }
})

import { Profile } from './database.js'

async function addToDatabase(dataObj) {
  await Profile.upsert({
    id: dataObj.userId,
    name: dataObj.userName,
    age: dataObj.age,
    quote: dataObj.userQuote,
    location: dataObj.intro.locationWhole,
    aboutMe: dataObj.intro.aboutMe,
    lookingFor: dataObj.intro.lookingFor,
    interests: dataObj.intro.interests,
    imgUrl: dataObj.profileImgUrl,
    msgUrl: dataObj.profileMsgUrl,
  })
  return
}

export async function getFromDatabase(id) {
  const profile = await Profile.findByPk(id)

  return profile
}
