var $j = jQuery.noConflict();
var ineqs = new Array();
var axes = null;

$j(document).ready(function() 
    {
        
        $j("#settings").css("display","none");
        $j("#start-button").click(function () { parseInput();} );
	
	axes = new Axes(-10,-10,10,10,$j("#lscanvas")[0]);

        axes.draw();
 
	
    });


function parseInput()
{
    var varx = new Variable("x"); var vary = new Variable("y");
    var input = $j("#inputarea").val().split("\n");
    var givenVars = new Array();
    
    ineqs = new Array(input.length);
    try {
    for(var i = 0; i < input.length;i++)
    {
	ineqs[i]=Inequality.parse(input[i]);
	givenVars[i]=ineqs[i].vars; 
	var d2x = ineqs[i].lhs.differentiate(varx).differentiate(varx);
	var d2y = ineqs[i].lhs.differentiate(vary).differentiate(vary);
	var dxy = ineqs[i].lhs.differentiate(varx).differentiate(vary);
	if (!(d2x.equals(Integer.ZERO)) || !(d2y.equals(Integer.ZERO)) || !(dxy.equals(Integer.ZERO)))
	{ throw "The left hand side of " + input[i] + " is not linear in x and y"};
	
	var dx = ineqs[i].rhs.differentiate(varx);
	var dy = ineqs[i].rhs.differentiate(vary);
	
	
	
	if (!(dx.equals(Integer.ZERO)) || !(dy.equals(Integer.ZERO)))
	{ throw "The right hand side of " + input[i] + " is not a constant"; }
    }
    givenVars.push(["x","y"]);
    givenVars = givenVars.flatten().uniq().findAll(function(s){return ((s[0]!="x")&&(s[0]!="y"));});
    
    
    if (givenVars.length>0)
    {throw "The only allowed variables are x and y";}
    
    } catch (err) { alert(err);}
    
    updatePlot();
    
}

function updatePlot()
{
    var varx = new Variable("x"); var vary = new Variable("y");
    for(var i = 0; i < ineqs.length; i++)
    {
	var a = ineqs[i].lhs.differentiate(varx);
	var b = ineqs[i].lhs.differentiate(vary);
	var c = ineqs[i].rhs;
	
	if (!(a.equals(Integer.ZERO)))
	{
	var x0 = c.toDouble()/a.toDouble();
	var y0 = b.toDouble()/a.toDouble();
	
	}
	
    }
    
    
}