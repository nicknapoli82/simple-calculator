// Main file for all calculator functionality

const COLUMBS = 4;
const ROWS = 5;


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
    case '&divide':
    case '&times':
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
		       ['7', '8', '9', '&divide'],
		       ['4', '5', '6', '&times'],
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
    if (text_field.innerText === '0') {
	text_field.innerText = '';
	text_field.innerText += value;
    }
    else if (value === 'AC') {
	text_field.innerText = '0';
    }
    else if (value === '=') {
	generate_result();
    }
    else text_field.innerText += value;
}

create_buttons_field();


// Now for what I think is the scary part. Figuring out how to generate a result
// based on some type of input
function generate_result() {
    let equation = tokenize(text_field.innerText);

    let op_lh_rh = { op: 0, lh: 0, rh: 0 };
    let prescidence = 3;
    let equation_index = 0;


    // Probably should refactor this into a recursive function
    // Want to think a bit
    // Play with child :)
    while (equation.length > 1) {
	// Consume array bits by operator prescidence
	if (prescidence === 3 && !Number(equation[equation_index])) {
	    
	}
	else equation_index++;
	if (prescidence === 2 && !Number(equation[equation_index])) {
	    
	}
	else equation_index++;
	if (prescidence === 1 && !Number(equation[equation_index])) {
	    
	}
	else equation_index++;
    }
}

// tokenize takes raw text and returns an array of numbers and tokens
const TOKENS = ['(', ')', '%', '&divide', '&times', '+', '-'];

function tokenize(equation) {
    let result = [];
    let text_index = 0;

    while (text_index < equation.length) {
	if (Number(equation[text_index])) {
	    result.push(parseFloat(equation.slice(text_index)));
	    text_index += (result[result.length - 1].toString()).length;
	}

	console.log(equation[text_index]);
	
	for (t in TOKENS) {
	    if (TOKENS[t] === equation[text_index]) {
		result.push(TOKENS[t]);
		text_index++;
		break;
	    }
	}
    }

    return result;
}
