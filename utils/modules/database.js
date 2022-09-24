import Sequelize from 'sequelize'
import sequelize from '../lib/sequelize.js'
import { keyv, keyvEnv } from '../lib/keyv.js'
import { Collection } from 'discord.js'
import logger from '../lib/pino.js'

import membersModel from '../../database/models/members.js'
export const membersDB = await membersModel(sequelize, Sequelize.DataTypes)

import { profilesModel } from '../../database/models/profiles.js'
export const profilesDB = await profilesModel(sequelize, Sequelize.DataTypes)

// * Keyv
import { keyValueConvertor } from '../lib/keyv.js'

/**
 * Creates client.keyv collection from database/keyv.sqlite
 * * Called in botInitial
 * @param {Client} client
 */

const keyvcInitial = async (client) => {
  client.keyv = new Collection()

  Reflect.defineProperty(client.keyv, 'add', {
    value: async (key, value) => {
      await keyv.set(key, value)
      client.keyv.set(key, value)
    },
  })

  Reflect.defineProperty(client.keyv, 'remove', {
    value: async (key) => {
      await keyv.delete(key)
      client.keyv.delete(key)
    },
  })

  for await (const [key, value] of keyv.iterator()) {
    client.keyv.set(key, value)
  }
  logger.info('Client.keyv loaded')
}

/**
 * Creates bot.keyv global object from keyv.env
 * * Calls keyvcInitial to create client.keyv
 * @param {Client} client
 * @returns void
 */

export const botInitial = async (client) => {
  bot.keyv = {}

  const keys = keyvEnv._tokens.filter((tok) => tok.type === 1).map((tok) => tok.value)

  for (const key of keys) {
    const rawValue = keyvEnv.get(key)

    const converted = keyValueConvertor(key, rawValue)
    bot.keyv[converted[0]] = converted[1]
  }
  logger.info('Bot.keyv loaded')
  await keyvcInitial(client)
  return
}

export default {
  membersDB,
  profilesDB,
}
