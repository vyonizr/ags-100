const chalk = require('chalk')
const getRandomInt = require('./getRandomInt')
const CONFIG = require('./config')

const {
  OPERAND_LIST,
  MIN_MODULE,
  MAX_MODULE,
  MIN_NUMBER,
  MAX_NUMBER,
  MAX_SERIES_LENGTH,
  MIN_OP_VALUE,
  MAX_OP_VALUE
} = CONFIG

const generateOps = (processLength = 3) => {
  const operations = []
  for (let i = 0; i < processLength; i++) {
    let item = ''
    item += OPERAND_LIST[Math.floor(Math.random() * OPERAND_LIST.length)]
    item += ' '
    const number = String(getRandomInt(MIN_OP_VALUE, MAX_OP_VALUE))
    item += number

    operations.push(item)
  }

  return operations
}

const doMath = (operation, prevValue = 0) => {
  const X = operation.split(' ')
  if (X.length !== 2) {
    throw Error(`Invalid syntax '${operation}'`)
  }

  let [command, value] = X
  if (isNaN(value)) {
    throw Error(`Invalid value '${value}'`)
  }
  command = command.toLowerCase()
  if (command === 'add') {
    prevValue += Number(value)
  } else if (command === 'sub') {
    prevValue -= Number(value)
  } else {
    throw Error(`Invalid syntax '${command}'`)
  }

  return prevValue
}

const generateSeries = (ops, initialNumber) => {
  const series = []
  for (let i = 0; i < MAX_SERIES_LENGTH; i++) {
    if (series.length === 0) {
      series.push(initialNumber)
    } else {
      const prevValue = series[i - 1]
      const currValue = doMath(ops[(i + 1) % ops.length], prevValue)
      series.push(currValue)
    }
  }

  return series
}

const convertInputToOps = (text) => {
  return text.split(';')
}


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const startQuiz = () => {
  const initialNumber = getRandomInt(MIN_NUMBER, MAX_NUMBER)
  const numberOfModules = getRandomInt(MIN_MODULE, MAX_MODULE)
  const series = generateSeries(generateOps(numberOfModules), initialNumber)

  readline.question(chalk.yellow(`${series}\n`), answer => {
    const ops = convertInputToOps(answer)
    const generateAnswerSeries = generateSeries(ops, initialNumber)
    const parsedAnswer = generateAnswerSeries.join(',')

    let isRightAnswer = parsedAnswer === series.join(',')

    console.log('Your answer: ', parsedAnswer);
    console.log(isRightAnswer ? chalk.green('Correct!') : chalk.red('Try again :('))

    readline.close();
  });
}

startQuiz()
// for (let i = 0; i < 5; i++) {
//   const initialNumber = getRandomInt(MIN_NUMBER, MAX_NUMBER)
//   const numberOfModules = getRandomInt(MIN_MODULE, MAX_MODULE)
//   const series = generateSeries(generateOps(numberOfModules), initialNumber)
//   console.log('• ', series.join(','))
// }