var matrices = new Array(0);
var step = new Array(0);
var rowOperation = new Array(0); // this will store the internal object version of the row operation
var rowOperationStr = new Array(0);
var settings = null;
var $j = jQuery.noConflict();

// Run the following code upon loading the document.

$j(document).ready(function () {
  step[0] = 0;

  $j("#settings").css("display", "none");
  $j("#clear-matrix-button").click(function () {
    $j("#matrix-entry").val("").focus();
  });
  $j("#store-matrix-button").click(storeMatrix);
  $j("#restart-button").click(function () {
    restart();
  });
  $j("#set-link").click(function () {
    $j("#settings").show("blind", null, "normal", null);
    return false;
  });
  $j("#help-link").click(function () {
    $j("#help").show("blind", null, "normal", null);
    return false;
  });

  // Manage the settings.  Lookup if they have been stored, if not create new settings.

  if (
    !("localStorage" in window && window["localStorage"] !== null) ||
    localStorage.getItem("GEset") == null
  ) {
    settings = {
      simplexMode: false,
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
    $j("#simplexMode").attr("checked", settings.simplexMode);
    $j("#vertLine").val(settings.vertLine);
    $j("#horizLine").attr("checked", settings.horizLine);
    $j("#numSlackVars").attr("disabled", true);
    if (settings["slackLine"] == "none") {
      $j("#slackLine[value='none']").attr("checked", "checked");
    } else if (settings["slackLine"] == "std") {
      $j("#slackLine[value='std']").attr("checked", "checked");
    } else if (parseInt(settings["slackLine"]) > -1) {
      $j("#numSlackVars").attr("disabled", false);
      $j("#numSlackVars").val(settings["slackLine"]);
      $j("#slackLine[value='custom']").attr("checked", "checked");
    }
    $j("#firstColLine").attr("checked", settings.firstColLine);
    $j("#addRow").attr("checked", settings.addRow);
    $j("#showLaTeX").attr("checked", settings.showLaTeX);
    $j("#pivButton").attr("checked", settings.pivButton);
  }

  $j("#matrix-entry").focus();

  // parse settings
  $j("#save-settings").click(parseSettings);

  // set the copy latex button code
  $j("#copy-latex").click(function () {
    copyToClipboard(decorateMatrix(matrices[matrices.length - 1]))
      .then(() => console.log("text copied !"))
      .catch(() => console.log("error"));
  });
});

function parseSettings() {
  settings.vertLine = $j("#vertLine").val();
  settings.slackLine = $j("#slackLine").is(":checked");
  settings.simplexMode = $j("#simplexMode").is(":checked");
  settings.addRow = $j("#addRow").is(":checked");
  settings.firstColLine = $j("#firstColLine").is(":checked");
  settings.horizLine = $j("#horizLine").is(":checked");
  settings.pivButton = $j("#pivButton").is(":checked");
  settings.showLaTeX = $j("#showLaTeX").is(":checked");
  localStorage.setItem("GEset", JSON.stringify(settings));
}

function restart() {
  $j(".row-op-step,#out-0,.input-boxes").remove();
  $j("#row1,#entry-buttons").css("display", "block");
  $j("#matrix-entry").val(
    matrices[0].toString().gsub("<br/>", "\n").gsub(",", " ")
  );
  step = [0];
  matrices = [];
  $j("#matrix-entry").focus();
}

/* Take the original matrix input in a text area as rows of numbers,
  store the matrix as an object and give the user a textbox for row operation input.
*/

async function storeMatrix() {
  try {
    // If the matrix has a \hline in it, turn on the appropriate setting
    if (/\hline/.test($j("#matrix-entry").val())) {
      settings.horizLine = true;
      $j("#horizLine").attr("checked", settings.horizLine);
    }

    matrices[0] = new Matrix($j("#matrix-entry").val());
  } catch (err) {
    alert(err);
    return;
  }

  var convertToRational = false;

  if (matrices[0].isDecimal()) {
    convertToRational = confirm(
      "Your matrix contains decimals and often it's difficult to work with matrices of decimals. " +
        "  Would you like to convert the decimals to rationals?"
    );
  }

  if (convertToRational) {
    matrices[0] = matrices[0].toRational();
  }

  if (settings.simplexMode) {
    matrices[0].SMMultiplier = new Integer(1);
  }

  $j("#main-div").append(
    "<div id='out-0'> \\[" + decorateMatrix(matrices[0]) + "\\] </div>"
  );

  $j("#row1").css("display", "none");
  $j("#entry-buttons").css("display", "none");
  // rowOpInput();
  const node = document.getElementById("out-0");
  await MathJax.startup.promise // make sure initial typesetting has taken place
  // MathJax.typesetClear([node]) // clear MathJax awareness of this element
  await MathJax.typesetPromise([node]) // typeset anew
  // console.log(node);
  // MathJax.typeset();
  // MathJax.Hub.Queue(["Typeset", MathJax.Hub, "out-0"]);
}

function decorateMatrix(m) {
  var mstr = m.toLaTeX();
  // This decorates the matrix depending on the settings.
  if (settings.slackLine) {
    const n = m.arr[0].length - m.arr.length - 1;
    var re = new RegExp("{(r{" + n + "})(.*)}");
    mstr = mstr.replace(re, "{$1|$2}");
  }
  if (settings.vertLine == "last_col")
    mstr = mstr.replace(/\{(.*)r\}/, "{$1|r}");
  if (settings.vertLine == "middle") {
    var n = m.arr[0].length;
    if (n % 2 != 0) {
      console.log("ERRoR!!");
    } else {
      var re = new RegExp("{(r{" + ~~(n / 2) + "})(r+)}");
      mstr = mstr.replace(re, "{$1|$2}");
      console.log(mstr);
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
  var str =
    "<div class='row md-3 input-boxes'><div class='input-group'> " +
    "<input id='input-box' type='text' class='form-control' placeholder='Row Operation:' aria-label='Enter the Row Operation'> " +
    "<button id='enter-button' class='btn btn-outline-secondary' type='button'>Enter</button> " +
    "<button id='undo-button' class='btn btn-outline-secondary' type='button'>Undo</button>";
  if (settings.showLaTeX) {
    str +=
      "<button id='LaTeX-button' class='btn btn-outline-secondary'  data-bs-toggle='modal' data-bs-target='#latex-modal'>Show LaTeX</button>";
  }
  if (settings.addRow) {
    str +=
      "<button id='addRow-button' class='btn btn-outline-secondary'>Add Row/Col to Tableau</button>";
  }
  if (settings.pivButton) {
    str += "<button id='pivButton' class='btn btn-outline-secondary'>Select Pivot</button>";
  }
  str += "</div></div>";

  $j("#main-div").append(str);
  $j("#input-box").keypress(function (e) {
    if (e.keyCode == 13) parseRowOp();
  });
  $j("#enter-button").click(parseRowOp);
  $j("#undo-button").click(undo);
  $j("#LaTeX-button").click(showLaTeXcode);
  $j("#addRow-button").click(addRowToTableau);
  $j("#pivButton").click(clickablePivots);
  // if ($j("#output").children().length > 2) unclickablePivots();
  // remove event handlers from previous matrices.
  unclickablePivots();
  $j("#input-box").focus();
}

function addRowToTableau() {
  const els = $j("#input-box").val().trim().split(/\s+/);

  const lastMat = matrices.last();

  const n = lastMat.arr.length;
  const m = lastMat.arr[n - 1].length;

  if (els.length != m + 1) {
    alert(
      "The new row in the input box does not contain the same number of elements as the new tableau."
    );
    return;
  }

  const mat = new Matrix(n + 1, m + 1);
  for (var i = 0; i < n - 1; i++)
    for (var j = 0; j < m - 2; j++) mat.arr[i][j] = lastMat.arr[i][j];

  for (var i = 0; i < n - 1; i++) {
    mat.arr[i][m] = lastMat.arr[i][m - 2];
    mat.arr[i][m] = lastMat.arr[i][m - 1];
  }
  for (var j = 0; j < m - 2; j++) mat.arr[n][j] = lastMat.arr[n - 1][j];
  mat.arr[n][m - 1] = lastMat.arr[n - 1][m - 2];
  mat.arr[n][m] = lastMat.arr[n - 1][m - 1];

  mat.SMMultiplier = lastMat.SMMultiplier;

  for (var j = 0; j < m + 1; j++)
    mat.arr[n - 1][j] = Mnumber.parseConstant(els[j]);

  matrices.push(mat);
  step.push(step.last() + 1);

  // remove the input box from the page
  $j(".input-boxes").remove();

  // Add the result to the page

  $j("#main-div").append(
    "<div class='row-op-step' id='out-" + step.last() + "'></div>"
  );

  // Typeset the result
  $j("#out-" + step.last()).html(
    "\\[" + "" + "\\qquad" + decorateMatrix(matrices.last()) + "\\]"
  );
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, "out-" + step.last()]);

  rowOpInput();

  // scroll to the bottom after entering in the input.
  window.scroll(0, document.body.clientHeight);
}

function showLaTeXcode() {
  $j("#latex-modal-body").html(
    "<pre>" + decorateMatrix(matrices[matrices.length - 1]) + "</pre>"
  );
}

function parseRowOp() {
  var rowOp = null;
  try {
    var str = $j("#input-box").val();
    rowOperationStr[rowOperationStr.length] = str;
    rowOp = ElementaryRowOperation.parse(str);

    rowOp.each(function (r) {
      matrices.push(matrices.last().operate(r));
      rowOperation.push(r);
    });
  } catch (er) {
    alert(er);
    rowOperationStr.pop();
    return;
  }

  step.push(step.last() + rowOp.length);

  var rowOpStr = "\\begin{array}{r}";
  rowOp.each(function (r) {
    rowOpStr += r.toLaTeX() + "\\\\";
  });
  rowOpStr += "\\end{array}";

  // remove the input box from the page

  $j("#input-box").parent().remove();

  // Add the result to the page

  $j("#main-div").append(
    "<div class='row-op-step' id='out-" + step.last() + "'></div>"
  );

  // Typeset the result
  $j("#out-" + step.last()).html(
    "\\[" + rowOpStr + "\\qquad" + decorateMatrix(matrices.last()) + "\\]"
  );
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, "out-" + step.last()]);

  rowOpInput();
  // scroll to the bottom after entering in the input.
  window.scroll(0, document.body.clientHeight);
}

function undo(obj) {
  if (step[step.length - 1] == 0) {
    $j("#matrix-entry").val(
      matrices[0].toString().gsub("<br/>", "\n").gsub(",", " ")
    );
    $j("#matrix-div").css("display", "block");
    $j("#output").html("");
    matrices = new Array(0);
    step = new Array(0);
    rowOperation = new Array(0);
    rowOperationStr = new Array(0);
    $j("#matrix-entry").focus();
  } else {
    // Remove the last matrix from the page
    $j(".input-boxes").remove();
    $j("#out-" + step.last()).remove();

    // Remove the last few matrices (if multiple steps) from the matrices array.
    var numsteps = step.last() - step[step.length - 2];
    for (var i = 0; i < numsteps; i++) {
      matrices.pop();
    }
    step.pop();

    // Add another row Operation Input box.
    rowOpInput();

    // Add the last row operation to the string.  Changed to blur, add string, and then refocus or it wasn't working
    $j("#input-box").blur().val(rowOperationStr.pop()).focus();
  }
}

// Called after piv-button is clicked, makes the elements of the currently typeset matrix clickable.
// In addition, hovering an element will give a different cursor and background color.
function clickablePivots() {
  // This sections grabs the current matrix and stores its name and elements
  var newMatrixId = 'out-' + step.last();
  var entries = $j(`#${newMatrixId} .mn`);
  var numRows = matrices[matrices.length - 1].arr.length;
  var index = 0;

  // Assign an index attribute as the (m,n) coordinates of the entry as a string
  // Uses a little math to calculate (m,n) matrix indices, and stores it as an array value in a dictionary, with the MathJax id as the key
  // If its not the original matrix, then slice the piv(x,y) numbers out
  if (newMatrixId != "out-0") entries = entries.slice(2);

  entries
    .each(function () {
      $j(this).attr(
        "index",
        (index % numRows) + 1 + "," + Math.ceil((index + 1) / numRows)
      ); // Create index attribute as "m,n"
      this.on("click", pivotOnClick); // Set onclick
      index++;
    })
    .addClass("pivotable"); // Set pivotable class for highlighting
}

// Called during rowOpInput() to make the previous matrix unclickable
function unclickablePivots() {
  // This sections grabs the current matrix and stores its name and elements
  var matrixID = 'out-' + (step.last()-1);
  var entries = $j("#" + matrixID + " .mn");

  // If its not the original matrix, slice the piv(x,y) numbers
  if (matrixID != "out-0") entries = entries.slice(2);

  // Remove onclick, revert class to mn, unbind hover, restore white background since mouseleave won't do it anymore
  entries
    .each(function () {
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
