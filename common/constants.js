Mnumber.prototype = new Expression();
Mnumber.prototype.constructor = Mnumber;
Mnumber.prototype.toString = function() { return this.value;}
Mnumber.prototype.toLaTeX = function () { return this.value;}
Mnumber.prototype.evaluate = function(x) { throw "evaluate is not defined."}
function Mnumber(str)
{
  this.value = Number(str);
}
Mnumber.prototype.differentiate = function(v) { return new Integer(0);}

Real.prototype = new Mnumber();

Real.parse = function (str)
{
  return new Real(str);
}
Real.prototype.constructor = Real;

function Real(str)
{
  this.value = Number(str);
}

//Real.prototype.toMathML = function () { return <mn>{this.value }</mn>;}

Real.prototype.evaluate = function(x, value)
{
   return this;
}

Real.prototype.evaluateToDouble = function(x, value)
{
   return this.value;
}

// This takes the real (decimal) and converts it to a rational number by
// writing it as divisible by factors of 10. 

Real.prototype.toRational = function ()
{
  var factor = 0.1;
  var num = null;
  do {
    factor *= 10;
    num = Mnumber.parseConstant(Real.multiplyConstants(new Integer(factor),this) + "");
    } while(!(num instanceof Integer));

  return new Rational(num,factor);
}

Real.prototype.simplify = function ()
{
   return this;
}

Real.prototype.equals = function (num2)
{
   return this.value==num2.toDouble();
}


Real.addConstants = function (x,y)
{
  if (x instanceof Integer)
  {
    if (y instanceof Integer)
      return new Integer(x.value+y.value);
    else if (y instanceof Rational)
      return new Rational(x.value*y.bottom+y.top,y.bottom);
    else if (y instanceof Real)
       return new Real(x.value+y.value);
    else
      throw "Not defined for non-rational, non-integer, non-real";
  }  else if (x instanceof Rational)      
  {
    if (y instanceof Integer)
      return new Rational(y.value*x.bottom+x.top,x.bottom);
    else if (y instanceof Rational)
      return new Rational (x.top*y.bottom+x.bottom*y.top,x.bottom*y.bottom);
    else if (y instanceof Real)
       return new Real(1.0*x.top/x.bottom + y.value);
    else
      throw "Not defined for non-rational, non-integer, non-real";
  } else if (x instanceof Real)
  {
if (x instanceof Integer)
      return new Real(x.value + y.value);
    else if (y instanceof Rational)
      return new Rational (x.value + 1.0*y.top/y.bottom);
    else if (y instanceof Real)
       return new Real(x.value + y.value);
    else
      throw "Not defined for non-rational, non-integer, non-real";
     
    
  }
  else 
  if (x instanceof Complex)
  {
      return x.plus(y);
  } else
  
  throw "Not defined for non-rational, non-integer";
  
}


Real.multiplyConstants = function(x,y)
{
  if (x instanceof Integer)
  {
    if (y instanceof Integer)
      return new Integer(x.value*y.value);
    else if (y instanceof Rational)
      return new Rational(x.value*y.top,y.bottom);
    else if (y instanceof Real)
       return new Real(x.value*y.value);
    else
      throw "Not defined for non-rational, non-integer";
  }  else if (x instanceof Rational)
  {
    if (y instanceof Integer)
      return new Rational(y.value*x.top,x.bottom);
    else if (y instanceof Rational)
      return new Rational (x.top*y.top,x.bottom*y.bottom);
    else if (y instanceof Real)
       return new Real(1.0*x.top/x.bottom * y.value);
    else
      throw "Not defined for non-rational, non-integer";
  } else if (x instanceof Real)
  {
    if (y instanceof Integer)
      return new Real(x.value*y.value);
    else if (y instanceof Rational)
      return new Real(x.value*y.top/y.bottom);
    else if (y instanceof Real)
       return new Real(x.value*y.value);
    else
      throw "Not defined for non-rational, non-integer";
  }
  else  
  throw "Not defined for non-rational, non-integer";
  
}

Real.divideConstants = function (top,bottom)
{
   if (top instanceof Integer)
   {
      if (bottom instanceof Integer)
      {
         if (bottom.equals(Integer.ONE))
            return top;
         else if (top.equals(Integer.ZERO))
            return new Integer(0);
         else
            return new Rational(top,bottom);
      } else if (bottom instanceof Rational)
      {
         return new Rational(top.value*bottom.bottom,bottom.top);
      }
      else if (bottom instanceof Real)
      {
         return new Real(top.value/bottom.value);
      }
   } else if (top instanceof Rational)
   {
      if (bottom instanceof Integer)
      {
         return new Rational(top.top,top.bottom*bottom.value);
      }
      else if (bottom instanceof Rational)
      {
         return new Rational(top.top*bottom.bottom,top.bottom*bottom.top);
      }
      else if (bottom instanceof Real)
      {
         return new Real(top.top/(top.bottom*bottom.value));
      }
   }
   else if (top instanceof Real)
   {
      if (bottom instanceof Integer)
      {
         return new Real(top.value/bottom.value);
      }
      else if (bottom instanceof Rational)
      {
         return new Real(top.value*bottom.bottom/bottom.top);
      }
      else if (bottom instanceof Real)
      {
         return new Real(top.value/bottom.value);
      }
   }
   else
      throw "divide not defined for " + top +"/"+ bottom;
}
      
      
           



Integer.prototype = new Real();
Integer.prototype.constructor = Integer;
Integer.prototype.toString = function () {return this.value;}
function Integer(value)
{
  this.value = value;
  
}

//Integer.prototype.toMathML = function () { return <mn>{this.value }</mn>;}


Integer.parse = function (str) 
{ 
  if (str != parseInt(str))
    throw "The number " + str + " is not an integer";
  
  return new Integer(Number(str));
}

Integer.prototype.equals = function(num)
{
  
  if (num instanceof Integer)
    return (this.value == num.value);
  else if (num instanceof Rational)
  {
    return (num.bottom * this.value == num.top);
  }
  else
    return false;
}

Integer.prototype.evaluate = function (x,value)
{
   return this;
}

Integer.prototype.evaluateToDouble = function () { return this.value;}


Integer.prototype.simplify = function () { return this;}

Integer.prototype.toDouble = function () { return this.value;}

Integer.prototype.abs = function () {return new Integer(Math.abs(this.value));}

Integer.GCD = function (a,b)
{
  if (arguments.length==2){
    if(b.equals(Integer.ZERO)){return a;} else {return Integer.GCD(b, new Integer(a.value % b.value));}
  }
  else
  {
    var c,r=a[0].abs();
    for(var i = 1 ; i<a.length;i++)
    {
      r = Integer.GCD(r,a[i].abs());
    }
    return r;
  }
}

Mnumber.prototype.compareTo = function (x)
{
  return this.toDouble() - x.toDouble();
}    

Integer.ZERO = new Integer(0);
Integer.ONE = new Integer(1);

Rational.prototype = new Real();
Rational.prototype.constructor=Rational;
function Rational(top,bottom)
{
  if (top instanceof Integer) 
    this.top = top.value;
  else
    this.top = top;
  if (bottom instanceof Integer)
    this.bottom = bottom.value;
  else
    this.bottom = bottom;
  this.reduce();
  return this.simplify();
  
}
Rational.prototype.toString = function() { return ""+this.top + "/" + this.bottom; }
Rational.prototype.toLaTeX = function() { if (this.top>0) {return "\\frac{"+this.top+"}{"+this.bottom+"}";} else {return "-\\frac{"+(-1*this.top)+"}{"+this.bottom+"}";} } 
Rational.prototype.toDouble = function () { return (1.0*this.top)/this.bottom;}
/*Rational.prototype.toMathML = function() 
{ 
 if (this.top<0)
 return <mrow><mo>-</mo>
  <mfrac><mn>{-this.top}</mn><mn>{this.bottom}</mn></mfrac> </mrow> ;
  else
    return <mfrac> <mn>{this.top}</mn><mn>{this.bottom }</mn></mfrac>;
} */


Rational.prototype.evaluate = function(x,value)
{
   return this.toDouble();
}

Rational.prototype.evaluateToDouble = function () { return (1.0*this.top)/this.bottom;}
Rational.prototype.equals = function(num)
{
  
  if (num instanceof Integer)
  {
    return (num.value*this.bottom == this.top);
  }
  else if (num instanceof Rational)
  {
    return (num.bottom * this.top == num.top * this.bottom);
  } 
  else return false;
}

Rational.parse = function(str) 
{
  if (str.indexOf("/") < 0)
  {
    throw "The rational number " + str + " is not a rational number.";
  }
  
  
  
  try 
  {
    var pos = str.indexOf("/");
    
    var top = Integer.parse(str.substring(0,pos));
    var bottom = Integer.parse(str.substring(pos+1));
    
    return new Rational(top.value,bottom.value);
    
  }  catch (e)
  {
    throw "The rational number " + str + " is not a rational number.";
  }
  
  
  
}

Rational.prototype.simplify = function ()
{
  if (this.bottom == 1)
    return new Integer(this.top);
  
  else if (this.top == 0)
    return new Integer(0);
  else
    return this;
  
}


Rational.prototype.reduce = function ()
{
  var sign = 1; 
  if (this.top < 0) { sign*=-1; this.top *=-1;}
  if (this.bottom<0) { sign*=-1; this.bottom *=-1;}
  
  var topFactors = Integer.factorInteger(this.top);
  var bottomFactors = Integer.factorInteger(this.bottom);
  
  
  var newTop=1, newBottom=1;
  
  while(topFactors.length>0)
  {
    var i = topFactors.pop();
    var pos = bottomFactors.indexOf(i);
    if(pos<0)
    {
      newTop *= i;
    } else // remove the element from position pos
    {
      var tmp = new Array();
      for(j = 0; j < pos; j++)
        tmp[j] = bottomFactors[j];
      for(j = pos+1; j< bottomFactors.length; j++)
        tmp[j-1] = bottomFactors[j];
      bottomFactors = tmp;
    }
    
  }
  
  for(j = 0 ; j < bottomFactors.length; j++)
  {
    newBottom *= bottomFactors[j];
  }
  this.top = newTop*sign;  this.bottom = newBottom;
}


Integer.factorInteger = function(number)
{
  var q; 
  if (number instanceof Integer)
    q = number.value;
  else
    q = number;
  
  var factors = new Array();
  if ((q==0) || (q==1))
  {
    factors[0]=q;
    return factors;
  }
  
  factors[0] = 1
  
  var i = 2;
  while (i <= q)
  {
    if(q%i == 0)
    {
      q/=i;
      factors.push(i);
    }
    else
    {
      i++;
    }
  }
  return factors;
}

/* This function parses a string and returns a real constant, 
integer constant or rational constant */

var ratstr = "^(-?\\d+)\\/(\\d+)$"; var ratRe = new RegExp(ratstr);
var intstr = "^-?\\d+$"; var intRe = new RegExp(intstr);
var realstr = "^-?\\d*\\.\\d*$"; var realRe = new RegExp(realstr);
var anyNumberstr = "("+ratstr+"|" +intstr + "|" + realstr +")";
var complexstr = "((.*)?([+-]))?(.*)?i"
var complexRe = new RegExp(complexstr);



Mnumber.parseConstant = function(str)
{
  if (complexRe.test(str))
    return Complex.parse(str);
  else if (ratRe.test(str))
  {
    var arr = ratRe.exec(str);
    return new Rational(arr[1],arr[2]);
  }
  else if (intRe.test(str))
    return Integer.parse(str);
  else if (realRe.test(str))
    return Real.parse(str);
  else if (complexRe.test(str));
  return Complex.parse(str);
  throw str +" does not parse to a constant.";
  
  
}


// Complex numbers

Complex.prototype = new Expression()
Complex.prototype.constructor = Complex;

function Complex(x,y)
{
  if (x instanceof Number)
    this.x = Mnumber.parseConstant(x);
  else 
    this.x = x;
  
  if (y instanceof Number)
    this.y = Mnumber.parseConstant(y);
  else
    this.y = y;
}

Complex.prototype.toString = function ()
{
  return "(" + this.x.toString() + "+" + this.y.toString() + "i)";
}


Complex.prototype.simplify = function ()
{
  if (this.y.equals(Integer.ZERO))
    return this.x;
  else
  {
    this.y = this.y.simplify();
    this.x = this.x.simplify();
  
    return this;
  }
}

Complex.parse = function (str)
{
  var ops = complexRe.exec(str);
  if (ops[1] !=undefined)
  {  
    if (ops[2] == undefined)
      var x = new Integer(0);
    else
      var x = Mnumber.parseConstant(ops[2]);
    var y = (ops[3] == "-")? Mnumber.parseConstant("-"+ops[4]):Mnumber.parseConstant(ops[4]);
    return new Complex(x,y);
  }
  
  else
  {
    var x = new Integer(0);
    var y = y = Mnumber.parseConstant(ops[4]);
    return new Complex(x,y);

  }
}



// For the following, assume arguments are objects, not numbers


Complex.prototype.plus = function(pt2)
{ 
  if (pt2 instanceof Complex)
    return new Complex(new Add(this.x,pt2.x),new Add(this.y,pt2.y));
  else if (pt2 instanceof Real)
    return this.plus(new Complex(pt2,Integer.ZERO))
}

Complex.prototype.minus = function(pt2)
{
  if(pt2 instanceof Complex)
    return new Complex(new Subtract(this.x ,pt2.x),new Subtract(this.y,pt2.y));
  else if (pt2 instanceof Real)
    return this.minus(new Complex(pt2,Integer.ZERO));
}

Complex.prototype.times = function(pt2)
{
  if (pt2 instanceof Complex)
  return new Complex(new Subtract(new Multiply(this.x,pt2.x),new Multiply(this.y,pt2.y)), 
    new Add(new Multiply(this.x,pt2.y), new Multiply(this.y,pt2.x)));
  else if (pt2 instanceof Real)
    return this.times(new Complex(pt2,Integer.ZERO));
}

Complex.prototype.divide = function(pt2)
{
  throw "Doesn't Support divide!!";
  if (pt2 instanceof Complex)
  {
    var z = pt2.x*pt2.x + pt2.y*pt2.y;
    
    return this.times( new Complex(1/z,0)).times(pt2.conjugate());
  } else if (pt2 instanceof Real)
  {}
  
}

Complex.prototype.conjugate = function()
{
    return new Complex(this.x, new Multiply(new Integer(-1),this.y));
}

Complex.prototype.power = function(n)
{
   throw "power needs to be updated";
  
  var r = Math.sqrt(this.x*this.x+this.y*this.y);
    
    var theta = Math.atan(this.y/this.x);
    
    if (this.x<0) { theta += Math.PI}; 
    
    var rn = Math.pow(r,n);
    
    return new Complex(rn*Math.cos(n*theta),rn*Math.sin(n*theta));
 
}

Complex.prototype.abs = function()
{
    return new Sqrt(new Add(new Multiply(this.x,this.x),new Multiply(this.y,this.y)));
}


Complex.prototype.equals = function(num)
{
  if (num instanceof Complex)
    return (this.x.equals(num.x) && this.y.equals(num.y));
  else if (num instanceof Integer)
    return (this.x.equals(num) && this.y.equals(Integer.ZERO));
  else if (num instanceof Rational)
    return ((new Multiply(this.x,new Integer(num.bottom))).equals(new Integer(num.top)) 
        && (this.y.equals(Integer.ZERO)));
  else
    return false;
}

Complex.realPart = function(expr)
{
   
   
}

Complex.isComplex = function(c)
{
   return ((c instanceof Complex) && (!(c.y.equals(Integer.ZERO))));
}


SymbolicConstant.prototype = new Expression();
SymbolicConstant.prototype.constructor = SymbolicConstant;
SymbolicConstant.prototype.simplify = function () { return this;}
function SymbolicConstant() {}



MconstantPI.prototype = new SymbolicConstant();
MconstantPI.prototype.constructor = MconstantPI;
MconstantPI.prototype.toString = function() { return "pi";}
MconstantPI.prototype.evaluate = function(x,value) { return Math.PI;}
function MconstantPI() {}

MsymbE.prototype = new SymbolicConstant();
MsymbE.prototype.constructor = MsymbE;
MsymbE.prototype.toString = function() { return "e";}
MsymbE.prototype.evaluate = function(x,value) { return Math.exp(1);}
function MsymbE() {}

