import { time } from 'discord.js'
import dateFormat from 'dateformat'
import { assetsLoader } from '../assets.js'

export async function onLogin(client) {
  const timeStamp = Date.now()

  bot.set('bootTime', dateFormat(timeStamp, 'hh:MM TT, dd mmmm yyyy'))
  bot.set('bootTimeString', time(timeStamp, 'R'))

  await assetsLoader()
  const guild = await client.guilds.fetch(keyv.get('guild_main'))
  await guild.members.fetch()
  logger.info('Guild Members fetched')
}
