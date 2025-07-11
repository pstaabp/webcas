var matrices = new Array(0);
var step = new Array(0);
var rowOperation = new Array(0); // this will store the internal object version of the row operation
var rowOperationStr = new Array(0);
var settings = null;
var $j = jQuery.noConflict();
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

  document.getElementById("clear-matrix-button").addEventListener("click", () => (matrixEntry.value = ""));
  document.getElementById("store-matrix-button").addEventListener("click", storeMatrix);
  document.getElementById("restart-button").addEventListener("click", restart);
  document.getElementById("save-settings").addEventListener("click", parseSettings);

  document.getElementById("copy-latex").addEventListener("click", () => {
    copyToClipboard(decorateMatrix(matrices[matrices.length - 1]))
      .then(() => console.log("text copied !"))
      .catch(() => console.log("error"));
  });
  loadSettings();
});

function loadSettings() {
  if (!("localStorage" in window && window["localStorage"] !== null) || localStorage.getItem("GEset") == null) {
    settings = {
      vertLine: "none",
      horizLine: false,
      slackLine: "none",
      firstColLine: false,
      addRow: false,
      showLaTeX: false,
      pivButton: false,
    };
  } else {
    settings = JSON.parse(localStorage.getItem("GEset"));

    document.getElementById("vertLine").value = settings.vertLine;

    // Set checkboxes
    document.getElementById("horizLine").checked = settings.horizLine;
    document.getElementById("firstColLine").checked = settings.firstColLine;
    document.getElementById("addRow").checked = settings.addRow;
    document.getElementById("showLaTeX").checked = settings.showLaTeX;
    document.getElementById("pivButton").checked = settings.pivButton;

    // Not sure what these are doing:

    // $j("#numSlackVars").attr("disabled", true);
    // if (settings["slackLine"] == "none") {
    //   $j("#slackLine[value='none']").attr("checked", "checked");
    // } else if (settings["slackLine"] == "std") {
    //   $j("#slackLine[value='std']").attr("checked", "checked");
    // } else if (parseInt(settings["slackLine"]) > -1) {
    //   $j("#numSlackVars").attr("disabled", false);
    //   $j("#numSlackVars").val(settings["slackLine"]);
    //   $j("#slackLine[value='custom']").attr("checked", "checked");
    // }
  }
}

function parseSettings() {
  settings.vertLine = document.getElementById("vertLine").value;
  settings.slackLine = document.getElementById("slackLine").checked;
  settings.addRow = document.getElementById("addRow").checked;
  settings.firstColLine = document.getElementById("firstColLine").checked;
  settings.horizLine = document.getElementById("horizLine").checked;
  settings.pivButton = document.getElementById("pivButton").checked;
  settings.showLaTeX = document.getElementById("showLaTeX").checked;
  localStorage.setItem("GEset", JSON.stringify(settings));
}

function restart() {
  console.log("in restart");
  const mainDiv = document.getElementById("main-div");
  mainDiv.removeChild(document.getElementById("input-row"));
  mainDiv.removeChild(document.getElementById("out-0"));
  document.getElementById("start").style.display = "block";

  Array.from(document.querySelectorAll('.row-op-step')).forEach( (r) => mainDiv.removeChild(r));

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
    if (/\hline/.test($j("#matrix-entry").val())) {
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

  const mainDiv = document.getElementById("main-div");

  typeset(() => {
    const firstMatrix = document.createElement("div");
    firstMatrix.id = "out-0";
    firstMatrix.innerHTML = "\\[" + decorateMatrix(matrices[0]) + "\\]";
    mainDiv.appendChild(firstMatrix);
    document.getElementById("start").style.display = "none";
    rowOpInput();
    return [firstMatrix];
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
  if (settings.slackLine) {
    const n = m.arr[0].length - m.arr.length - 1;
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

  if (settings.pivButton) {
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

  addOutputToPage("");
}

function showLaTeXcode() {
  console.log("in showLaTeXCode");
  const latexModel = new bootstrap.Modal(document.getElementById("latex-modal"));
  document.getElementById("latex-modal-body").innerHTML = "<pre>" + decorateMatrix(matrices.at(-1)) + "</pre>";
  latexModel.show();
}

function parseRowOp() {
  var rowOp = null;
  try {
    const str = document.getElementById("input-box").value;
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
  document.getElementById("main-div").removeChild(document.getElementById("input-row"));

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
  // console.log(outputDiv.innerHTML);

  typeset(() => {
    mathOutput.innerText = "\\[" + rowOpStr + "\\qquad" + decorateMatrix(matrices.at(-1)) + "\\]";
    return [outputDiv];
  });

  rowOpInput();
  // scroll to the bottom after entering in the input.
  window.scroll(0, document.body.clientHeight);
}

function undo(obj) {
  console.log("in undo");
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
  // This sections grabs the current matrix and stores its name and elements
  var newMatrixId = "out-" + step.at(-1);
  var entries = $j(`#${newMatrixId} .mn`);
  var numRows = matrices[matrices.length - 1].arr.length;
  var index = 0;

  // Assign an index attribute as the (m,n) coordinates of the entry as a string
  // Uses a little math to calculate (m,n) matrix indices, and stores it as an array value in a dictionary, with the MathJax id as the key
  // If its not the original matrix, then slice the piv(x,y) numbers out
  if (newMatrixId != "out-0") entries = entries.slice(2);

  entries
    .forEach(function () {
      $j(this).attr("index", (index % numRows) + 1 + "," + Math.ceil((index + 1) / numRows)); // Create index attribute as "m,n"
      this.on("click", pivotOnClick); // Set onclick
      index++;
    })
    .addClass("pivotable"); // Set pivotable class for highlighting
}

// Called during rowOpInput() to make the previous matrix unclickable
function unclickablePivots() {
  // This sections grabs the current matrix and stores its name and elements
  var matrixID = "out-" + step.at(-1);
  var entries = $j("#" + matrixID + " .mn");

  // If its not the original matrix, slice the piv(x,y) numbers
  if (matrixID != "out-0") entries = entries.slice(2);

  // Remove onclick, revert class to mn, unbind hover, restore white background since mouseleave won't do it anymore
  entries
    .forEach(function () {
      $j(this).off("click", pivotOnClick);
    })
    .removeClass("pivotable");
}

// Sets the clicked element to green, and pivots on it
function pivotOnClick() {
  // Remove last clicked attribute (reset last pivot to white)
  $j(".lastClicked").removeClass("lastClicked");

  // Set clicked element to green, set new lastClicked
  $j(this).addClass("lastClicked");

  // Put the piv string in the row input box and then parse the operation
  $j("#input-box").val("piv(" + $j(this).attr("index") + ")");
  parseRowOp();
}

// return a promise
function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    });
  }
}
