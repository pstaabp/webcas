var matrices = new Array(0);
var step = new Array(0);
var rowOperation = new Array(0); // this will store the internal object version of the row operation
var rowOperationStr = new Array(0);
var settings = null;
let promise; // Used to hold chain of typesetting calls

// Run the following code upon loading the document.

window.addEventListener("DOMContentLoaded", () => {
  promise = Promise.resolve(); // Used to hold chain of typesetting calls
  step[0] = 0;

  const matrixEntry = document.getElementById("matrix-entry");
  matrixEntry.addEventListener("keypress", (event) => {
    if (event.shiftKey && event.key === "Enter") storeMatrix();
  });
  matrixEntry.focus();

  document.getElementById("clear-matrix-button").addEventListener("click", () => {
    matrixEntry.value = "";
    matrixEntry.focus();
  });
  document.getElementById("store-matrix-button").addEventListener("click", storeMatrix);
  document.getElementById("restart-button").addEventListener("click", restart);
  document.getElementById("save-settings").addEventListener("click", parseSettings);


  document.getElementById("slackVars").addEventListener("change", (evt) => {
    document.getElementById("custom-slack-row").style.display = evt.currentTarget.value == "custom" ? "flex" : "none";
  });

  document.getElementById("copy-latex").addEventListener("click", () => {
    copyToClipboard(decorateMatrix(matrices[matrices.length - 1]))
      .then(() => console.log("text copied !"))
      .catch(() => console.log("error"));
  });
  loadSettings();
  document.getElementById("click-to-pivot-div").style.display = settings.showClickPivot ? "block" : "none";
});

function loadSettings() {
  if (!("localStorage" in window && window["localStorage"] !== null) || localStorage.getItem("GEset") == null) {
    settings = {
      vertLine: "none",
      horizLine: false,
      slackVars: "none",
      firstColLine: false,
      addRow: false,
      showLaTeX: false,
      showClickPivot: false,
    };
  } else {
    settings = JSON.parse(localStorage.getItem("GEset"));

    document.getElementById("vertLine").value = settings.vertLine;

    // Set checkboxes
    document.getElementById("horizLine").checked = settings.horizLine;
    document.getElementById("slackVars").value = settings.slackVars;
    document.getElementById("firstColLine").checked = settings.firstColLine;
    document.getElementById("addRow").checked = settings.addRow;
    document.getElementById("showLaTeX").checked = settings.showLaTeX;
    document.getElementById("showClickPivot").checked = settings.showClickPivot;

    // Handle custom slack variable input visibility
    document.getElementById("custom-slack-row").style.display =
      settings.slackVars == "custom" ? "flex" : "none";
    document.getElementById("customSlack").value = settings.numSlackVars;
  }
}

function parseSettings() {
  settings.vertLine = document.getElementById("vertLine").value;
  settings.slackVars = document.getElementById("slackVars").value;
  settings.numSlackVars = parseInt(document.getElementById("customSlack").value);
  settings.addRow = document.getElementById("addRow").checked;
  settings.firstColLine = document.getElementById("firstColLine").checked;
  settings.horizLine = document.getElementById("horizLine").checked;
  settings.showClickPivot = document.getElementById("showClickPivot").checked;
  settings.showLaTeX = document.getElementById("showLaTeX").checked;
  localStorage.setItem("GEset", JSON.stringify(settings));
}

function restart() {
  const mainDiv = document.getElementById("main-div");
  const inputRow = document.getElementById("input-row");
  if (inputRow) mainDiv.removeChild(inputRow);
  const out0 = document.getElementById("out-0");
  if (out0) mainDiv.removeChild(out0);
  document.getElementById("start").style.display = "block";

  document.getElementById("click-to-pivot-div").style.display = settings.pivButton ? "block" : "none";
  Array.from(document.querySelectorAll(".row-op-step")).forEach((r) => mainDiv.removeChild(r));

  const matrixEntry = document.getElementById("matrix-entry");
  matrixEntry.value = matrices[0].toString().replaceAll("<br/>", "\n").replaceAll(",", " ");
  matrixEntry.focus();

  step = [0];
  matrices = [];
  rowOperation = [];
  rowOperationStr = [];
}

/* Take the original matrix input in a text area as rows of numbers,
  store the matrix as an object and give the user a textbox for row operation input.
*/

async function storeMatrix() {
  try {
    // If the matrix has a \hline in it, turn on the appropriate setting
    const matrixStr = document.getElementById("matrix-entry").value;
    if (/\hline/.test(matrixStr)) {
      settings.horizLine = true;
      document.getElementById("horizLine").checked = true;
    }

    matrices[0] = new Matrix(document.getElementById("matrix-entry").value);
  } catch (err) {
    alert(err);
    return;
  }

  if (matrices[0].isDecimal()) {
    if (
      confirm(
        "Your matrix contains decimals and often it's difficult to work with matrices of decimals. " +
          "Would you like to convert the decimals to rationals?"
      )
    ) {
      matrices[0] = matrices[0].toRational();
    }
  }

  typeset(() => {
    const firstMatrix = document.createElement("div");
    firstMatrix.id = "out-0";
    firstMatrix.style.display = "flex";

    const mathOutput = document.createElement("div");
    mathOutput.style.width = "90%";
    mathOutput.innerHTML = "\\[" + decorateMatrix(matrices[0]) + "\\]";
    firstMatrix.appendChild(mathOutput);

    // copied from below--perhaps com bine to a function.

    // Add a div that will put an small button for copying latex code.
    const copyLaTeXDiv = document.createElement("div");
    copyLaTeXDiv.classList.add("copy-latex");
    copyLaTeXDiv.style.width = "10%";
    copyLaTeXDiv.dataset.step = step.at(-1);

    if (settings.showLaTeX) {
      const copyLaTeXButton = document.createElement("button");
      copyLaTeXButton.classList.add("btn", "btn-secondary-outline");
      copyLaTeXButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
        </svg>`;
      copyLaTeXButton.addEventListener("click", (evt) => {
        const st = parseInt(evt.currentTarget.parentNode.dataset.step);
        navigator.clipboard.writeText(decorateMatrix(matrices[st]));
      });
      copyLaTeXDiv.appendChild(copyLaTeXButton);
    }
    firstMatrix.appendChild(copyLaTeXDiv);
    document.getElementById("main-div").appendChild(firstMatrix);
    document.getElementById("start").style.display = "none";

    return [mathOutput];
  }).then(() => {
    // the matrix needs to be typeset before clickablePivots is called.
    if (document.getElementById("click-to-pivot").checked) {
      clickablePivots();
    } else {
      rowOpInput();
    }
  });
}

function typeset(code) {
  promise = promise
    .then(() => MathJax.typesetPromise(code()))
    .catch((err) => console.log("Typeset failed: " + err.message));
  return promise;
}

function decorateMatrix(m) {
  var mstr = m.toLaTeX();
  // This decorates the matrix depending on the settings.
  if (settings.slackVars == "standard") {
    const n = m.arr[0].length - m.arr.length - 1;
    var re = new RegExp("{(r{" + n + "})(.*)}");
    mstr = mstr.replace(re, "{$1|$2}");
  } else if (settings.slackVars == "custom") {
    const numCols = m.arr[0].length;
    const n = numCols - settings.numSlackVars - 2;
    var re = new RegExp("{(r{" + n + "})(.*)}");
    mstr = mstr.replace(re, "{$1|$2}");
  }
  if (settings.vertLine == "last_col") mstr = mstr.replace(/\{(.*)r\}/, "{$1|r}");
  if (settings.vertLine == "middle") {
    var n = m.arr[0].length;
    if (n % 2 != 0) {
      console.log("ERRoR!!");
    } else {
      var re = new RegExp("{(r{" + ~~(n / 2) + "})(r+)}");
      mstr = mstr.replace(re, "{$1|$2}");
    }
  }
  if (settings.firstColLine) {
    mstr = mstr.replace(/\{r(.*)\}/, "{r|$1}");
  }
  if (settings.horizLine) {
    var strarr = mstr.split("\\\\");
    mstr = "";
    var n = strarr.length;
    for (var i = 0; i < n - 3; i++) {
      mstr += strarr[i] + "\\\\";
    }
    mstr += strarr[n - 3] + "\\\\ \\hline";
    mstr += strarr[n - 2] + "\\\\" + strarr[n - 1];
  }
  return mstr;
}

function rowOpInput() {
  const inputRow = document.createElement("div");
  inputRow.id = "input-row";
  inputRow.classList.add("row", "md-3");

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group");

  const inputBox = document.createElement("input");
  inputBox.id = "input-box";
  inputBox.classList.add("form-control");
  inputBox.placeholder = "Row Operation:";
  inputBox.ariaLabel = "Enter the Row Operation";
  inputBox.addEventListener("keypress", (e) => {
    if (e.key == "Enter") parseRowOp();
  });

  inputGroup.appendChild(inputBox);

  const enterButton = document.createElement("button");
  enterButton.id = "enter-button";
  enterButton.classList.add("btn", "btn-outline-primary");
  enterButton.textContent = "Enter";
  enterButton.addEventListener("click", parseRowOp);

  inputGroup.appendChild(enterButton);

  const undoButton = document.createElement("button");
  undoButton.id = "undo-button";
  undoButton.classList.add("btn", "btn-outline-secondary");
  undoButton.textContent = "Undo";
  undoButton.addEventListener("click", undo);

  inputGroup.appendChild(undoButton);

  if (settings.addRow) {
    const addRowButton = document.createElement("button");
    addRowButton.id = "addRow-button";
    addRowButton.classList.add("btn", "btn-outline-secondary");
    addRowButton.textContent = "Add Row/Col to Tableau";
    addRowButton.addEventListener("click", addRowToTableau);
    inputGroup.appendChild(addRowButton);
  }

  if (settings.showClickPivot) {
    const pivotButton = document.createElement("button");
    pivotButton.id = "LaTeX-button";
    pivotButton.classList.add("btn", "btn-outline-secondary");
    pivotButton.textContent = "Click to Pivot";
    pivotButton.addEventListener("click", clickablePivots);
    inputGroup.appendChild(pivotButton);
  }

  inputRow.appendChild(inputGroup);
  document.getElementById("main-div").appendChild(inputRow);
  inputBox.focus();

  return;
}

/* Create an AddRow ElementaryRowOperation */

AddRow.prototype = new ElementaryRowOperation();
AddRow.prototype.constructor = AddRow;
function AddRow(_row) {
  this.row = _row;
}

function addRowToTableau() {
  const els = document.getElementById("input-box").value.trim().split(/\s+/);

  const lastMat = matrices.at(-1);
  const n = lastMat.arr.length;
  const m = lastMat.arr[n - 1].length;

  if (els.length != m + 1) {
    alert("The new row in the input box does not contain the same number of elements as the new tableau.");
    return;
  }

  const mat = new Matrix(n + 1, m + 1);
  for (var i = 0; i < n - 1; i++) for (var j = 0; j < m - 2; j++) mat.arr[i][j] = lastMat.arr[i][j];

  for (var i = 0; i < n - 1; i++) {
    mat.arr[i][m] = lastMat.arr[i][m - 2];
    mat.arr[i][m] = lastMat.arr[i][m - 1];
  }
  for (var j = 0; j < m - 2; j++) mat.arr[n][j] = lastMat.arr[n - 1][j];
  mat.arr[n][m - 1] = lastMat.arr[n - 1][m - 2];
  mat.arr[n][m] = lastMat.arr[n - 1][m - 1];

  mat.SMMultiplier = lastMat.SMMultiplier;

  for (var j = 0; j < m + 1; j++) mat.arr[n - 1][j] = Mnumber.parseConstant(els[j]);

  matrices.push(mat);
  step.push(step.at(-1) + 1);
  rowOperation.push(new AddRow(matrices.at(-1).arr[n - 1]));
  rowOperationStr.push(els.join(" "));
  addOutputToPage("");
}

function parseRowOp(input_str) {
  var rowOp = null;
  try {
    const str = typeof input_str == "string" ? input_str : document.getElementById("input-box").value;
    rowOperationStr[rowOperationStr.length] = str;
    rowOp = ElementaryRowOperation.parse(str);

    rowOp.forEach(function (r) {
      matrices.push(matrices.at(-1).operate(r));
      rowOperation.push(r);
    });
  } catch (er) {
    alert(er);
    rowOperationStr.pop();
    return;
  }

  step.push(step.at(-1) + rowOp.length);

  var rowOpStr = "\\begin{array}{r}";
  rowOp.forEach((r) => {
    rowOpStr += r.toLaTeX() + "\\\\";
  });
  rowOpStr += "\\end{array}";
  addOutputToPage(rowOpStr);
}

function addOutputToPage(rowOpStr) {
  const inputRow = document.getElementById("input-row");
  if (inputRow) document.getElementById("main-div").removeChild(inputRow);

  // Add the result to the page
  const outputDiv = document.createElement("div");
  outputDiv.id = `out-${step.at(-1)}`;
  outputDiv.classList.add("row-op-step");
  outputDiv.style.display = "flex";

  const mathOutput = document.createElement("div");
  mathOutput.style.width = "90%";
  outputDiv.appendChild(mathOutput);

  // Add a div that will put an small button for copying latex code.
  const copyLaTeXDiv = document.createElement("div");
  copyLaTeXDiv.classList.add("copy-latex");
  copyLaTeXDiv.style.width = "10%";
  copyLaTeXDiv.dataset.step = step.at(-1);

  if (settings.showLaTeX) {
    const copyLaTeXButton = document.createElement("button");
    copyLaTeXButton.classList.add("btn", "btn-secondary-outline");
    copyLaTeXButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
      </svg>`;
    copyLaTeXButton.addEventListener("click", (evt) => {
      const st = parseInt(evt.currentTarget.parentNode.dataset.step);
      navigator.clipboard.writeText(decorateMatrix(matrices[st]));
    });
    copyLaTeXDiv.appendChild(copyLaTeXButton);
  }
  outputDiv.appendChild(copyLaTeXDiv);

  document.getElementById("main-div").appendChild(outputDiv);

  typeset(() => {
    mathOutput.innerText = `\\[${rowOpStr} \\qquad ${decorateMatrix(matrices.at(-1))} \\]`;
    return [outputDiv];
  }).then(() => {
    if (document.getElementById("click-to-pivot").checked) {
      clickablePivots();
    } else {
      rowOpInput();
    }
  });

  // scroll to the bottom after entering in the input.
  window.scroll(0, document.body.clientHeight);
}

function undo() {
  const mainDiv = document.getElementById("main-div");
  if (step.at(-1) == 0) {
    restart();
  } else {
    mainDiv.removeChild(document.getElementById("input-row"));
    mainDiv.removeChild(document.getElementById(`out-${step.at(-1)}`));

    // Remove the last few matrices (if multiple steps) from the matrices array.
    var numsteps = step.at(-1) - step[step.length - 2];
    for (var i = 0; i < numsteps; i++) {
      matrices.pop();
    }
    step.pop();

    rowOpInput();

    // Add the last row operation to the string.
    const inputBox = document.getElementById("input-box");
    inputBox.value = rowOperationStr.pop();
    inputBox.focus();
  }
}

// Called after piv-button is clicked, makes the elements of the currently typeset matrix clickable.
// In addition, hovering an element will give a different cursor and background color.
function clickablePivots() {
  // remove the classname and event listeners from previous matrix.
  Array.from(document.querySelectorAll(".pivotable")).forEach((el) => {
    el.removeEventListener("click", pivotOnClick);
    el.classList.remove("pivotable");
  });

  // This sections grabs the current matrix and stores its name and elements
  var entries = Array.from(document.querySelectorAll(`#out-${step.at(-1)} mjx-table mjx-mn`));

  // If its not the original matrix, then slice the piv(x,y) numbers out
  if (step.at(-1) > 0) entries.splice(0, 2);
  var numCols = matrices.at(-1).arr[0].length;

  // Assign an index attribute as the (m,n) coordinates of the entry as a string
  entries.forEach((el, index) => {
    el.dataset.index = `(${Math.ceil((index + 1) / numCols)},${1 + (index % numCols)})`;
    el.addEventListener("click", pivotOnClick);
    el.classList.add("pivotable");
  });
}

function pivotOnClick() {
  // Remove last clicked attribute (reset last pivot to white)
  const lastClicked = document.querySelector(".lastClicked");
  if (lastClicked) lastClicked.classList.remove("lastClicked");
  this.classList.add("lastClicked");
  parseRowOp(`piv${this.dataset.index}`);
}
