// Get process.stdin as the standard input object.

'use strict'

var standard_input = process.stdin

// Set input character encoding.
standard_input.setEncoding('utf-8')

// Prompt user to input data in console.
console.log('Please input text in command line.')

// When user input data and click enter key.
standard_input.on('data', function (data) {
  // User input exit.
  if (data === 'exit\n') {
    // Program exit.
    console.log('User input complete, program exit.')
    process.exit()
  } else {
    // Print user input in console.
    console.log('LispyJS : ' + typeof (data))
    console.log(valueParser(data))
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
  cdr: (ar) => ar.slice(1)
}
var variables = {
  pi: Math.PI
}

function accumulate (list, operator) {
  // return list.reduce(operations[operator])
  // console.log(list, operations[operator])
  return operations[operator](list)
}

function expressionParser (input) {
  if (!isNaN(input)) return Number(input)
  if (input[0] !== '(') return null
  let output = []; let tempdata = ''
  if (input[0] === '(') {
    tempdata = input.slice(1).replace(/^\s+/, '')
    while (tempdata[0] !== ')') {
      const result = valueParser(tempdata)
      if (!isNaN(result[0])) result[0] = Number(result[0])
      if (output.length !== 0 && output[0] !== 'define' && result[0] in operations) result[0] = operations[result[0]]
      output.push(result[0])
      tempdata = result[1].replace(/^\s+/, '')
    }
    console.log(output, '||', tempdata)
  }
  console.log(output, 'output')
  output = valueParser(output)
  return [output, tempdata.slice(1)]
}
function symbolParser (input) {
  if (input[0] === '(' || Array.isArray(input)) return null
  let output = ''; let i
  for (i in input) {
    // console.log([input[i]], 'sp')
    if (input[i] !== ' ' && input[i] !== ')') output += input[i]
    if (input[i] === ' ' || input[i] === ')' || input[i] === '\n') break
  }
  // console.log(input, [output], 'sp')
  return [output, input.slice(i)]
}
function operatorParser (expArray) {
  if (!Array.isArray(expArray)) return null
  if (expArray[0] in operations) return accumulate(expArray.slice(1), expArray[0])
  return null
}
function ifParser (expArray) {
  if (!Array.isArray(expArray)) return null
  if (expArray[0] === 'if') {
    if (expArray[1] === 1) return expArray[2]
    if (expArray[1] === 0) return expArray[3]
  }
  return null
}
function defineParser (expArray) {
  // console.log(expArray, 'abc')
  if (!Array.isArray(expArray) || expArray.length !== 3) return null
  if (expArray[0] === 'define' && isNaN(expArray[1])) {
    operations[expArray[1]] = expArray[2]
  } else return null
}
function valueParser (input) {
  const funcArr = [symbolParser, expressionParser, operatorParser, ifParser, defineParser]
  for (const i of funcArr) {
    const result = i(input)
    if (result !== null) return result
  }
  return null
}
