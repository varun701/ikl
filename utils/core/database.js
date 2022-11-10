import { sequelize } from '../lib/sequelize.js'
import { keyvLib } from '../lib/keyv.js'
import { Collection } from 'discord.js'

import { introModel } from '../../database/models/intro.js'
export const Intro = await introModel(sequelize)

export const DBs = {
  Intro,
}

/**
 * Creates keyv collection, a global variable from keyv.sqlite
 * @param {Client} client
 */

export default async function keyvLoader() {
  const keyvc = new Collection()
  keyvLib.on('err', (err) => logger.error(err))

  Reflect.defineProperty(keyvc, 'add', {
    value: async (key, value) => {
      await keyvLib.set(key, value)
      keyvc.set(key, value)
    },
  })

  Reflect.defineProperty(keyvc, 'remove', {
    value: async (key) => {
      await keyvLib.delete(key)
      keyvc.delete(key)
    },
  })

  for await (const [key, value] of keyvLib.iterator()) {
    keyvc.set(key, value)
  }
  global.keyv = keyvc
}
