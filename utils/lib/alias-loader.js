import generateAliasesResolver from 'esm-module-alias'

const aliases = {
  '@root': '.',
  '@utils': 'utils',
  '@lib': 'utils/lib',
  '@core': 'utils/core',

  '@events': 'events',
  '@commands': 'commands',
  '@chalk': 'utils/lib/chalk.js',
}

export const resolve = generateAliasesResolver(aliases)
