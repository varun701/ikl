import Keyv from 'keyv'
import KeyvFile from 'key-value-file'
import { logger } from '../modules.js'

export const keyv = new Keyv('sqlite://database/keyv.sqlite')
export const keyvEnv = await KeyvFile.parseFile('database/keyv.env')

keyv.on('err', (err) => logger.error(err))

/**
 * This function converts key value string pair to string, array, object
 * @param {String} rawKey
 * @param {String} rawValue
 * @returns { [ String, String | any[] | Object<string, any> ] } `[key, value]`
 */

export const keyValueConvertor = (rawKey, rawValue) => {
  let key, value

  const convertStr = (str) => str.replaceAll('//n', '\n')
  const convertStr1 = (str) => str.split(', ')
  const convertStr2 = (str) => str.split(' | ')
  const convertStr3 = (str) => str.split(': ')

  key = rawKey.slice(9)
  value = convertStr(rawValue)
  const type = rawKey.slice(5, 8)

  if (rawKey.startsWith('ARR')) {
    if (type === 'STR') {
      value = convertStr1(value)
    }
    else if (type === 'TXT') {
      value = convertStr2(value)
    }
    else if (type === 'ARR') {
      value = convertStr2(value).map((v) => convertStr1(v))
    }
    else if (type === 'OBJ') {
      value = convertStr2(value).map((v) =>
        Object.fromEntries(convertStr1(v).map((vl) => convertStr3(vl))),
      )
    }
  }
  else if (rawKey.startsWith('OBJ')) {
    if (type === 'STR') {
      value = Object.fromEntries(convertStr2(value).map((v) => convertStr3(v)))
    }
    else if (type === 'ARR') {
      value = Object.fromEntries(
        convertStr2(value).map((v) => {
          const values = convertStr3(v)
          return [values[0], convertStr1(values[1])]
        }),
      )
    }
    else if (type === 'OBJ') {
      value = Object.fromEntries(
        convertStr2(value).map((v) => {
          const values = v.split(':: ')
          return [
            values[0],
            Object.fromEntries(convertStr1(values[1]).map((vl) => convertStr3(vl))),
          ]
        }),
      )
    }
  }
  else if (rawKey.startsWith('STR')) {
    key = rawKey.slice(4)
  }

  return [key, value]
}
