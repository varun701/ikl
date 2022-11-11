import fs from 'fs'

const jsons = {}

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

const assetsFetcher = (json, str, obj) => {
  if (typeof obj === 'boolean') {
    if (obj) return jsonParser(json[str])
    return json[str]
  }
  return jsonParser(json[str], obj)
}

export const getAssets = (str, obj = false) => assetsFetcher(jsons.assets_json, str, obj)
export const introAssets = (str, obj = false) => assetsFetcher(jsons.intro_json, str, obj)
export const verifyAssets = (str, obj = false) => assetsFetcher(jsons.verify_json, str, obj)

export const assets = {
  embed: (title, desc) => jsonParser(jsons.assets_json.embed, { title, desc }),
  introModal_json: () => jsons.introModal_json,
}

export const assetsLoader = async () => {
  jsons.introModal_json = JSON.parse(fs.readFileSync('assets/json/introModal.json'))
  jsons.assets_json = JSON.parse(fs.readFileSync('assets/json/assets.json'))
  jsons.intro_json = JSON.parse(fs.readFileSync('assets/json/intro.json'))
  jsons.verify_json = JSON.parse(fs.readFileSync('assets/json/verify.json'))
}
