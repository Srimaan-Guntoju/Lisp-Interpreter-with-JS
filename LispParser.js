// Get process.stdin as the standard input object.
var standard_input = process.stdin;

// Set input character encoding.
standard_input.setEncoding('utf-8');

// Prompt user to input data in console.
console.log("Please input text in command line.");

// When user input data and click enter key.
standard_input.on('data', function (data) {

    // User input exit.
    if(data === 'exit\n'){
        // Program exit.
        console.log("User input complete, program exit.");
        process.exit();
    }else
    {
        // Print user input in console.
        console.log('LispyJS : ' + typeof(data));
        console.log(parser(data))
    }
});
var operations = {
    "+" :  (a, b) => (a + b),
    "-" :  (a, b) => (a - b),
    "*" :  (a, b) => (a * b),
    "/" :  (a, b) => (a/b)
};

function accumulate(list, operator) {
    return list.reduce(operations[operator]);
}

function parser(input){
	if (!isNaN(input)) return Number(input);
	let output=[], tempdata='';
	if(input[0]==='('){
		tempdata= input.slice(1);
		while(tempdata[0]!==')'){
			result= valueparser(tempdata);
			if(!isNaN(result[0])) result[0]= Number(result[0]);
			output.push(result[0]);
			tempdata= result[1].replace(/^\s+/, "")
		}
		output= accumulate(output.slice(1), output[0])

	}
	return [output, tempdata.slice(1)]
}

function symbolParser(input){
	if(input[0]==='(') return null;
	let output='', i;
	for(i in input){
		//console.log(input[i])
		if(input[i]!==' ' && input[i]!==')') output+=input[i];
		if(input[i]===' '|| input[i]===')') break;
	}
	//console.log([output])
	return [output, input.slice(i)];
}

function valueparser(input){
  let funcArr=[symbolParser, parser];
  for(let i of funcArr){
    let result= i(input);
    if (result!== null) return result;
  }
  return null;
}