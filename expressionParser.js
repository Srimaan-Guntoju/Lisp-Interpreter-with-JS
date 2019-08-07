let input='begin (define r 10) (* pi (* r r)))'
let input1= '(define r 10e+23)'
//console.log(symbolParser(input));
console.log(parser(input1))

function parser(input){
	if(input[0]!=='(') return "Invalid syntax";
	let output=[];
	if(input[0]==='('){
		let tempdata= input.slice(1);
		while(tempdata[0]!==')'){
			result= symbolParser(tempdata);
			if(!isNaN(result[0])) result[0]= Number(result[0]);
			output.push(result[0]);
			tempdata= result[1].replace(/^\s+/, "")

		}

	}
	return output
}

function symbolParser(input){
	let output='', i;
	for(i in input){
		console.log(input[i])
		if(input[i]!==' ' && input[i]!==')') output+=input[i];
		if(input[i]===' '|| input[i]===')') break;
	}
	console.log([output])
	return [output, input.slice(i)];
}
