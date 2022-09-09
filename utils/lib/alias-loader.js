import generateAliasesResolver from 'esm-module-alias'

const aliases = {
  '@root': '.',
  '@utils': 'utils',
  '@lib': 'utils/lib',
  '@core': 'utils/core',

  '@events': 'events',
  '@commands': 'commands',
  '@pino': 'utils/lib/pino.js',
}

export const resolve = generateAliasesResolver(aliases)
