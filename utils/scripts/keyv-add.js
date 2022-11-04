import { keyvLib } from '../lib/keyv.js'

// await keyvLib.set(key, value)
// await keyvLib.set(key)

for await (const [key, value] of keyvLib.iterator()) {
  console.log(key, value)
}
