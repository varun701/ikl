import Sequelize from 'sequelize'
import sequelize from '@lib/sequelize.js'
import { keyv, keyvEnv } from '@lib/keyv.js'
import { Collection } from 'discord.js'
import logger from '../lib/pino.js'

import membersModel from '@root/database/models/members.js'
export const membersDB = await membersModel(sequelize, Sequelize.DataTypes)

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

export const botInitial = async (client) => {
  bot.keyv = {
    async set(key, value) {
      const valueCorrected = value.replaceAll('\\n', '\n')
      const keyvSet = keyvEnv.set(key, value)
      await keyvSet.writeFile()
      this[key] = valueCorrected
    },
    async delete(key) {
      delete bot.keyv[key]
      const keyvDelete = keyvEnv.delete(key)
      await keyvDelete.writeFile()
    },
    async initial() {
      const keys = keyvEnv._tokens.filter((tok) => tok.type === 1).map((tok) => tok.value)
      for (const key of keys) {
        this[key] = keyvEnv.get(key).replaceAll('\\n', '\n')
      }
    },
  }
  await bot.keyv.initial()
  logger.info('Bot.keyv loaded')
  await keyvcInitial(client)
  return
}

export default {
  membersDB,
}
