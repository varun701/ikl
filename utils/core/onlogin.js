import { time } from 'discord.js'
import dateFormat from 'dateformat'
import { assetsLoader } from '../assets.js'

export async function onLogin(_client) {
  const timeStamp = Date.now()

  bot.set('bootTime', dateFormat(timeStamp, 'hh:MM TT, dd mmmm yyyy'))
  bot.set('bootTimeString', time(timeStamp, 'R'))

  await assetsLoader()
}
