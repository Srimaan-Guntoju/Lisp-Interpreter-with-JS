// Get process.stdin as the standard input object.

'use strict'

var standard_input = process.stdin
standard_input.setEncoding('utf-8')
console.log('Please input text in command line.')
standard_input.on('data', function (data) {
  // User input exit.
  if (data === 'exit\n') {
    // Program exit.
    console.log('User input complete, program exit.')
    process.exit()
  } else {
    console.log(lambdaParser(data))
  }
})
var operations = {
  '+': (ar) => ar.reduce((a, b) => a + b),
  '-': (ar) => ar.reduce((a, b) => a - b),
  '*': (ar) => ar.reduce((a, b) => a * b),
  '/': (ar) => ar.reduce((a, b) => a / b),
  '>': (ar) => ar.reduce((a, b) => a > b),
  '<': (ar) => ar.reduce((a, b) => a < b),
  '>=': (ar) => ar.reduce((a, b) => a >= b),
  '<=': (ar) => ar.reduce((a, b) => a <= b),
  '=': (ar) => ar.reduce((a, b) => a == b),
  max: (ar) => Math.max(...ar),
  min: (ar) => Math.min(...ar),
  abs: (ar) => Math.abs(...ar),
  begin: (ar) => ar[ar.length - 1],
  car: (ar) => ar[0],
  cdr: (ar) => ar.slice(1),
  pi: Math.PI
}

function expressionParser (input) {
  if (input[0] !== '(') return null
  let output = []; let tempdata = input.slice(1).replace(/^\s+/, '')
  if (!(valueParser(tempdata)[0] in operations)) return null
  while (tempdata[0] !== ')') {
    const result = valueParser(tempdata)
    console.log(result, 'exp')
    if (output.length !== 0 && output[0] !== 'define' && result[0] in operations) result[0] = operations[result[0]]
    output.push(result[0])
    tempdata = result[1].replace(/^\s+/, '')
  }
  console.log(output, '||', tempdata)
  output = valueParser(output)
  return [output, tempdata.slice(1)]
}
function symbolParser (input) {
  if (input[0] === '(' || Array.isArray(input)) return null
  let output = ''; let i
  for (i in input) {
    if (input[i] !== ' ' && input[i] !== ')') output += input[i]
    if (input[i] === ' ' || input[i] === ')' || input[i] === '\n') break
  }
  if (!isNaN(output)) output = Number(output)
  return [output, input.slice(i)]
}
function operatorParser (expArray) {
  if (!Array.isArray(expArray)) return null
  if (expArray[0] in operations) return operations[expArray[0]](expArray.slice(1))
  return null
}

function ifParser (input) {
  if (input[0] !== '(') return null
  const exp = symbolParser(input.slice(1).replace(/^\s+/, ''))
  // console.log(exp)
  if (exp[0] !== 'if') return null
  const condition = valueParser(exp[1].replace(/^\s+/, ''))
  console.log(condition)
  console.log(condition)
  if (condition[0] === true) return valueParser(condition[1].replace(/^\s+/, ''))
  if (condition[0] === false) {
    const trueExp = expStringParser(condition[1].replace(/^\s+/, ''))
    return valueParser(trueExp[1].replace(/^\s+/, ''))
  }
}

function expStringParser (input) {
  if (symbolParser(input) !== null) return symbolParser(input)
  if (input[0] !== '(') return null
  const stack = ['(']; let output = '('; let i = 1
  while (stack.length !== 0) {
    if (input[i] == ')') stack.pop()
    if (input[i] == '(') stack.push('(')
    output += (input[i]); i++
  }
  return [output, input.slice(i)]
}

function quoteParser (input) {
  if (input[0] !== '(') return null
  const exp = symbolParser(input.slice(1).replace(/^\s+/, ''))
  if (exp[0] !== 'quote') return null
  return expStringParser(exp[1].replace(/^\s+/, ''))
}

function defineParser (expArray) {
  const output = []; let tempdata = expArray.slice(1).replace(/^\s+/, '')
  if (expArray[0] !== '(' || valueParser(tempdata)[0] !== 'define') return null
  while (tempdata[0] != ')') {
    const result = valueParser(tempdata)
    if (result === null) return null
    output.push(result[0])
    tempdata = result[1].replace(/^\s+/, '')
  }
  if (!isNaN(output[1]) || output.length !== 3) return null
  operations[output[1]] = output[2]
  // console.log(operations)
  return [null, tempdata.slice(1)]
}
function valueParser (input) {
  const funcArr = [symbolParser, expressionParser, operatorParser, ifParser, defineParser]
  for (const i of funcArr) {
    const result = i(input)
    console.log(i, result)
    if (result !== null) return result
  }
  return null
}
function lambdaParser (input) {
  if (input[0] !== '(') return null
  const exp = symbolParser(input.slice(1).replace(/^\s+/, ''))
  console.log(exp)
  if (exp[0] !== 'lambda') return null
  let tempdata = exp[1].replace(/^\s+/, '').slice(1); const args = []
  while (tempdata[0] !== ')') {
    const arg = symbolParser(tempdata.replace(/^\s+/, ''))
    args.push(arg[0])
    tempdata = arg[1].replace(/^\s+/, '')
    console.log(arg, tempdata, 1)
  }
  console.log(args, tempdata)
  const body = expStringParser(tempdata.slice(1).replace(/^\s+/, ''))
  console.log(args, body, 'body')
  return function (arr) {
    if (arr.length !== args.length) return null
    const localScope = Object.create(scope)
    for (const i in args) localScope[args[i]] = arr[i]
    return valueParser(body, localScope)
  }
}

function blah (BLAH) {
  // do nothing
  /* add scope to all the functions. functions need a scope to retrieve the variable values
  while evaluating the expressions. */

}
