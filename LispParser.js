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
    console.log([data, 'input'])
    console.log(valueParser(data.slice(0, data.length - 1), globalScope))
  }
})
const globalScope = {
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

function expressionParser (input, scope) {
  console.log(input)
  if (input[0] !== '(') return null
  let output = []; let tempdata = input.slice(1).replace(/^\s+/, '')
  if (findVariable(valueParser(tempdata, scope)[0], scope) == null) return null
  while (tempdata[0] !== ')') {
    console.log(tempdata, 'tempexp')
    const result = valueParser(tempdata, scope)
    console.log(result, 'exp')
    if (output.length !== 0 && output[0] !== 'define' && findVariable(result[0], scope) !== null) result[0] = findVariable(result[0], scope)
    output.push(result[0])
    tempdata = result[1].replace(/^\s+/, '')
  }
  console.log(output, '||', tempdata)
  output = valueParser(output, scope)
  return [output, tempdata.slice(1)]
}

function symbolParser (input, scope) {
  if (input[0] === '(' || Array.isArray(input)) return null
  console.log(findVariable(input.slice(0, input.length - 1), scope), input.slice(0, input.length - 1), 'variable')
  if (findVariable(input, scope) !== null) return [findVariable(input, scope), '']
  let output = ''; let i
  for (i in input) {
    if (input[i] !== ' ' && input[i] !== ')') output += input[i]
    if (input[i] === ' ' || input[i] === ')' || input[i] === '\n') break
  }
  if (!isNaN(output)) output = Number(output)
  // if (findVariable(output, scope) !== null) output = findVariable(output, scope)
  console.log([output, input.slice(i)])
  return [output, input.slice(i)]
}

function operatorParser (expArray, scope) {
  if (!Array.isArray(expArray)) return null
  console.log('test1', expArray)
  // if (expArray[0] in scope) return scope[expArray[0]](expArray.slice(1))
  if (findVariable(expArray[0], scope) !== null) return findVariable(expArray[0], scope)(expArray.slice(1))
  return null
}

function ifParser (input, scope) {
  if (input[0] !== '(') return null
  const exp = symbolParser(input.slice(1).replace(/^\s+/, ''), scope)
  console.log(input, exp)
  if (exp == null || exp[0] !== 'if') return null
  const condition = valueParser(exp[1].replace(/^\s+/, ''), scope)
  console.log(condition)
  if (condition[0] === true) return valueParser(condition[1].replace(/^\s+/, ''), scope)
  if (condition[0] === false) {
    const trueExp = expStringParser(condition[1].replace(/^\s+/, ''))
    console.log(trueExp)
    return valueParser(trueExp[1].replace(/^\s+/, ''), scope)
  }
}

function expStringParser (input, scope) {
  if (symbolParser(input, scope) !== null) return symbolParser(input, scope)
  if (input[0] !== '(') return null
  const stack = ['(']; let output = '('; let i = 1
  while (stack.length !== 0) {
    if (input[i] == ')') stack.pop()
    if (input[i] == '(') stack.push('(')
    output += (input[i]); i++
  }
  return [output, input.slice(i)]
}

function quoteParser (input, scope) {
  if (input[0] !== '(') return null
  const exp = symbolParser(input.slice(1).replace(/^\s+/, ''), scope)
  if (exp[0] !== 'quote') return null
  return expStringParser(exp[1].replace(/^\s+/, ''))
}

function defineParser (input, scope) {
  console.log(input)
  if (input[0] !== '(' || valueParser(input.slice(1).replace(/^\s+/, ''), scope)[0] !== 'define') return null
  const output = []; let tempdata = input.slice(1).replace(/^\s+/, '')
  while (tempdata[0] != ')') {
    const result = valueParser(tempdata, scope)
    if (result === null) return null
    output.push(result[0])
    tempdata = result[1].replace(/^\s+/, '')
  }
  console.log(output, tempdata)
  if (!isNaN(output[1]) || output.length !== 3) return null
  if (findVariable(output[2], scope) !== null) {
    scope[output[1]] = findVariable(output[2], scope)
  } else {
    scope[output[1]] = output[2]
  }
  console.log(scope)
  return [null, tempdata.slice(1)]
}

function valueParser (input, scope) {
  const funcArr = [symbolParser, expressionParser, operatorParser, ifParser, defineParser, lambdaParser]
  for (const i of funcArr) {
    const result = i(input, scope)
    console.log(i, result)
    if (result !== null) return result
  }
  return null
}

function lambdaParser (input, scope) {
  if (input[0] !== '(') return null
  const exp = symbolParser(input.slice(1).replace(/^\s+/, ''), scope)
  console.log(exp)
  if (exp == null || exp[0] !== 'lambda') return null
  let tempdata = exp[1].replace(/^\s+/, '').slice(1); const args = []
  while (tempdata[0] !== ')') {
    const arg = symbolParser(tempdata.replace(/^\s+/, ''), scope)
    args.push(arg[0])
    tempdata = arg[1].replace(/^\s+/, '')
    // console.log(arg, tempdata, 1)
  }
  // console.log(args, tempdata)
  const body = expStringParser(tempdata.slice(1).replace(/^\s+/, ''))
  console.log(args, body, 'body')
  return [function (arr) {
    if (arr.length !== args.length) return null
    const localScope = { parent: scope }
    for (const i in args) localScope[args[i]] = arr[i]
    console.log(body, localScope)
    return valueParser(body[0], localScope)[0]
  }, body[1].slice(1)]
}

function findVariable (variable, scope) {
  if (scope == undefined) return null
  if (variable in scope) return scope[variable]
  return findVariable(variable, scope.parent)
}
