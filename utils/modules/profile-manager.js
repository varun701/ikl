import { AttachmentBuilder, EmbedBuilder } from 'discord.js'
import EventEmitter from 'events'

export const profileManager = new EventEmitter()

profileManager.on('created', async (imgBuff, dataObj) => {
  const img = new AttachmentBuilder(imgBuff)
  const embed = new EmbedBuilder().setTitle(dataObj.userTag)

  if (dataObj.intro.lookingFor !== '') {
    embed.addFields({ name: 'Looking For', value: dataObj.intro.lookingFor })
  }
  if (dataObj.intro.interests !== '') {
    embed.addFields({ name: 'Interests', value: dataObj.intro.interests })
  }
  if (dataObj.intro.aboutMe !== '') {
    embed.addFields({ name: 'About Me', value: dataObj.intro.aboutMe })
  }
  const profile = await dataObj.channel.send({
    embeds: [embed],
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
