/*  Some of these methods use functions defined in prototype.js, so that must be included in any script using this. */

function Inequality(){}
function Inequality(lhs,rhs,ineq,vars)
{
    this.lhs = lhs;
    this.rhs = rhs;
    this.ineq = ineq;
    this.vars = vars; 
}

Inequality.prototype.constructor = Inequality;
Inequality.prototype.toString = function() { return "var: " + this.name;}

Inequality.prototype.toLaTeX = function () { return this.lhs.toLaTeX() + " "+ this.ineq.toLaTeX() + " "+ this.rhs.toLaTeX();}

Inequality.parse = function (str)
{
  var sides = /(.*)([<>]=?)(.*)/.exec(str);
  var lhs = Expression.parse(sides[1]);
  var rhs = Expression.parse(sides[3]);
  var vars = [lhs.vars,rhs.vars].flatten().uniq();
  return new Inequality(lhs.express,rhs.express,InequalitySign.parse(sides[2]),vars);
}

function InequalitySign() {}
InequalitySign.parse = function (str)
{
    if (str=="<") {return new LessThan();}
    else if (str=="<=") {return new LessThanEqual();}
    else if (str==">") {return new GreaterThan();}
    else if (str==">=") {return new GreaterThanEqual();}
    else throw ("The symbol '"+str+"' is not an inequality.");
}

LessThan.prototype = new InequalitySign();
LessThan.prototype.constructor = LessThan;
function LessThan() {}
LessThan.prototype.toString = function () { return "<";}
LessThan.prototype.toLaTeX = function () { return "<";}

LessThanEqual.prototype = new InequalitySign();
LessThanEqual.prototype.constructor = LessThanEqual;
function LessThanEqual() {}
LessThanEqual.prototype.toString = function () { return "<=";}
LessThanEqual.prototype.toLaTeX = function () { return "\leq";}


GreaterThan.prototype = new InequalitySign();
GreaterThan.prototype.constructor = GreaterThan;
function GreaterThan() {}
GreaterThan.prototype.toString = function () { return ">";}
GreaterThan.prototype.toLaTeX = function () { return ">";}

GreaterThanEqual.prototype = new InequalitySign();
GreaterThanEqual.prototype.constructor = GreaterThanEqual;
function GreaterThanEqual() {}
GreaterThanEqual.prototype.toString = function () { return ">=";}
GreaterThanEqual.prototype.toLaTeX = function () { return "\geq";}

