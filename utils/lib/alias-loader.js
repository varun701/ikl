import generateAliasesResolver from 'esm-module-alias'

const aliases = {
  '@root': '.',
  '@pino': 'utils/lib/pino.js',
}

export const resolve = generateAliasesResolver(aliases)
