import { Matrix } from '../matrix/matrix';

declare let MathJax: any;
declare let bootstrap: any;

// let matrix_modal: Element;

document.addEventListener('DOMContentLoaded', init);

type MatrixStorage = { [k: string]: Matrix };

const pencil =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
	'<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/> ' +
	'<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
	'</svg>';
const trashcan =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
	'<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
	'<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
	'</svg>';

const storage: MatrixStorage = {};

function init() {
	// load the settings if locally saved and then set all of the HTML elements.
	const numKeys = localStorage.length;
	for (let i = 0; i < numKeys; i++) {
		const key = localStorage.key(i) ?? '';
		const matrix = localStorage.getItem(key);
		const match = /matrix\-(\w+)/.exec(key);
		if (match && matrix) {
			console.log(matrix);
			console.log(match);
			const name = match[1];
			const m = new Matrix(matrix.replace(/<br\/>/g, ';').replace(/,/g, ' '));
			storage[name] = m;
		}
	}

	document.getElementById('save-matrix-button')?.addEventListener('click', storeMatrix);
	document.getElementById('clear-matrix-button')?.addEventListener('click', () => {
		const matrix_entry = document.getElementById('matrix-entry') as HTMLInputElement;
		if (matrix_entry) {
			matrix_entry.value = '';
			matrix_entry.focus();
		}
	});
	updateMatrices();
}

function updateMatrices() {
	const matrices_panel = document.getElementById('matrices');
	if (matrices_panel) matrices_panel.innerHTML = '';

	Object.entries(storage).forEach(([key, mat], i) => {
		const str = `<li class="list-group-item" id="matrix-${i}">
      		<table><tr><td rowspan="2">\\(${decorateVariable(key)}= ${mat.toLaTeX()} \\)</td>
      			<td><button class="btn btn-small btn-outline-dark edit-matrix" data-matrix="${i}"
							onclick="editMatrix">
							${pencil}</button></td></tr>
      			<tr><td><button class="btn btn-small btn-outline-dark delete-matrix" data-matrix="${i}
							onclick="deleteMatrix">
						 	${trashcan}</button></td></tr></table></li>`;
		if (matrices_panel) {
			matrices_panel.insertAdjacentHTML('beforeend', str);
			typeset(matrices_panel);
		}
	});

	// document.querySelector('.edit-matrix')?.addEventListener('click', editMatrix);
	// document.querySelector('.delete-matrix')?.addEventListener('click', deleteMatrix);

	document.getElementById('input-text')?.focus();
}

function storeMatrix() {
	let m;
	try {
		const matrix_entry = document.getElementById('matrix-entry') as HTMLInputElement;
		if (matrix_entry) m = new Matrix(matrix_entry.value);
	} catch (err) {
		alert(err);
	}
	if (!m) return;
	const matrix_name = document.getElementById('matrix-name') as HTMLInputElement;
	const str = matrix_name?.value;
	window.localStorage['matrix-' + str] = m;
	storage[str] = m;

	updateMatrices();
	const matrix_modal = bootstrap.Modal.getInstance(document.getElementById('enter-matrix-modal'));
	matrix_modal.hide();
}

function editMatrix(el: Element) {
	const num = el.getAttribute('data-matrix') ?? '';
	const name = Object.keys(storage)[parseInt(num)];
	const matrix_name = document.getElementById('matrix-name') as HTMLInputElement
	const matrix_entry = document.getElementById('matrix-entry') as HTMLInputElement
	if (matrix_name) matrix_name.value = name;
	if (matrix_entry) matrix_entry.value = storage[name].toString();
}

function deleteMatrix(el: Element) {}

function typeset(code: Element) {
	MathJax.startup.promise = MathJax.startup.promise
		.then(() => MathJax.typesetPromise([code]))
		.catch((err: { message: string }) => console.log('Typeset failed: ' + err.message));
	return MathJax.startup.promise;
}

function decorateVariable(variable: string): string {
	return variable.replace(/([a-zA-Z])(\d)/g, '$1_$2');
}
