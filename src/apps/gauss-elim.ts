import { Matrix, RowVector } from '../matrix/matrix';
import { Integer } from '../constants/all_constants';
import { Parser } from '../constants/constant_parser';
import { MatrixOperation, ElementaryRowOperation, AddRowToTableau } from '../matrix/row_operation';

interface Step {
	matrix: Matrix;
	row_operation: MatrixOperation | MatrixOperation[];
	operation_str: string;
}

// enum VerticalLineType {
// 	None = "NONE",
// 	Last = "LAST",
// 	Middle = "MIDDLE",
// 	Custom = "CUSTOM"
// }

let steps: Step[] = new Array();
let settings = {
	simplexMode: false,
	vertLine: 'NONE',
	vline_custom: '',
	horizLine: false,
	slackLine: false,
	firstColLine: false,
	addRow: false,
	showLaTeX: false,
	pivButton: false,
};

declare let MathJax: any;

document.addEventListener('DOMContentLoaded', init);

function getCurrentStep(): Step {
	const step = steps.at(-1);
	if (step != undefined) return step;
	throw new Error('Something went wrong');
}

function init() {
	// load the settings if locally saved and then set all of the HTML elements.
	if (localStorage && localStorage.getItem('GEset')) {
		settings = JSON.parse(localStorage.getItem('GEset') ?? '');
		settings.vertLine = settings.vertLine;
	}
	(document.getElementById('simplexMode') as HTMLInputElement).checked = settings.simplexMode;
	Array.from(document.querySelectorAll('input[name="vlineMode"]')).forEach((element) => {
		const el = element as HTMLInputElement;
		el.checked = el.value === settings.vertLine;
	});

	(document.getElementById('vlineCustom') as HTMLInputElement).value = settings.vline_custom;
	(document.getElementById('horizLine') as HTMLInputElement).checked = settings.horizLine;
	(document.getElementById('slackLine') as HTMLInputElement).checked = settings.slackLine;
	(document.getElementById('firstColLine') as HTMLInputElement).checked = settings.firstColLine;
	(document.getElementById('addRow') as HTMLInputElement).checked = settings.addRow;
	(document.getElementById('showLaTeX') as HTMLInputElement).checked = settings.showLaTeX;
	(document.getElementById('pivot-button') as HTMLInputElement).checked = settings.pivButton;

	// Set the click handlers for all buttons
	document.getElementById('save-settings')?.addEventListener('click', parseSettings);
	document.getElementById('copy-latex')?.addEventListener('click', () => {
		copyToClipboard(decorateMatrix(getCurrentStep().matrix))
			.then(() => console.log('text copied !'))
			.catch(() => console.log('error'));
	});

	// set the click handler for the "Clear Matrix Button"
	const clear_matrix_button = document.getElementById('clear-matrix-button');
	if (clear_matrix_button)
		clear_matrix_button.addEventListener('click', () => {
			const matrix_entry = document.getElementById('matrix-entry') as HTMLInputElement;
			matrix_entry.value = '';
			matrix_entry.focus();
		});

	document.getElementById('store-matrix-button')?.addEventListener('click', storeMatrix);
	document.getElementById('restart-button')?.addEventListener('click', restart);

	// event listeners for the row operation input buttons
	document.getElementById('enter-button')?.addEventListener('click', parseRowOp);
	document.getElementById('undo-button')?.addEventListener('click', undo);
	document.getElementById('LaTeX-button')?.addEventListener('click', showLaTeXcode);
	document.getElementById('add-row-button')?.addEventListener('click', addRowToTableau);
	document.getElementById('pivot-button')?.addEventListener('click', clickablePivots);
	const input_box = document.getElementById('input-box');
	if (input_box) {
		input_box.addEventListener('keypress', (e) => {
			if (e.keyCode == 13) parseRowOp();
		});
		input_box.focus();
	}
	Array.from(document.querySelectorAll('input[name="vlineMode"]')).forEach((el) =>
		el.addEventListener('change', handleCustomVline)
	);
	handleCustomVline();
	updateRowOp();
}

function handleCustomVline() {
	// React to when the custom vertical line button is selected.  Disable some of the other options.
	const vline_setting = (document.querySelector('input[name="vlineMode"]:checked') as HTMLInputElement)?.value;
	if (vline_setting === 'CUSTOM') {
		document.querySelectorAll('#slackLine, #firstColLine').forEach((el) => el.setAttribute('disabled', 'true'));
		document
			.querySelectorAll("label[for='slackLine'], label[for='firstColLine']")
			.forEach((el) => el.setAttribute('style', 'color: gray'));
	} else {
		document.querySelectorAll('#slackLine, #firstColLine').forEach((el) => el.removeAttribute('disabled'));
		document
			.querySelectorAll("label[for='slackLine'], label[for='firstColLine']")
			.forEach((el) => el.setAttribute('style', 'color: black'));
	}
}

function parseSettings() {
	settings.slackLine = (document.getElementById('slackLine') as HTMLInputElement).checked;
	settings.vertLine = (document.querySelector('input[name="vlineMode"]:checked') as HTMLInputElement).value;
	settings.vline_custom = (document.getElementById('vlineCustom') as HTMLInputElement).value;
	settings.addRow = (document.getElementById('addRow') as HTMLInputElement).checked;
	settings.simplexMode = (document.getElementById('simplexMode') as HTMLInputElement).checked;
	settings.firstColLine = (document.getElementById('firstColLine') as HTMLInputElement).checked;
	settings.horizLine = (document.getElementById('horizLine') as HTMLInputElement).checked;
	settings.pivButton = (document.getElementById('pivButton') as HTMLInputElement).checked;
	settings.showLaTeX = (document.getElementById('showLaTeX') as HTMLInputElement).checked;
	updateRowOp();
	localStorage.setItem('GEset', JSON.stringify(settings));
}

// This function updates the visibility of buttons on the Row Operation Input line
function updateRowOp() {
	if (settings.showLaTeX) document.getElementById('LaTeX-button')?.classList.remove('d-none');
	else document.getElementById('LaTeX-button')?.classList.add('d-none');
	if (settings.pivButton) document.getElementById('pivot-button')?.classList.remove('d-none');
	else document.getElementById('pivot-button')?.classList.add('d-none');
	if (settings.addRow) document.getElementById('add-row-button')?.classList.remove('d-none');
	else document.getElementById('add-row-button')?.classList.add('d-none');
}

function restart() {
	const matrix_entry = document.getElementById('matrix-entry') as HTMLInputElement;
	matrix_entry.value = steps[0].matrix.toString();
	matrix_entry.focus();
	steps = new Array();
	document.querySelectorAll('.row-op-step, #orig-matrix').forEach((el) => el.remove());
	document.querySelectorAll('#start-div, #entry-buttons').forEach((el) => {
		el.setAttribute('style', 'display: block');
	});
	document.getElementById('input-div')?.classList.add('d-none');
}

/* Take the original matrix input in a text area as rows of numbers,
  store the matrix as an object and give the user a textbox for row operation input.
*/

function storeMatrix() {
	const matrix_entry = document.getElementById('matrix-entry') as HTMLInputElement;
	try {
		// If the matrix has a \hline in it, turn on the appropriate setting
		if (/\hline/.test(matrix_entry.value)) {
			settings.horizLine = true;
			(document.getElementById('horizLine') as HTMLInputElement).checked = settings.horizLine;
		}
		const m = new Matrix(matrix_entry.value);
		// If Simplex Mode is set, make sure that the matrix is in the proper form and detect
		// the basic variable value.
		console.log(settings);
		if (settings.simplexMode) m.checkTableau();

		steps.push({
			matrix: m,
			row_operation: [],
			operation_str: '',
		});
	} catch (err) {
		alert(err);
		return;
	}

	var convertToRational = false;

	// if (matrices[0].isDecimal()) {
	// 	convertToRational = confirm(
	// 		"Your matrix contains decimals and often it's difficult to work with matrices of decimals. " +
	// 			'  Would you like to convert the decimals to rationals?'
	// 	);
	// }

	// if (convertToRational) {
	// 	matrices[0] = matrices[0].toRational();
	// }

	const main_div = document.getElementById('main-div');
	if (main_div) {
		main_div.insertAdjacentHTML('beforeend', `<div id="orig-matrix"> \\[${decorateMatrix(steps[0].matrix)}\\] </div>`);
		typeset(main_div);
	}
	const start_div = document.getElementById('start-div');
	if (start_div) start_div.setAttribute('style', 'display: none;');

	const entry_buttons = document.getElementById('entry-buttons');
	if (entry_buttons) entry_buttons.setAttribute('style', 'display: none');
	document.getElementById('input-div')?.classList.remove('d-none');
}

function typeset(code: Element) {
	MathJax.startup.promise = MathJax.startup.promise
		.then(() => MathJax.typesetPromise([code]))
		.catch((err: { message: string }) => console.log('Typeset failed: ' + err.message));
	return MathJax.startup.promise;
}

function copyToClipboard(text: string): Promise<void> {
	// navigator clipboard api needs a secure context (https)
	if (navigator.clipboard && window.isSecureContext) {
		// navigator clipboard api method'
		return navigator.clipboard.writeText(text);
	} else {
		// text area method
		const textArea = document.createElement('textarea');
		textArea.value = text;
		// make the textarea out of viewport
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		return new Promise((res, rej) => {
			// here the magic happens
			document.execCommand('copy') ? res() : rej();
			textArea.remove();
		});
	}
}

function decorateMatrix(m: Matrix) {
	var mstr = m.toLaTeX();
	// This decorates the matrix depending on the settings.
	if (settings.vertLine === 'CUSTOM') mstr = mstr.replace(/{(r*)}/, `{${settings.vline_custom}}`);
	else {
		if (settings.slackLine) {
			const n = m.ncol() - m.nrow() - 1;
			if (n > 0) mstr = mstr.replace(RegExp(`{(r{${n}})(.*)}`), '{$1|$2}');
		}
		if (settings.vertLine == 'LAST') mstr = mstr.replace(/\{(.*)r\}/, '{$1|r}');
		if (settings.vertLine == 'MIDDLE') {
			var n = m.ncol();
			if (n % 2 != 0) {
				throw new Error('The number of columns must be even to put a line in the middle of the matrix.');
			} else {
				var re = new RegExp('{(r{' + ~~(n / 2) + '})(r+)}');
				mstr = mstr.replace(re, '{$1|$2}');
			}
		}
		if (settings.firstColLine) {
			mstr = mstr.replace(/\{r(.*)\}/, '{r|$1}');
		}
	}
	if (settings.horizLine) {
		var strarr = mstr.split('\\\\');
		mstr = '';
		var n = strarr.length;
		for (var i = 0; i < n - 3; i++) {
			mstr += strarr[i] + '\\\\';
		}
		mstr += strarr[n - 3] + '\\\\ \\hline';
		mstr += strarr[n - 2] + '\\\\' + strarr[n - 1];
	}
	return mstr;
}

function parseRowOp() {
	let operations: ElementaryRowOperation[] = new Array(0);
	const input_box = document.getElementById('input-box') as HTMLInputElement;
	try {
		const str = input_box.value.replaceAll(' ', '');
		operations = ElementaryRowOperation.parseAll(str);
		let m = getCurrentStep().matrix;
		operations.forEach((r: ElementaryRowOperation) => {
			m = m.operate(r);
		});
		steps.push({
			matrix: m,
			row_operation: operations,
			operation_str: str,
		});
	} catch (er) {
		alert(er);
		return;
	}

	let rowOpStr = '\\begin{array}{r}';
	operations.forEach((r) => (rowOpStr += r.toLaTeX() + '\\\\'));
	rowOpStr += '\\end{array}';

	// Add the result to the page
	document
		.getElementById('main-div')
		?.insertAdjacentHTML('beforeend', `<div class="row-op-step" id="out-${steps.length}"></div>`);

	// Typeset the result
	const out_div = document.getElementById(`out-${steps.length}`);
	const m = decorateMatrix(getCurrentStep().matrix);
	if (out_div) {
		out_div.innerHTML = `\\[${rowOpStr}\\qquad ${m} \\]`;
		typeset(out_div);
	}
	// scroll to the bottom after entering in the input.
	window.scroll(0, document.body.clientHeight);
	if (input_box) input_box.value = '';
}

function showLaTeXcode() {
	const latex_modal = document.getElementById('latex-modal-body');
	const m = decorateMatrix(getCurrentStep().matrix);
	if (latex_modal) latex_modal.innerHTML = `<pre>${m}</pre>`;
}

function undo() {
	if (steps.length == 1) {
		restart();
	} else {
		document.querySelector(`#out-${steps.length}`)?.remove();
		// Add another row Operation Input box.

		// Add the last row operation to the string.  Changed to blur, add string, and then refocus or it wasn't working
		const input_box = document.getElementById('input-box') as HTMLInputElement;
		if (input_box) {
			input_box.blur();
			input_box.value = getCurrentStep().operation_str;
			input_box.focus();
		}
		steps.pop();
	}
}

function addRowToTableau() {
	const input_box = document.getElementById('input-box') as HTMLInputElement;
	const input_str = input_box?.value ?? '';

	const currentMatrix = getCurrentStep().matrix;

	if (currentMatrix) {
		const row = new Matrix(input_str).row(1);
		// Make sure that the slack variable multiple is the same as the simplex mode multiples
		// of the existing matrix.
		if (!currentMatrix.SMmultiplier.equals(row.getElement(1, currentMatrix.ncol() - 1))) {
			alert('The slack variable multiple must be the same as the existing multiple.');
			return;
		}

		try {
			const op = new AddRowToTableau(row);
			const mat = currentMatrix.operate(op);

			steps.push({
				matrix: mat,
				row_operation: [op],
				operation_str: input_str,
			});

			// Add the result to the page
			const main_div = document.getElementById('main-div');
			if (main_div)
				main_div.insertAdjacentHTML('beforeend', `<div class="row-op-step" id="out-${steps.length}"></div>`);

			// Typeset the result
			const last_matrix = document.getElementById(`out-${steps.length}`);
			if (last_matrix) {
				last_matrix.innerHTML = `\\[ \\qquad ${decorateMatrix(mat)} \\]`;
				typeset(last_matrix);
			}
			if (input_box) input_box.value = '';
		} catch (err) {
			alert(err);
			return;
		}

		// scroll to the bottom after entering in the input.
		window.scroll(0, document.body.clientHeight);
	}
}

// Called after piv-button is clicked, makes the elements of the currently typeset matrix clickable.
// In addition, hovering an element will give a different cursor and background color.
function clickablePivots() {
	// This sections grabs the current matrix and stores its name and elements
	const entries = document.querySelectorAll(`#out-${steps.length} .mn`);
	const m = getCurrentStep().matrix;
	const numRows = m.nrow();
	let index = 0;

	// Assign an index attribute as the (m,n) coordinates of the entry as a string
	// Uses a little math to calculate (m,n) matrix indices, and stores it as an array value in a dictionary, with the MathJax id as the key
	// If its not the original matrix, then slice the piv(x,y) numbers out
	entries.forEach((el, i) => {
		if (steps.length > 1 && i > 1) {
			// Create index attribute as "m,n"
			el.setAttribute('index', `${(index % numRows) + 1},${Math.ceil((index + 1) / numRows)}`);
			el.addEventListener('click', (ev) => pivotOnClick(ev as MouseEvent));
			el.classList.add('pivotable');
		}
	});
}

// Called during rowOpInput() to make the previous matrix unclickable
function unclickablePivots() {
	// This sections grabs the current matrix and stores its name and elements
	const prev_step = steps.length - 1;

	// var oldMatrixId = $j("#output").children().eq(-3)[0].id;
	const entries = document.querySelectorAll(`#out-${prev_step} .mn`);

	// If its not the original matrix, slice the piv(x,y) numbers
	// if (oldMatrixId != 'orig-matrix') entries = entries.slice(2);

	// Remove onclick, revert class to mn, unbind hover, restore white background since mouseleave won't do it anymore
	entries.forEach((el, i) => {
		if (prev_step > 1 && i > 1) {
			el.removeEventListener('click', (ev) => pivotOnClick(ev as MouseEvent));
			el.classList.remove('pivotable');
		}
	});
}

// Sets the clicked element to green, and pivots on it
function pivotOnClick(ev: MouseEvent) {
	const el = ev.target as Element;
	// Remove last clicked attribute (reset last pivot to white)
	document.querySelectorAll('.lastClicked').forEach((el) => el.classList.remove('lastClicked'));

	// Set clicked element to green, set new lastClicked
	el?.classList.add('lastClicked');

	// Put the piv string in the row input box and then parse the operation
	const input_box = document.getElementById('input-box') as HTMLInputElement;
	if (input_box) input_box.value = `piv(${el?.getAttribute('index')})`;

	// $j("#input-box").val("piv("+$j(this).attr("index")+")");
	parseRowOp();
}
