import Keyv from 'keyv'
import KeyvFile from 'key-value-file'

export const keyv = new Keyv('sqlite://database/keyv.sqlite')
export const keyvEnv = await KeyvFile.parseFile('database/keyv.env')

keyv.on('err', (err) => console.log(err))
