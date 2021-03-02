var storage = $H();

var currentStep = 1;
var inputVisible = false;
var $j = jQuery.noConflict();

var results = new Array();
var matrix_modal; 

const pencil = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">' +
  '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/> ' +
  '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>' +
  '</svg>';
const trashcan = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">' +
   '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
   '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
   '</svg>'

// Run the following code upon loading the document.

$j(document).ready(function()
  {
    if (!('localStorage' in window && window['localStorage'] !== null)){
      alert("You need to update your browser. ");
  }

  $j("#save-matrix-button").click(storeMatrix);
  $j("#clear-matrix-button").click(function (){   
    $j("#matrix-entry").val("").focus();
  });


  var numKeys= localStorage.length;
  for(var i = 0; i < numKeys; i++) {
    var key = localStorage.key(i);
    var match = /matrix\-(\w+)/.exec(key);
    if(match){
      var name = match[1];
      var m = new Matrix(localStorage.getItem(key).replace(/<br\/>/g,";").replace(/,/g," "));
      storage.set(name,m);
    }
  }

  updateMatrices();
  createInputForm();

  // setup the enter matrix modal
   
   matrix_modal = new bootstrap.Modal(document.getElementById('enter-matrix-modal'), {})
});




function storeMatrix() {
  var m;
  try {
    m = new Matrix($j("#matrix-entry").val());
  } catch(err){ alert(err); }

  var str = document.getElementById("matrix-name").value;
  window.localStorage["matrix-" +str]=m;
  storage.set(str,m);

  updateMatrices();
  MathJax.Hub.Queue(["Typeset",MathJax.Hub,"matrices"]);
  matrix_modal.hide();
}




function updateMatrices()
{

   $j("#matrices").html("");

   for(var i = 0; i < storage.keys().length; i++)
   {
      var key = storage.keys()[i];
      var m = storage.get(key);
      var str ="<li class='list-group-item' id='matrix-" + (i) + "'>";
      str += "<table><tr><td rowspan='2'>\\( " + decorateVariable(key) +"=" + (m.toLaTeX()) + " \\)</td>";
      str += "<td><button class='btn btn-small btn-outline-dark edit-matrix' data-matrix='" + (i) +"'>" + pencil + "</button></td></tr>";
      str += "<tr><td><button class='btn btn-small btn-outline-dark delete-matrix' data-matrix='" + (i) +"'>" +trashcan+ " </button></td></tr></table></li>";

      $j("#matrices").append(str);

   }

   $j(".edit-matrix").click(editMatrix);
   $j(".delete-matrix").click(deleteMatrix); 
   MathJax.Hub.Queue(["Typeset",MathJax.Hub,"right"]);
   $j("#input-text").focus();


}

function decorateVariable(variable){
   let var_re = /([a-zA-Z])(\d)/g;
   return variable.replace(var_re, "$1_$2"); 
}


function createInputForm()
{
   var str = "<div class='row md-3 input-boxes'><div class='input-group'> " +
   "<input id='input-text' type='text' class='form-control' placeholder='Matrix Calculation:' aria-label='Enter the Row Operation'> " +
   "<button id='input-enter' class='btn btn-outline-secondary' type='button'>Enter</button></div></div> ";
   
   $j("#left-output").append(str);

   $j("#input-enter").click( function () { 
      parseInput($j("#input-text").val());
   });
   $j("#input-text").keypress(function (e) {
      if (e.keyCode == 13) parseInput($j("#input-text").val());
   });

}

var unary_opers = ["det","inv","rref","I"];
var binary_opers = ["aug"];

var unaryRE = /(\w+)\(([\w\[\]]+)\)/;
var binaryRE = /(\w+)\(([\w\[\]]+),([\w\[\]]+)\)/;
var matOpRE = /^(\[\d+\]|\w+|-?\d+|\(-?\d+\/\d+\))([\+\-\*\^])(\[\d+\]|\w+|\d+)$/

/* this gets the matrix that is either stored as a variable name 
  or as [\d] */
function getMatrix(str) {
   var brackets=/\[(\d+)\]/;
   var m = storage.get(str);
   var br = brackets.exec(str);
   if(m) {
     return {matrix: m, expr: str};
   } else if (br) {
      var i = parseInt(br[1]);
      if (i>=0 && i<= results.length) {
         return {matrix: results[i-1].matrix, expr: "("+results[i-1].expr + ")"};
      } else {
         throw "The equation " + str + " is not defined.";
      }
   } else {
      throw "The argument " + str + " is not defined";
   }
}


/* this is for determinant, inverse, reduced row-echelon form */

function unaryOperator(oper,varName) {
   var matrix, expr
   if(oper !== "I"){
      matrix = getMatrix(varName).matrix;
      expr = getMatrix(varName).expr;
   }
   switch (oper)
   {
   case "det":
      var  res = matrix.det2();
      return {matrix: res, expr: "\\mbox{det}("+expr+")"}; //as_string: "\\[ \\mbox{det}("+varName+")=" + res.value + "\\]"};
   case "inv":
      var res = matrix.invert();
      return {matrix: res, expr: expr + "^{-1}"}; //as_string: "\\[ "+varName+"^{-1}=" + res.toLaTeX() + "\\]"};
   case "rref":
      var res = matrix.rowReduce()
      return {matrix: res, expr: "\\mbox{rref}("+expr+")"} ; //as_string: "\\[ \\mbox{rref}("+varName+")=" + res.toLaTeX() + "\\]"};
   case "I": 
      var n
      try {
         n = parseInt(varName)
      } catch {
        throw "The argument " + varName + " needs to be an integer";
      }
      var res = Matrix.identity(n);
      return {matrix: res, expr: "\\mbox{I}_{"+n+"}"}; //as_string: "\\[ \\mbox{I}_{3}=" + res.toLaTeX() + "\\]"};
   }
}


/* this performs operations like 2*A or A+B */

function matrixOperation(oper,var1,var2) {
   var num1, num2 , mat1, mat2, expr1, expr2;
   var num1_scalar = false;
   var num2_scalar = false; 
   // if the first "variable" is a number
   try {
      num1 = Mnumber.parseConstant(var1);
      num1_scalar = true;
   } 
   catch (err){ // else it is a variable.
      mat1 = getMatrix(var1).matrix;
      expr1 = getMatrix(var1).expr;
   } 
   if (oper=="^" && var2=="T"){ // transpose
      mat1 = getMatrix(var1).matrix;
      expr1 = getMatrix(var1).expr;
      var res = mat1.transpose();
      return {matrix: res , expr: "("+expr1+")^T"}; 
   }

   try {
      num2 = Mnumber.parseConstant(var2);
      num2_scalar = true;
   } catch { // else it is a variable
      mat2 = getMatrix(var2).matrix;
      expr2 = getMatrix(var2).expr;
   } 
   
   switch(oper){
      case "+":
         return {matrix: mat1.plus(mat2) , expr: expr1 + "+" + expr2 }; 
      case "-":
         return {matrix: mat1.minus(mat2) , expr : expr1 + "-" + expr2}; 
      case "*":
         return num1_scalar ?  {matrix: mat2.times(num1), expr: num1 + "\\," + expr2} :  {matrix: mat1.times(mat2), expr: expr1 + "\\," + expr2}
      case "^":
        var pow = parseInt(var2);
        if(isNaN(pow)) {
          throw var2 + " is not an integer";
        }
        return {matrix: mat1.power(pow) , expr: expr1 + "^" + pow}; 
   }
}

function parseInput(str)
{
  var output; 

   try
   {
      if (unaryRE.test(str))
      { 
         var oper = unaryRE.exec(str)[1];
         var arg = unaryRE.exec(str)[2];
         if (!unary_opers.includes(oper)) {
            throw "The operator " + oper + " is not defined.";
         }
         output = unaryOperator(oper,arg);

      } else if (matOpRE.test(str))
      {
         var ops = matOpRE.exec(str);
         output = matrixOperation(ops[2],ops[1],ops[3])
      } else if (binaryRE.test(str)) {
         var ops = binaryRE.exec(str);
         if(! binary_opers.includes(ops[1])){
            throw "The function " + ops[1] + " is not defined."
         }
         switch(ops[1]) {
         case "aug": 
            var mat1 = getMatrix(ops[2]);
            var mat2 = getMatrix(ops[3]);
            var res = mat1.augment(mat2); 
            output = {
               matrix: res, 
               expr : "\\mbox{aug(}" + ops[2] + "," + ops[3] + ")",
               //as_string: "\\[\\mbox{aug(}" + ops[2] + "," + ops[3] + ")=" +res.toLaTeX() + "\\]"
            };
         }
         console.log(ops);
      } else  {
         throw "I don't understand the operation: " + str; 
      }

      results[results.length] = {matrix: output.matrix, expr: output.expr};
      var tableRow = "<tr><td class='lcol'>" + 
         "\\[ " + decorateVariable(output.expr) + "=" + output.matrix.toLaTeX() + "\\]</td><td class='rcol'> ["+ currentStep + "] </td></tr>";
      currentStep++;

      $j("#tab").append(tableRow);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"tab"]);
      $j(".input-boxes").remove();
      createInputForm();
   } catch (er)
   {
      alert(er);
      return;
   }


}

function editMatrix()
{
   var num = $j(this).data("matrix");
   matrix_modal.show();
   var matrixName = storage.keys()[num];
   $j("#matrix-name").val(matrixName);
   $j("#matrix-entry").val(storage.get(matrixName).toPlainText()).focus();
}

function deleteMatrix() {
   console.log("deleting....")
   var num = $j(this).data("matrix");
   var varname = storage.keys()[num];
   localStorage.removeItem(`matrix-${varname}`);
   storage.unset(varname);
   updateMatrices();
}
