var storage = $H();

var currentStep = 1;
var inputVisible = false;
var $j = jQuery.noConflict();

var results = new Array();

// Run the following code upon loading the document.

$j(document).ready(function()
    {

      if (!('localStorage' in window && window['localStorage'] !== null))
        {alert("You need to update your browser. ");}

        $j("#settings").css("display","none");
	$j("#set-link").click(function() {$j("#settings").show("blind",null,"normal",null); return false;});
        $j("#help-link").click(function() {$j("#help").show("blind",null,"normal",null); return false;});
	$j("#enter-matrix-button").click( function() {$j("#matrix-input").show();});
        $j("#store-matrix-button").click( function() { storeMatrix();});
        $j("#clear-matrix-button").click(function (){   $j("#matrix-entry").val("");});

        var numKeys= localStorage.length;
        for(var i = 0; i < numKeys; i++)
        {
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
    });




function storeMatrix()
{
   var m;
   try {
      m = new Matrix($j("#matrix-entry").val().replace(/\n/g,";").replace(/;*$/,""));

   } catch(err)
   {
      alert(err);
   }

    var str = document.getElementById("matrix-name").value;
    window.localStorage["matrix-" +str]=m;
    storage.set(str,m);

    updateMatrices();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"matrices"]);
    $j("#matrix-input").hide();


}




function updateMatrices()
{

   $j("#matrices").html("");

   for(var i = 0; i < storage.keys().length; i++)
   {
      var key = storage.keys()[i];
      var m = storage.get(key);
      var str ="<div id='matrix-" + (i) + "'><table><tr><td rowspan='2'>";
      str += "\\( " + key +"=" + (m.toLaTeX()) + " \\)</td>";
      str += "<td><button id='edit-matrix-button-" + (i) +"'>Edit</button></td></tr>";
      str += "<tr><td><button id='delete-matrix-button-" + (i) +"'>Delete</button></td></tr></table></div>";

      $j("#matrices").append(str);


      // Need to define what happens on button clicks here.

      $j("#edit-matrix-button-"+i).click( function() {editMatrix(Number(this.id.split("-")[3]));
      });

      $j("#delete-matrix-button-"+i).click( function() {
         var j = Number(this.id.split("-")[3]);
         var varname = storage.keys()[j];
         localStorage.removeItem(varname);
         storage.unset(varname);
         updateMatrices();

         });
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"right"]);

   }




}


function createInputForm()
{
   $j("#left-output").append("<div id='input-box'>Input:<input id='input-text' type='text' size='30'/><button id='input-enter'>Enter</button></div>")

   $j("#input-enter").click( function () { parseInput($j("#input-text").val());});
   $j("#input-text").keypress(function (e) {if (e.keyCode == 13) parseInput($j("#input-text").val());});

}

var detRE = /(det|inv|rowreduce)\((\w+)\)/;
var matOpRE = /(\[\d+\]|\w+|-?\d+|\(-?\d+\/\d+\))([\+\-\*\^])(\[\d+\]|\w+|\d+)/

 function parseInput(str)
{
   var outputStr="";

   try
   {
      var scalarMult;

      if (detRE.test(str))
      {
         var opName = detRE.exec(str)[1];
         var varName = detRE.exec(str)[2];
         var m = storage.get(varName);
         var matty = null;

         switch (opName)
         {
         case "det":
	    matty=m.det2();
            outputStr = "\\[ \\mbox{det}("+varName+")=" + matty.toLaTeX() + "\\]";
            break;
         case "inv":
	  matty=m.invert();
            outputStr = "\\[ " + varName +"^{-1}="+ (matty.toLaTeX()) + "\\]";
            break;
         case "rowreduce":
	    matty=m.rowReduce();
            outputStr = "\\[ \\mbox{rowReduce}("+varName+")=" + matty.toLaTeX() + "\\]";
            break;
         }
         results[results.length]=matty;

      } else if (matOpRE.test(str))
      {
         var ops = matOpRE.exec(str);
         var var1 = ops[1];
         var m1 = null;
         var num1 = null;
	 var brackets=/\[(\d+)\]/;

	 var br1=brackets.exec(ops[1]);
	 var br2=brackets.exec(ops[3]);

         try {
            num1 = Mnumber.parseConstant(var1);
            scalarMult = true;
         }
         catch (err)
         {
	  if(brackets.exec(ops[1]) != null)
	  {
	    var i = parseInt(brackets.exec(ops[1])[1]);
	    m1 = results[i-1];
	  } else {

            m1 = storage.get(var1);

            if (m1 == null)
               alert("Matrix " + var1 + " is not defined.");

            scalarMult = false;

	  }
         }

         var operation = ops[2];

         var var2 = ops[3];
	 var m2 = null;
	 if(brackets.exec(ops[3]) != null)
	  {
	    var i = parseInt(brackets.exec(ops[3])[1]);
	    m2 = results[i-1];
	  } else {
	    m2 = storage.get(var2);
	    if ((/\[a-zA-Z]+/.test(var2)) && (m2 == null))
	       alert("Matrix " + var2 + " is not defined.");
	  }



         var result, opout;
         var matty;

         switch(operation)
         {
         case "+":
	    matty = m1.plus(m2);
            outputStr = "\\[" + var1 + "+" + var2 + "=" + (matty.toLaTeX()) + "\\]";
            break;
         case "-":
	    matty = m1.minus(m2);
            outputStr = "\\[" + var1 + "-" + var2 + "=" + (matty.toLaTeX()) + "\\]";
            break;
         case "*":
            if (scalarMult)
	    {
	       matty = m2.times(num1);
               outputStr = "\\[" + (num1.toLaTeX()) + var2 + "=" + (matty.toLaTeX()) + "\\]";
	    }
            else
	    {
	       matty = m1.times(m2);
               outputStr = "\\[" + var1 + var2 + "=" + (matty.toLaTeX()) + "\\]";
	    }
            break;
         case "^":
            var pow = parseInt(var2);
            if(isNaN(pow))
               throw var2 + " is not an integer";
            else
	    {
	      matty = m1.power(pow);
               outputStr = "\\[" + var1 + "^{"+pow +"}=" + (matty.toLaTeX()) + "\\]";
	    }
         }
         results[results.length]=matty;
      }else
      {
      alert("Error in input");
      return;
      }
      var tableRow = "<tr><td class='lcol'>" + outputStr + "</td><td class='rcol'> ["+ currentStep + "] </td></tr>";
      currentStep++;

      $j("#tab").append(tableRow);
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"tab"]);
      $j("#input-box").remove();
      createInputForm();
   } catch (er)
   {
      alert(er);
      return;
   }


}

function editMatrix(num)
{
   $j("#matrix-input").show();
   var matrixName = storage.keys()[num];
   $j("#matrix-name").val(matrixName);
   $j("#matrix-entry").val(storage.get(matrixName).toPlainText());
}
