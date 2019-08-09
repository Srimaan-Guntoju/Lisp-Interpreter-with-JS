// Get process.stdin as the standard input object.
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
    console.log(parser(data))
  }
})
var operations = {
  '+': (a, b) => (a + b),
  '-': (a, b) => (a - b),
  '*': (a, b) => (a * b),
  '/': (a, b) => (a / b),
  '>': (a, b) => (a > b),
  '<': (a, b) => (a < b),
  '>=': (a, b) => (a >= b),
  '<=': (a, b) => (a <= b),
  '=': (a, b) => (a == b),
  begin: (arr) => arr[arr.length - 1]
}
var variables = {}

function accumulate (list, operator) {
  return list.reduce(operations[operator])
}

function parser (input) {
  if (!isNaN(input)) return Number(input)
  let output = []; let tempdata = ''
  if (input[0] === '(') {
    tempdata = input.slice(1)
    while (tempdata[0] !== ')') {
      result = valueparser(tempdata)
      if (!isNaN(result[0])) result[0] = Number(result[0])
      if (result[0] in variables) result[0] = variables[result[0]]
      output.push(result[0])
      tempdata = result[1].replace(/^\s+/, '')
    }
    console.log(output, tempdata, 1)
    if (output[0] === 'if') {
      if (output[1] === 1) output = output[2]
      if (output[1] === 0) output = output[3]
    } else if (output[0] === 'define') {
      variables[output[1]] = output[2]
    } else {
      console.log(output.slice(1)[output.slice(1).length - 1], output[0])
      output = accumulate(output.slice(1), output[0])
    }
  }
  return [output, tempdata.slice(1)]
}

function symbolParser (input) {
  if (input[0] === '(') return null
  let output = ''; let i
  for (i in input) {
    /// console.log(input[i])
    if (input[i] !== ' ' && input[i] !== ')') output += input[i]
    if (input[i] === ' ' || input[i] === ')') break
  }
  // console.log([output])
  return [output, input.slice(i)]
}

function valueparser (input) {
  const funcArr = [symbolParser, parser]
  for (const i of funcArr) {
    const result = i(input)
    if (result !== null) return result
  }
  return null
}
