/*  Some of these methods use functions defined in prototype.js, so that must be included in any script using this. */

function Equation(){}

function Equation(lhs,rhs,vars) {this.lhs=lhs; this.rhs = rhs; this.vars=vars;}

Equation.prototype.isLinear = function()
{
    for(var i = 0; i<vars.length; i++)
    {
        for(var j = 0; j< vars.length; j++)
        {
            
        }
    }
    var d2x = ineqs[i].lhs.differentiate(varx).differentiate(varx);
    var d2y = ineqs[i].lhs.differentiate(vary).differentiate(vary);
    var dxy = ineqs[i].lhs.differentiate(varx).differentiate(vary);
	
}
