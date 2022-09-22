import generateAliasesResolver from 'esm-module-alias'

const aliases = {
  '@root': '.',
  '@utils': 'utils',
  '@pino': 'utils/lib/pino.js',
}

export const resolve = generateAliasesResolver(aliases)
