import fs from 'fs'

let assets_json, intro_json, introModal_json

const replacer = (expression, valueObj) => {
  const templateMatcher1 = /{{\s?([^{}\s]*)\s?}}/g
  const templateMatcher2 = /\${\s?([^{}\s]*)\s?}/g
  const templateMatcher3 = /"{{{\s?([^{}\s]*)\s?}}}"/g
  let text = expression.replace(templateMatcher3, (_substring, value, _index) => valueObj[value]) // error if no value provided
  text = text.replace(templateMatcher1, (_substring, value, _index) => valueObj[value] ?? 'none')
  text = text.replace(templateMatcher2, (_substring, value, _index) => keyv.get(value) ?? 'none')
  return text
}

// Custom JSON parsers
export const jsonParser = (json, valueObj = {}) => JSON.parse(replacer(JSON.stringify(json), valueObj))
export const jsonStringParser = (jsonString, valueObj = {}) => JSON.parse(replacer(jsonString, valueObj))
export const jsonDataParser = (jsonData, valueObj = {}) =>
  JSON.parse(replacer(JSON.stringify(JSON.parse(jsonData)), valueObj))
export const stringParser = (json, valueObj = {}) => replacer(JSON.stringify(json), valueObj)

/**
 * @param {string} str
 * @param {{} | boolean} obj
 * @returns
 */
export const introAssets = (str, obj = false) => {
  if (typeof obj === 'boolean') {
    if (obj) return jsonParser(intro_json[str])
    return intro_json[str]
  }
  return jsonParser(intro_json[str], obj)
}
export const getAssets = (str, obj = false) => {
  if (typeof obj === 'boolean') {
    if (obj) return jsonParser(assets_json[str])
    return assets_json[str]
  }
  return jsonParser(assets_json[str], obj)
}

export const assets = {
  embed: (title, desc) => jsonParser(assets_json.embed, { title, desc }),
  introModal_json: () => introModal_json,
}

export const assetsLoader = async () => {
  introModal_json = JSON.parse(fs.readFileSync('assets/json/introModal.json'))
  assets_json = JSON.parse(fs.readFileSync('assets/json/assets.json'))
  intro_json = JSON.parse(fs.readFileSync('assets/json/intro.json'))
}
