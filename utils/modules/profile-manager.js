import { AttachmentBuilder, EmbedBuilder } from 'discord.js'
import EventEmitter from 'events'

export const profileManager = new EventEmitter()

profileManager.on('created', (imgBuff, dataObj) => {
  const img = new AttachmentBuilder(imgBuff)
  const embed = new EmbedBuilder()
    .setTitle(dataObj.userTag)

  if (dataObj.intro.lookingFor !== '') embed.addFields({ name: 'Looking For', value: dataObj.intro.lookingFor })
  if (dataObj.intro.interests !== '') embed.addFields({ name: 'Interests', value: dataObj.intro.interests })
  if (dataObj.intro.aboutMe !== '') embed.addFields({ name: 'About Me', value: dataObj.intro.aboutMe })
  dataObj.channel.send({
    embeds: [embed],
    files: [img],
  })
})
