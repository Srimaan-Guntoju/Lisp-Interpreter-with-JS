let input='begin (define r 10) (* pi (* r r)))'
let input1= '(if (> (* 11 11) 120) (* 7 6) oops)'
//console.log(symbolParser(input));
console.log(parser(input1))

function parser(input){
	let result= valueparser(input);
	if (result[1].length!==0) return null;
	return result[0];
}

function expressionParser(input){
	if(input[0]!=='(') return null;
	let output=[], tempdata='';
	if(input[0]==='('){
		tempdata= input.slice(1);
		while(tempdata[0]!==')'){
			result= valueparser(tempdata);
			if(!isNaN(result[0])) result[0]= Number(result[0]);
			output.push(result[0]);
			tempdata= result[1].replace(/^\s+/, "")

		}

	}
	return [output, tempdata.slice(1)]
}

function symbolParser(input){
	if(input[0]==='(') return null;
	let output='', i;
	for(i in input){
		console.log(input[i])
		if(input[i]!==' ' && input[i]!==')') output+=input[i];
		if(input[i]===' '|| input[i]===')') break;
	}
	console.log([output])
	return [output, input.slice(i)];
}

function valueparser(input){
  let funcArr=[symbolParser, expressionParser];
  for(let i of funcArr){
    let result= i(input);
    if (result!== null) return result;
  }
  return null;
}