var storage = {};

var currentStep = 1;
var inputVisible = false;

var results = new Array();
var matrix_modal;
let promise; // Used to hold chain of typesetting calls

const pencil = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>`;
const trashcan = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
   <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
   <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
   </svg>`;

// Run the following code upon loading the document.

window.addEventListener("DOMContentLoaded", () => {
  promise = Promise.resolve(); // Used to hold chain of typesetting calls
  if (!("localStorage" in window && window["localStorage"] !== null)) alert("You need to update your browser. ");

  document.getElementById("save-matrix-button").addEventListener("click", storeMatrix);
  document.getElementById("clear-matrix-button").addEventListener("click", () => {
    const matrixEntry = document.getElementById("matrix-entry");
    matrixEntry.value = "";
    matrixEntry.focus();
  });

  loadStorage();
  updateMatrices();
  createInputForm();

  // setup the enter matrix modal
  matrix_modal = new bootstrap.Modal(document.getElementById("enter-matrix-modal"), {});
});

function loadStorage() {
  const numKeys = localStorage.length;
  for (var i = 0; i < numKeys; i++) {
    const key = localStorage.key(i);
    const match = /matrix\-(\w+)/.exec(key);
    if (match) {
      const name = match[1];
      const m = new Matrix(
        localStorage
          .getItem(key)
          .replace(/<br\/>/g, ";")
          .replace(/,/g, " ")
      );
      storage[key] = m;
    }
  }
}

function typeset(code) {
  promise = promise
    .then(() => MathJax.typesetPromise(code()))
    .catch((err) => console.log("Typeset failed: " + err.message));
  return promise;
}

function updateMatrices() {
  document.getElementById("matrices").innerHTML = "";

  typeset(() => {
    const matrixCells = []; // store these for typsetting.
    for (const [key, m] of Object.entries(storage)) {
      const match = /matrix\-(\w+)/.exec(key);
      if (!match) continue;
      const name = match[1];
      const liEl = document.createElement("li");
      liEl.classList.add("list-group-item");
      liEl.id = key;

      const table = document.createElement("table");
      const row1 = document.createElement("tr");
      const cell1 = document.createElement("td");
      cell1.rowspan = 2;
      cell1.textContent = `\\( ${decorateVariable(name)} = ${m.toLaTeX()} \\)`;
      row1.appendChild(cell1);
      matrixCells.push(cell1);

      // const row2 = document.createElement("tr");
      const cell2 = document.createElement("td");
      const div1 = document.createElement("div");
      div1.classList.add('btn-group-vertical');
      cell2.style.padding = '3ex'

      const editButton = document.createElement("button");
      editButton.classList.add("btn", "btn-small", "btn-outline-dark", "edit-matrix");
      editButton.dataset.matrix = key;
      editButton.innerHTML = pencil;
      editButton.addEventListener("click", editMatrix);
      div1.appendChild(editButton);

      const cell3 = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-small", "btn-outline-dark", "delete-matrix");
      deleteButton.innerHTML = trashcan;
      deleteButton.dataset.matrix = key;
      deleteButton.addEventListener("click", deleteMatrix);
      div1.appendChild(deleteButton);
      cell2.appendChild(div1);
      row1.appendChild(cell2);
      // row2.appendChild(cell2);
      // row2.appendChild(cell3);
      table.appendChild(row1);
      // table.appendChild(row2);
      liEl.appendChild(table);
      document.getElementById("matrices").appendChild(liEl);
    }

    return matrixCells;
  });
}

function decorateVariable(variable) {
  return variable.replace(/([a-zA-Z])(\d)/g, "$1_{$2}");
}

function createInputForm() {
  const div1 = document.createElement("div");
  div1.classList.add("row", "input-boxes");

  const div2 = document.createElement("div");
  div2.classList.add("input-group", "md-3");
  const inputBox = document.createElement("input");
  inputBox.id = "input-text";
  inputBox.classList.add("form-control");
  inputBox.placeholder = "Matrix Expression";
  inputBox.ariaLabel = "Enter the matrix expression";
  inputBox.addEventListener("keypress", (e) => {
    if (e.key == "Enter") parseInput(inputBox.value);
  });

  const enterButton = document.createElement("button");
  enterButton.classList.add("btn", "btn-outline-primary");
  enterButton.textContent = "Enter";
  enterButton.addEventListener("click", () => parseInput(inputBox.value));

  div2.appendChild(inputBox);
  div2.appendChild(enterButton);
  div1.appendChild(div2);

  document.getElementById("left-output").appendChild(div1);
}

var unary_opers = ["det", "inv", "rref", "I"];
var binary_opers = ["aug"];

var unaryRE = /(\w+)\(([\w\[\]]+)\)/;
var binaryRE = /(\w+)\(([\w\[\]]+),([\w\[\]]+)\)/;
var matOpRE = /^(\[\d+\]|\w+|-?\d+|\(-?\d+\/\d+\))([\+\-\*\^])(\[\d+\]|\w+|\d+)$/;

/* this gets the matrix that is either stored as a variable name
  or as [\d] */
function getMatrix(str) {
  const match = /^match-(.*)$/.exec(str);
  const m = match ? storage[str] : storage[`matrix-${str}`];
  var br = /\[(\d+)\]/.exec(str);
  if (m) {
    return { matrix: m, expr: str };
  } else if (br) {
    var i = parseInt(br[1]);
    if (i >= 0 && i <= results.length) {
      return { matrix: results[i - 1].matrix, expr: `(${results[i - 1].expr})` };
    } else {
      throw "The equation " + str + " is not defined.";
    }
  } else {
    throw "The argument " + str + " is not defined";
  }
}

/* this is for determinant, inverse, reduced row-echelon form */

function unaryOperator(oper, varName) {
  var matrix, expr;
  if (oper !== "I") {
    matrix = getMatrix(varName).matrix;
    expr = getMatrix(varName).expr;
  }
  switch (oper) {
    case "det":
      return { matrix: matrix.det2(), expr: `\\mbox{det}(${expr})` };
    case "inv":
      return { matrix: matrix.invert(), expr: `${expr}^{-1}` };
    case "rref":
      return { matrix: matrix.rowReduce(), expr: `\\mbox{rref}(${expr})` };
    case "I":
      var n;
      try {
        n = parseInt(varName);
      } catch {
        throw `The argument ${varName} needs to be an integer`;
      }
      return { matrix: Matrix.identity(n), expr: `\\mbox{I}_{${n}}` };
  }
}

/* this performs operations like 2*A or A+B */

function matrixOperation(oper, var1, var2) {
  var num1, num2, mat1, mat2, expr1, expr2;
  var num1_scalar = false;
  var num2_scalar = false;
  // if the first "variable" is a number
  try {
    num1 = Mnumber.parseConstant(var1);
    num1_scalar = true;
  } catch (err) {
    // else it is a variable.
    mat1 = getMatrix(var1).matrix;
    expr1 = getMatrix(var1).expr;
  }
  if (oper == "^" && var2 == "T") {
    // transpose
    mat1 = getMatrix(var1).matrix;
    expr1 = getMatrix(var1).expr;
    var res = mat1.transpose();
    return { matrix: res, expr: `(${expr1})^{\\intercal}` };
  }

  try {
    num2 = Mnumber.parseConstant(var2);
    num2_scalar = true;
  } catch {
    // else it is a variable
    mat2 = getMatrix(var2).matrix;
    expr2 = getMatrix(var2).expr;
  }

  switch (oper) {
    case "+":
      return { matrix: mat1.plus(mat2), expr: `${expr1} + ${expr2}` };
    case "-":
      return { matrix: mat1.minus(mat2), expr: `${expr1} - ${expr2}` };
    case "*":
      return num1_scalar
        ? { matrix: mat2.times(num1), expr: `${num1} \\, ${expr2}` }
        : { matrix: mat1.times(mat2), expr: `${expr1} \\, ${expr2}` };
    case "^":
      var pow = parseInt(var2);
      if (isNaN(pow)) {
        throw `${var2} is not an integer`;
      }
      return { matrix: mat1.power(pow), expr: `${expr1}^{${pow}}` };
  }
}

function parseInput(str) {
  var output;

  try {
    if (unaryRE.test(str)) {
      var oper = unaryRE.exec(str)[1];
      var arg = unaryRE.exec(str)[2];
      if (!unary_opers.includes(oper)) {
        throw "The operator " + oper + " is not defined.";
      }
      output = unaryOperator(oper, arg);
    } else if (matOpRE.test(str)) {
      var ops = matOpRE.exec(str);
      output = matrixOperation(ops[2], ops[1], ops[3]);
    } else if (binaryRE.test(str)) {
      var ops = binaryRE.exec(str);
      if (!binary_opers.includes(ops[1])) {
        throw "The function " + ops[1] + " is not defined.";
      }
      switch (ops[1]) {
        case "aug":
          var mat1 = getMatrix(ops[2]);
          var mat2 = getMatrix(ops[3]);
          var res = mat1.augment(mat2);
          output = {
            matrix: res,
            expr: "\\mbox{aug(}" + ops[2] + "," + ops[3] + ")",
          };
      }
    } else {
      throw "I don't understand the operation: " + str;
    }
  } catch (er) {
    alert(er);
    return;
  }

  results[results.length] = { matrix: output.matrix, expr: output.expr };

  const tableRow = document.createElement("tr");
  const cell1 = document.createElement("td");
  cell1.classList.add("lcol");
  cell1.textContent = `\\[ ${decorateVariable(output.expr)} = ${output.matrix.toLaTeX()} \\]`;

  const cell2 = document.createElement("td");
  cell2.classList.add("rcol");
  cell2.textContent = `[${currentStep}]`;

  tableRow.appendChild(cell1);
  tableRow.appendChild(cell2);
  currentStep++;

  typeset(() => {
    document.getElementById("tab").appendChild(tableRow);
  }).then(() => {
    Array.from(document.querySelectorAll(".input-boxes")).forEach((el) => el.parentNode.removeChild(el));
    createInputForm();
  });
}

// This matrix getter and setter handles both memory and local storage
// If the name is matrix-XXX, the parse this correctly.

// function getMatrix(name) {
//   // const match = /matrix\-(\w+)/.exec(name);
//   if (storage[name]) return storage[name];
//   console.err(`The matrix with name: ${name} is not found`);
// }

function saveMatrix(name, mat) {
  storage[`matrix-${name}`] = mat;
  window.localStorage[`matrix-${name}`] = mat.toPlainText();
}

function editMatrix() {
  const match = /matrix\-(\w+)/.exec(this.dataset.matrix);
  console.log(match);
  matrix_modal.show();
  var matrix = storage[this.dataset.matrix];
  document.getElementById("matrix-name").value = match[1];
  const matrixEntry = document.getElementById("matrix-entry");
  matrixEntry.value = storage[this.dataset.matrix].toPlainText().replace("<br/>", "\n").replace(",", " ");
  matrixEntry.focus();
}

function deleteMatrix() {
  console.log(this);
  const matrix_name = this.dataset.matrix;
  delete storage[matrix_name];
  localStorage.removeItem(matrix_name);
  updateMatrices();
}

function storeMatrix() {
  var m;
  try {
    m = new Matrix(document.getElementById("matrix-entry").value);
  } catch (err) {
    alert(err);
    return;
  }

  saveMatrix(document.getElementById("matrix-name").value, m);
  updateMatrices();
  matrix_modal.hide();
}
