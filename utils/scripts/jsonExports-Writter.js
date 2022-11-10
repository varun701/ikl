import fs from 'fs'

export const writeJson = (file, json) => {
  const stream = fs.createWriteStream(file)
  stream.once('open', () => {
    stream.write(JSON.stringify(json))
    stream.end()
  })
}
