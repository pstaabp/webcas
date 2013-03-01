var matrices = new Array(0);
var step = new Array(0);
var rowOperation = new Array(0);  // this will store the internal object version of the row operation
var rowOperationStr = new Array(0);
var settings = null;
var $j = jQuery.noConflict();    

// Run the following code upon loading the document.

$j(document).ready(function() 
    {
	step[0]=0;
              
        $j("#settings").css("display","none");
        $j("#clear-matrix-button").click(function () { $j("#matrix-entry").val('');} ); 
        $j("#store-matrix-button").click(function () { storeMatrix();} ); 
        $j("#restart-button").click(function () { restart();} ); 
      	$j("#set-link").click(function() {$j("#settings").show("blind",null,"normal",null); return false;});
        $j("#help-link").click(function() {$j("#help").show("blind",null,"normal",null); return false;});
	
	// Manage the settings.  Lookup if they have been stored, if not create new settings.  
	
	if (!('localStorage' in window && window['localStorage'] !== null) || (localStorage.getItem("GEset")==null) ){
    settings = {simplexMode: false, vertLine: false, horizLine: false, slackLine: "none", 
                firstColLine: false, addRow: false, showLaTeX: false};	    
	} else	{
	    settings = JSON.parse(localStorage.getItem("GEset"));
      $j("#simplexMode").attr("checked",settings.simplexMode);
	    $j("#vertLine").attr("checked",settings.vertLine);
	    $j("#horizLine").attr("checked",settings.horizLine);
	    $j("#numSlackVars").attr("disabled",true);
	    if (settings["slackLine"]=="none") {$j("#slackLine[value='none']").attr("checked","checked");}
	    else if (settings["slackLine"]=="std") {$j("#slackLine[value='std']").attr("checked","checked");}
	    else if (parseInt(settings["slackLine"])>-1){
    		$j("#numSlackVars").attr("disabled",false);
    		$j("#numSlackVars").val(settings["slackLine"]);
    		$j("#slackLine[value='custom']").attr("checked","checked");
	    }
	    $j("#firstColLine").attr("checked",settings.firstColLine);
	    $j("#addRow").attr("checked",settings.addRow);
	    $j("#showLaTeX").attr("checked",settings.showLaTeX);
	    
	}
	
	$j("input:checkbox").change(function()
				    {settings[this.id]=$j("#"+this.id).is(':checked');
				    localStorage.setItem("GEset",JSON.stringify(settings));});
	$j("input:radio, #numSlackVars").change(function(){
	    $j("#numSlackVars").attr("disabled",true);
	    if ($j("input[name='slackLine']:checked").val() == 'none') {settings["slackLine"]="none";}
	    else if ($j("input[name='slackLine']:checked").val() == 'std') {settings["slackLine"]="std";}
	    else if ($j("input[name='slackLine']:checked").val() == 'custom')
	    {
		$j("#numSlackVars").attr("disabled",false);
		settings["slackLine"]=$j("#numSlackVars").val();
		}
	    localStorage.setItem("GEset",JSON.stringify(settings));});
    });
	
	



function restart()
{

    $j("#output").html("");
    $j("#matrix-div").css("display","block");
    $j("#matrix-entry").val(matrices[0].toString().gsub('<br/>',"\n").gsub(","," "));
    step = [0];
    matrices = [];
}


/* Take the original matrix input in a text area as rows of numbers,
  store the matrix as an object and give the user a textbox for row operation input.
*/

function storeMatrix()
{
    
    try {
        matrices[0] = new Matrix($j("#matrix-entry").val().replace(/\n/g,";").replace(/;*$/,""));
    } catch(err) { alert(err); return;}
    
    var convertToRational = false; 
    
    if(matrices[0].isDecimal()){
      convertToRational = confirm("Your matrix contains decimals and often it's difficult to work with matrices of decimals. "
          + "  Would you like to convert the decimals to rationals?");
    }
    
    if(convertToRational){matrices[0] = matrices[0].toRational();}

    if(settings.simplexMode){matrices[0].SMMultiplier = new Integer(1);}

    
    $j("#output").append("<div id='orig-matrix'> \\[" + decorateMatrix(matrices[0]) + "\\] </div>");
    $j("#matrix-div").css("display","none");
    rowOpInput();
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"orig-matrix"]);
    
}

function decorateMatrix(m)
{
 var mstr = m.toLaTeX();
    
        
    // This decorates the matrix if the user requests it
    if(settings.slackLine != "none")
    {
	var n = 0; 
	if (settings.slackLine == "std"){
	    n = m.arr[0].length - m.arr.length-1; // get the number of regular variables.
	} else if (parseInt(settings.slackLine)>-1) {
	    n = m.arr[0].length - parseInt(settings.slackLine)-2;
	}
	if(n>0){
	    var re = new RegExp("\{(r{"+n+"})(.*)\}");
	    mstr = mstr.replace(re,"{$1|$2}");
	}
    }
    
    if(settings.vertLine){ mstr=mstr.replace(/\{(.*)r\}/,"{$1|r}");}
    if(settings.firstColLine){ mstr=mstr.replace(/\{r(.*)\}/,"{r|$1}");}
    if(settings.horizLine){
	var strarr=mstr.split("\\\\"); mstr="";
	var n = strarr.length; 
	for(var i=0; i<n-3;i++){mstr+=strarr[i] + "\\\\";} mstr+= strarr[n-3]+"\\\\ \\hline";
	mstr+=strarr[n-2]+"\\\\" + strarr[n-1]; 
	}
	
    return mstr; 
   
}


function rowOpInput()
{
    var str = "<div id='row-op-input'>input: <input id='input-box' type='text' size='30'></input>" + 
        "<button id='enter-button'>Enter</button>" + 
        " <button id='undo-button'>Undo</button>";
    if(settings.showLaTeX){str += "<button id='LaTeX-button'>Show LaTeX</button>"; }
    if(settings.addRow){str += "<button id='addRow-button'>Add Row/Col to Tableau</button>"; }
    str+= "</div>";

    $j("#output").append(str);    
    $j("#input-box").keypress(function (e) {if (e.keyCode == 13) parseRowOp();});
    $j("#enter-button").click(function () { parseRowOp();});
    $j("#undo-button").click(function () { undo();});
    $j("#LaTeX-button").click(function() {showLaTeXcode();});
    $j("#addRow-button").click(function() {addRowToTableau();});
 	
    
    
    
}

function addRowToTableau()
{
    var els = $j("#input-box").val().trim().split(/\s+/);
    
    var lastMat = matrices.last();
    
    var n = lastMat.arr.length;
    var m = lastMat.arr[n-1].length;
    
    if (els.length != m+1){ alert("The new row in the input box does not contain the same number of elements as the new tableau."); return;}
    
    var mat = new Matrix(n+1,m+1);
    for(var i = 0; i < n-1; i++)
    {
	for(var j = 0; j < m-2; j++)
	{
	    mat.arr[i][j]=lastMat.arr[i][j];
	}
    }
    for(var i = 0; i < n-1; i++)
    {
	mat.arr[i][m]=lastMat.arr[i][m-2];
	mat.arr[i][m]=lastMat.arr[i][m-1];
    }
    for(var j = 0; j < m-2; j++){ mat.arr[n][j]=lastMat.arr[n-1][j];}
    mat.arr[n][m-1]=lastMat.arr[n-1][m-2];
    mat.arr[n][m]=lastMat.arr[n-1][m-1];
    
    for(var j = 0; j <m+1;j++)
    {
	mat.arr[n-1][j]=Mnumber.parseConstant(els[j]);
    }
    
    matrices.push(mat);
    step.push(step.last()+1);
    
         // remove the input box from the page
     
      $j("#input-box").parent().remove();
     
     // Add the result to the page
     
     $j("#output").append("<div id='out-" + (step.last()) + "'></div>");
     
     // Typeset the result
     $j("#out-"+(step.last())).html("\\["+"" + "\\qquad" + decorateMatrix(matrices.last()) + "\\]");
     MathJax.Hub.Queue(["Typeset",MathJax.Hub,"out-" + (step.last())]);
     
     rowOpInput();
     
     // scroll to the bottom after entering in the input.  
     window.scroll(0,document.body.clientHeight);

}    


function showLaTeXcode()
{
       $j('<div id="dialog"></div>')
		.html('<pre>' + decorateMatrix(matrices[matrices.length-1]) + '</pre>')
		.dialog({
			autoOpen: true,
			title: 'LaTeX Code',
			width: 500
		});
    //document.getElementById("latexoutput").value = matrices[step.length-1].toLaTeX();
}


function parseRowOp()
{
    var rowOp = null;
    try
    {
        var str = $j("#input-box").val();
        rowOperationStr[rowOperationStr.length]=str;
        rowOp = ElementaryRowOperation.parse(str);
                

    rowOp.each(function(r){
        matrices.push(matrices.last().operate(r));;
        rowOperation.push(r);});
    } catch (er) {alert(er); return; }
    
    step.push(step.last()+rowOp.length);
     
     var rowOpStr = "\\begin{array}{r}";
     rowOp.each(function(r){ rowOpStr += r.toLaTeX() + "\\\\"; });
     rowOpStr += "\\end{array}";
         
     
     // remove the input box from the page
     
      $j("#input-box").parent().remove();
     
     // Add the result to the page
     
     $j("#output").append("<div id='out-" + (step.last()) + "'></div>");
     
     // Typeset the result
     $j("#out-"+(step.last())).html("\\["+rowOpStr + "\\qquad" + decorateMatrix(matrices.last()) + "\\]");
     MathJax.Hub.Queue(["Typeset",MathJax.Hub,"out-" + (step.last())]);
     
     rowOpInput();
     
     // scroll to the bottom after entering in the input.  
     window.scroll(0,document.body.clientHeight);
    
} 


function undo(obj)
{

        
    if(step[step.length-1]==0)
    {
        $j("#matrix-entry").val(matrices[0].toString().gsub('<br/>',"\n").gsub(","," "));
        $j("#matrix-div").css("display","block");
        $j("#output").html("");
        matrices=new Array(0);
        step = new Array(0);
        rowOperation = new Array(0);  
        rowOperationStr = new Array(0);

        
    }
    else
    {
	// Remove the last matrix from the page
        $j('#row-op-input').remove();
        $j('#out-'+step.last()).remove();
	
	// Remove the last few matrices (if multiple steps) from the matrices array.
        var numsteps = step.last() - step[step.length-2];
        for(var i = 0; i < numsteps; i++) {matrices.pop();}
        step.pop();
	
	// Add another row Operation Input box.
        rowOpInput();
	
	// Add the last row operation to the string.  
        $j(".input-box").val(rowOperationStr.pop());
    }
    
    
}



