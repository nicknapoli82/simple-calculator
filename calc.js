// Main file for all calculator functionality

const COLUMBS = 4;
const ROWS = 5;
const DIVIDE = '\xF7'; // HEX char code for divide
const TIMES = '\xD7';  // HEX char code for times
let AC_CE_toggle = false;

let main_container = document.getElementById("main_container");

// For the sake of experementation
// Create the box by which expressions are shown and answers are derived
// NOTE: Right now the style is broken - Need to fix to make text centered in div... somehow
//       Just want to move on in life right now
function generate_text_field() {
    let text_child = document.createElement('div');
    main_container.appendChild(text_child);
    text_child.outerHTML = '<div id="text_field"></div>';    
    let text_field = document.getElementById("text_field");
    text_field.style.margin = 'auto';
    text_field.style.textAlign = 'right';
    text_field.style.border = 'solid black 1px';
    text_field.style.height = '50px';
    text_field.style.fontSize = 'x-large';
    text_field.innerHTML = '<p>0</p>';
    return text_field;
}

let text_field = generate_text_field();

// Now lets attempt to make a series of buttons which are identified by their respective function

function generate_button(element_attach, id, text_representation) {
    let button = {
//	element: 'undefined',
	id: id,
	text_representation: text_representation,
    };

    let temp_element = document.createElement('div');
    element_attach.appendChild(temp_element);
    temp_element.outerHTML = `<input id="${id}" type="button" onclick="modify_text_field(value)" value="${text_representation}">`;
    temp_element = document.getElementById(`${id}`);
    temp_element.style.width = '49px';
    temp_element.style.height = '30px';

    // Using switch to set button background colors just because
    switch (text_representation) {
    case '(': 
    case ')':
    case '%':
    case 'AC':
    case DIVIDE:
    case TIMES:
    case '-':
    case '+':
	temp_element.style.backgroundColor = "rgb(195,195,195)";
	break;
    // case '7':
    // case'8':
    // case '9':
    // case '4':
    // case '5':
    // case '6':
    // case '1':
    // case '2':
    // case '3':
    // case '0':
    // case '.':
    case '=':
	temp_element.style.backgroundColor = "RoyalBlue";
	temp_element.style.color = "white";
	break;	
    }
    
    return button;
}

function create_buttons_field() {
    let button_ids = [['left_bracket', 'right_bracket', 'modulo', 'clear_textAC'],
		      ['seven', 'eight', 'nine', 'division'],
		      ['four', 'five', 'six', 'multiply'],
		      ['one', 'two', 'three', 'subtract'],
		      ['zero', 'dot', 'equals', 'addition']];
    let button_text = [['(', ')', '%', 'AC'],
		       ['7', '8', '9', DIVIDE],
		       ['4', '5', '6', TIMES],
		       ['1', '2', '3', '-'],
		       ['0', '.', '=', '+']];

    for (let row_section = 0; row_section < ROWS; row_section++) {
	let rows = document.createElement('div');
	main_container.appendChild(rows);
	rows.outerHTML = `<div style="text-align: right"><span id="row${row_section}" ></span></div>`;    	
	let row = document.getElementById(`row${row_section}`);
	
	for (let columb_section = 0; columb_section < COLUMBS; columb_section++) {
	    let current_button = generate_button(row, button_ids[row_section][columb_section], button_text[row_section][columb_section]);
	}
    }
}

function modify_text_field(value) {
    let ac_ce = document.getElementById('clear_textAC');

    // For valid input checking '-' is going to be a special case
    let valid_input = [ '(', ')', TIMES, DIVIDE, '%', '+', '-' ];

    if (text_field.innerText === '0') {
	if (value === '=') return;
	if (value === 'AC' || value === 'CE') return;
	text_field.innerText = '';
	text_field.innerText += value;
    }
    else if (value === 'AC' || value === 'CE') {
	if (AC_CE_toggle) {
	    if (text_field.innerText != '0') {
		text_field.innerText = text_field.innerText.slice(0, text_field.innerText.length - 1);
	    }
	}
    }
    else if (value === '=') {
	text_field.innerText = generate_result();
    }
    else {
	// Basically if last input was an operateror and this input is also an operator... Don't do it.
	if (value != '-' &&  value != '(' && valid_input.indexOf(value) >= 0 && valid_input.indexOf(text_field.innerText[text_field.innerText.length -1]) >= 0) {
	    return;
	}
	else if (value === '-' && text_field.innerText[text_field.innerText.length - 1] === '-') {
	    return;
	}
	else text_field.innerText += value;
    }

    // Do the toggle thing for AC button, because Google did it :)
    if (text_field.innerText.length === 0) {
	text_field.innerText = '0';
	ac_ce.setAttribute('value', 'AC');
	AC_CE_toggle = false;
    }
    else {
	ac_ce.setAttribute('value', 'CE');
	AC_CE_toggle = true;
    }
}

create_buttons_field();


// Now for what I think is the scary part. Figuring out how to generate a result
// based on some type of input
function generate_result(parsed, eq_extracted) {
    let equation;
    if (!parsed) {
	equation = expression_check_format(tokenize(text_field.innerText));
    }
    else equation = eq_extracted;

    console.log(equation);
    
    // Blast through the equation and look for brackets
    // Must destroy all brackets
    // This is recursive
    for (let e = 0; e < equation.length; e++) {
    	if (equation[e] === '(') {
    	    let l_paren = e;
    	    let r_paren = e;
	    let left = 1;
    	    // Make sure we are extracting a slice from the outermost brackets
    	    while (left) {
		r_paren++;
		if (equation[r_paren] === '(') {
		    left++;
		}
		else if (equation[r_paren] === ')') {
		    left--;
		}
    	    }
	    let reduction = generate_result(true, equation.slice(l_paren + 1, r_paren));
	    equation.splice(l_paren, r_paren + 1 - l_paren, reduction);
	    e -= r_paren + 1 - l_paren;
    	}
    }
    
    // Presuming we got here, there should not be any paren left
    let TOKEN_index_check = 2;
    while (equation.length > 1) {
	for(let iter = 0; iter < equation.length; iter++) {
	    if (equation[iter] === TOKENS[TOKEN_index_check]) {
		let result = perform_operation(TOKENS[TOKEN_index_check], equation[iter - 1], equation[iter + 1]);
		equation.splice(iter - 1, 3, result);
		iter -= 3;
	    }
	}

	TOKEN_index_check++;
    }

    // If we get here then the equation is solved??? Maybe, so update the text
    return Number(equation);
}

// tokenize takes raw text and returns an array of numbers and tokens
const TOKENS = ['(', ')', TIMES, DIVIDE, '%', '+', '-'];

function tokenize(equation) {
    let result = [];
    let text_index = 0;
    while (text_index < equation.length) {
	if (Number(equation[text_index])) {
	    result.push(parseFloat(equation.slice(text_index)));
	    text_index += (result[result.length - 1].toString()).length;
	}

	for (t in TOKENS) {
	    if (TOKENS[t] == equation[text_index]) {
		result.push(TOKENS[t]);
		text_index++;
		break;
	    }
	}
    }

    return result;
}

// Ensures balanced parens and will insert '*' based on implicit multiply
function expression_check_format(equation) {
    // Balance parens
    for (let e = 0; e < equation.length; e++) {
	if (equation[e] === '(') {
	    let l_paren = 1;
	    let temp_itterator = e + 1;

	    while (l_paren && temp_itterator < equation.length) {
		if (equation[temp_itterator] === '(') {
		    l_paren++;
		}
		else if (equation[temp_itterator] === ')') {
		    l_paren--;
		}
		temp_itterator++;
	    }
	    // If there are more left paren than right, balance the expression
	    while (l_paren) {
		equation.push(')');
		l_paren--;
	    }
	}
    }

    console.log("After Paren Balance", equation);
    
    // Format implicit multiply 
    let temp_itterator = 0;
    while (temp_itterator < equation.length) {
	if (equation[temp_itterator] === '(') {
	    if (Number(equation[temp_itterator - 1])) {
		equation.splice(temp_itterator, 0, TIMES);
	    }
	}
	else if(equation[temp_itterator] === ')') {
	    if (Number(equation[temp_itterator + 1]) || equation[temp_itterator + 1] === '(') {
		equation.splice(temp_itterator + 1, 0, TIMES);
	    }
	}
	temp_itterator++;
    }

    // Format negation as needed
    temp_itterator = 0;
    while (temp_itterator < equation.length) {
	if(equation[temp_itterator] === '-') {
	    if (equation[temp_itterator + 1] === '(' && !Number(equation[temp_itterator - 1])) {
		equation.splice(temp_itterator, 1, -1, TIMES);		
	    }
	    else if (!Number(equation[temp_itterator - 1]) && equation[temp_itterator - 1] != ')' && Number(equation[temp_itterator + 1])) {
		equation.splice(temp_itterator, 2, -equation[temp_itterator + 1]);
	    }
	}
	temp_itterator++;
    }
    console.log("Equation Result!", equation);

    return equation;
}

function perform_operation(token, lh, rh) {
    console.log("Operation Passed", token, lh, rh);
    switch (token) {
    case TIMES:
	return lh * rh;
    case DIVIDE:
	return lh / rh;
    case '%':
	return lh % rh;
    case '+':
	return lh + rh;
    case '-':
	return lh - rh;
    }
    return 'undefined';
}
