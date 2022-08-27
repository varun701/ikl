import Sequelize from 'sequelize'
import sequelize from '@lib/sequelize.js'
import keyv from '@lib/keyv.js'
import { Collection } from 'discord.js'

export const membersDB = (await import('@lib/models/members.js')).default(
  sequelize,
  Sequelize.DataTypes,
)

export const KeyVC = new Collection()

Reflect.defineProperty(KeyVC, 'add', {
  value: async (key, value) => {
    await keyv.set(key, value)
    KeyVC.set(key, value)
  },
})

Reflect.defineProperty(KeyVC, 'fetch', {
  value: async (key, value) => {
    const fetchedKeyVC = KeyVC.get(key, value)
    if (fetchedKeyVC) return fetchedKeyVC
    console.log('fetch used')
    const fetchedKeyv = await keyv.get(key, value)
    return fetchedKeyv
  },
})

Reflect.defineProperty(KeyVC, 'remove', {
  value: async (key, value) => {
    await keyv.delete(key, value)
    KeyVC.delete(key, value)
  },
})

export const keyvcInitial = async (client) => {
  client.KeyVC = new Collection()
  for await (const [key, value] of keyv.iterator()) {
    client.KeyVC.set(key, value)
  }
}

export default {
  membersDB,
}
