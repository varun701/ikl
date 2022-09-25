import { AttachmentBuilder, EmbedBuilder } from 'discord.js'
import EventEmitter from 'events'

export const profileManager = new EventEmitter()

profileManager.on('created', async (imgBuff, dataObj) => {
  const img = new AttachmentBuilder(imgBuff)
  const intro = dataObj.intro
  const embeds = []

  if (intro.lookingFor !== '' || intro.lookingFor === null) {
    embeds.push(new EmbedBuilder()
      .setTitle('Looking for')
      .setDescription(intro.lookingFor)
      .setColor('#2f3136'))
  }

  if (intro.interests !== '' || intro.interests === null) {
    embeds.push(new EmbedBuilder()
      .setTitle('Interests')
      .setDescription(intro.interests)
      .setColor('#2f3136'))
  }

  if (intro.aboutMe !== '' || intro.aboutMe === null) {
    embeds.push(new EmbedBuilder()
      .setTitle('About Me')
      .setDescription(intro.aboutMe)
      .setColor('#2f3136'))
  }
  const profile = await dataObj.channel.send({
    embeds,
    files: [img],
  })
  dataObj.profileImgUrl = profile.attachments.first().url
  dataObj.profileMsgUrl = profile.url
  await addToDatabase(dataObj)
})

import { profilesDB } from './database.js'

async function addToDatabase(dataObj) {
  await profilesDB.upsert({
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
  const profile = await profilesDB.findByPk(id)

  return profile
}
