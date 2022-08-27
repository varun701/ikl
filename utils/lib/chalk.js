import Chalk from 'chalk'

export default function printf(string, type = 'g', bg = 0) {
  let exportString =
    type === 'r'
      ? Chalk.redBright(string)
      : type === 'g'
        ? Chalk.greenBright(string)
        : type === 'b'
          ? Chalk.blueBright(string)
          : type === 'y'
            ? Chalk.yellowBright(string)
            : type === 'm'
              ? Chalk.magentaBright(string)
              : type === 'c'
                ? Chalk.cyanBright(string)
                : type === 'k'
                  ? Chalk.black(string)
                  : type === 'kb'
                    ? Chalk.blackBright(string)
                    : type === 'w'
                      ? Chalk.white(string)
                      : type === 'wb'
                        ? Chalk.whiteBright(string)
                        : string

  exportString =
    bg === 1
      ? Chalk.bgWhiteBright(exportString)
      : bg === 2
        ? Chalk.bgBlackBright(exportString)
        : exportString
  return console.log(exportString)
}

export function warn(string) {
  return printf(string, 'y')
}

export function info(string) {
  return printf(string, 'b')
}

export function error(string) {
  return printf(string, 'r')
}
