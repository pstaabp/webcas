Funct.prototype.toString = function () { return this.expr.toString();}
Funct.prototype.evaluateToDouble = function (x,value) {return this.expr.evaluateToDouble(x,value); } 

function Funct(str,variab)
{
    this.variables = new Array();
    for(var i = 1; i < arguments.length; i++)
    {
       this.variables[i-1] = new Variable(arguments[i]);
    }
    this.strValue = str;
    this.variab = new Variable(variab);
    this.expr = Expression.parse(str,variab);
}

Funct.prototype.differentiate = function (varx) { return this.expr.differentiate(varx);}

Expression.prototype.evaluateToDouble = function (x) { return null;}
function Expression()
{
    this.expr;
}

Expression.equals = function (x) { return false;}
Expression.prototype.differentiate = function (v) { throw "differentiate not defined";}
Expression.prototype.simplify = function () { throw "simplify not defined";}

Variable.prototype = new Expression();
Variable.prototype.equals = function  (x) 
{
    if (! (x instanceof Variable))
        return false;
    else
        return (this.name == x.name);
}

Variable.prototype.constructor = Variable;
Variable.prototype.toString = function() { return "var: " + this.name;}

Variable.prototype.toLaTeX = function () { return this.name;}

/* This evaluates the Variable, x for the value: val */

Variable.prototype.evaluate =  function (x,val)
{
    if (x.name == this.name)
    {
        return val;
    } else { return this;}
}


Variable.prototype.evaluateToDouble =  function (x,value) { return value;}
function Variable(str)
{
    this.name=str;
}
Variable.prototype.differentiate = function(v)
{
    if (v.name == this.name)
        return new Integer(1);
    else
        return new Integer(0);
}

Variable.prototype.simplify = function () { return this;}




Add.prototype = new Expression();
Add.prototype.constructor = Add;

function Add()
{
    if ((arguments.length ==1) && (arguments[0] instanceof Array))
    {
        this.operands = new Array();
        for(var i = 0; i< arguments[0].length; i++)
            this.operands[i] = arguments[0][i];
    }
    else
    {
        this.operands = new Array(arguments.length);
        for(var i = 0; i < arguments.length; i++)
            this.operands[i] = arguments[i];
    }
    
    return this.simplify();
}

Add.prototype.evaluate = function(x,value)
{
   var ops = new Array();
   for(var i = 0; i < this.operands.length; i++)
      ops.push(this.operands[i].evaluate(x,value));
   return new Add(ops);
}

Add.prototype.evaluateToDouble = function(x,value) 
{
    var sum = 0;
    for(var i = 0; i < this.operands.length; i++)
        sum += this.operands[i].evaluateToDouble(x,value);
    
    return sum;
}

Add.prototype.toString = function() 
{
    var str = "add(";
    for(var i = 0; i < this.operands.length-1; i++)
        str += this.operands[i].toString() + ",";
    
    return str + this.operands[this.operands.length-1].toString() + ")";
}

Add.prototype.toLaTeX = function() 
{ 
    var str = "";
    for(var i = 0; i < this.operands.length-1; i++)
        str += this.operands[i].toLaTeX() +"+";
    str += this.operands[this.operands.length-1].toLaTeX();
    
    return str;
}


Add.prototype.differentiate = function(v)
{
    var newOps = new Array();
    
    for(var i = 0; i < this.operands.length; i++)
        newOps[i] = this.operands[i].differentiate(v);
    
    return new Add(newOps);
}


// This function takes objects of the type Add(1,1,1,x,x) and returns Add(3,2*x);



Add.shrinkOperands  = function (ops)
{
  var newOps = new Array();
    
    for(var pos = 0; pos < ops.length; pos++)
    {
        if (ops[pos] instanceof Mnumber)
        {
            var num = ops[pos];
            var tmp = 1;
            while (ops[pos+tmp] instanceof Mnumber)
            {
                num = Real.addConstants(num,ops[pos+tmp]);
                tmp++;
            }
            num = num.simplify();
            if (!num.equals(new Integer(0)))
                newOps.push(num);
            
            pos += tmp-1;
        } else if (ops[pos] instanceof Variable)
        {
            var tmp = 1; 
            while(ops[pos].equals(ops[pos+tmp]))
            {
                tmp++;
            }
            
            newOps.push(new Multiply(ops[pos],new Integer(tmp)));
            pos += tmp-1;
            
        } else if (ops[pos] instanceof Complex)
        {
           var tmp = 1;
           var op = ops[pos]
           while (ops[pos+tmp] instanceof Complex)
           {
              op = op.plus(ops[pos+tmp]);
              tmp++;
           }
           
           newOps.push(op);
           
        } else
        {
            newOps.push(ops[pos].simplify());
         }
    }

    return newOps;
}
    
Add.prototype.simplify = function ()
{
    if (this.operands.length == 0)
        return new Integer(0);
    else if (this.operands.length == 1)
        return this.operands[0];
     
    var newOps = Add.flatten(this.operands);
    this.operands = sortOperands(newOps);
   
    this.operands =  Add.shrinkOperands(this.operands);
    
    var complexArgs = false;
    for(var i= 0; i < this.operands.length; i++)
    {
       if (this.operands[i] instanceof Complex)
       {
          complexArgs = true;
          break;
       }
    }
    
    // If any of the arguments are complex, make everything a complex
    // 
    
    if (complexArgs)
    {
       var op = new Complex(Integer.ZERO, Integer.ZERO);
       for(var i=0; i < this.operands.length; i++)
          op = op.plus(this.operands[i])
          
       return op;
    }

    // Try to simplify once more    
       
    if (this.operands.length == 0)
        return new Integer(0);
    else if (this.operands.length == 1)
        return this.operands[0]
    else
        return this; 
    
}

Add.flatten = function (operands)
{
    var newOps = new Array();
    
    for(var i = 0; i < operands.length; i++)
    {
        if(operands[i] instanceof Add)
        {
            var ops = Add.flatten(operands[i].operands);
            for(j=0; j < ops.length; j++)
                newOps.push(ops[j]);
        }
        else  
            newOps.push(operands[i]);
    }
    
    return newOps;
}

Add.prototype.equals = function (x)
{
    if (!(x instanceof Add))
        return false;
    else
        return ((this.oper1.equals(x.oper1))&&(this.oper2.equals(x.oper2)));
}

Subtract.prototype = new Expression();
Subtract.prototype.constructor = Subtract;


function Subtract(oper1,oper2)
{
    return new Add(oper1,new Multiply(new Integer(-1),oper2));
}

Multiply.prototype = new Expression();
Multiply.prototype.constructor = Multiply;
function Multiply()
{
    if ((arguments.length == 1) && (arguments[0] instanceof Array))
    {
        this.operands = new Array(arguments[0].length);
        for(var i = 0; i < arguments[0].length; i++)
            this.operands[i] = arguments[0][i];
    }
    else if (arguments.length == 0)
    {
        this.operands = new Array();
        return this;
    }
    else 
    {
        this.operands = new Array(arguments.length);
        for(var i = 0; i < arguments.length; i++)
            this.operands[i] = arguments[i];
    }
    return this.simplify();   
}

Multiply.prototype.evaluate = function(x,value)
{
   var ops = new Array();
   for(var i = 0; i < this.operands.length; i++)
      ops.push(this.operands[i].evaluate(x,value));
   return new Multiply(ops);
}
Multiply.prototype.evaluateToDouble = function(x,value) 
{
    var prod = 1; 
    for(var i = 0; i < this.operands.length; i++)
        prod *= this.operands[i].evaluateToDouble(x,value);
    
    return prod;
}

Multiply.prototype.toString = function() 
{ 
    var str = "mult(";
    for(var i = 0; i < this.operands.length-1; i++)
        str += this.operands[i].toString() +",";
    str += this.operands[this.operands.length-1] + ")";
    
    return str;
}
Multiply.prototype.toLaTeX = function() 
{ 
    var str = "(";
    for(var i = 0; i < this.operands.length-1; i++)
        str += this.operands[i].toLaTeX() +"\\cdot ";
    str += this.operands[this.operands.length-1].toLaTeX() + ")";
    
    return str;
}



Multiply.prototype.differentiate = function(v)
{
    var ops = new Array();
    for(var i = 0; i < this.operands.length; i++)
    {
        var ops1 = new Array();
        for(var j = 0; j < this.operands.length; j++)
        {
            if (i==j) 
                ops1[j] = this.operands[j].differentiate(v);
            else
                ops1[j] = this.operands[j];
        }
        ops[i] = new Multiply(ops1);
    }
    return new Add(ops);
}

Multiply.prototype.equals = function (x)
{
    if (!(x instanceof Multiply))
        return false;
    else
    {
        for (var i = 0; i < this.operands.length; i++)
        {
            if (!this.operands[i].equals(x.operands[i]))
                return false;
        }
        return true;
    }
    
}

// This operation sorts the operands in the order:
// Numbers, Variables, Add, Subtracts, Multiplys, Divides, Others 


function sortOperands(operands)
{
    var ops = new Array();
    var order = new Array();
    
    
    for(var i = 0; i < operands.length; i++)
    {
        order[i] = i;
        if (operands[i] instanceof Mnumber) ops[i] = 0;
        else if (operands[i] instanceof Variable) ops[i] = 1;
        else if (operands[i] instanceof Add) ops[i] = 2;
        else if (operands[i] instanceof Subtract) ops[i] = 3;
        else if (operands[i] instanceof Multiply) ops[i] = 4;
        else if (operands[i] instanceof Divide) ops[i] = 5;
        else if (operands[i] instanceof Complex) ops[i] = 6;
        else ops[i] = 7;
    }
    
    // Bubblesort the ops 
    
    for(var i = 0; i < ops.length-1; i++)
    {
        for(var j = i; j < ops.length; j++)
        {
            if (ops[j]>ops[j+1])
            {
                var tmp1 = ops[j+1]; ops[j+1] = ops[j]; ops[j] = tmp1;
                var tmp2 = order[j+1]; order[j+1] = order[j]; order[j] = tmp2;
            }
        }
    }
    
    var newOps = new Array();
    
    for(var i = 0; i < ops.length; i++)
        newOps[i] = operands[order[i]];
    
    
    return newOps;
    
    
    
}

Multiply.flatten = function (operands)
{
    var newOps = new Array();
    
    for(var i = 0; i < operands.length; i++)
    {
        if(operands[i] instanceof Multiply)
        {
            var ops = Multiply.flatten(operands[i].operands);
            for(j=0; j < ops.length; j++)
                newOps.push(ops[j]);
        }
        else  
            newOps.push(operands[i]);
    }
    
    return newOps;
}
    

Multiply.shrinkOperands = function (ops)
{
    var newOps = new Array();
    
    for(var pos = 0; pos < ops.length; pos++)
    {
        if (ops[pos] instanceof Mnumber)
        {
            var num = ops[pos];
            var tmp = 1;
            while (ops[pos+tmp] instanceof Real)
            {
                num = Real.multiplyConstants(num,ops[pos+tmp]);
                tmp++;
            }
            num = num.simplify();
            if (num.equals(Integer.ZERO))
            {
                newOps = new Array();
                newOps.push(new Integer(0));
                
                return newOps;
            }
            else 
                newOps[newOps.length]=num;
            
            pos += tmp-1;
        } else if (ops[pos] instanceof Variable)
        {
            var tmp = 1; 
            while(ops[pos].equals(ops[pos+tmp]))
            {
                tmp++;
            }
            if (tmp > 1)
                newOps.push(new Power(ops[pos],new Integer(tmp)));
            else
                newOps.push(ops[pos]);
            pos += tmp-1;
            
        } 
        else
        {
            newOps[newOps.length]=ops[pos].simplify();
        }
    }
    
  
    
    return newOps;
}

Multiply.prototype.simplify = function ()
{
    if (this.operands.length == 1)
        return this.operands[0];


    var newOps = Multiply.flatten(this.operands);
    this.operands = sortOperands(newOps);
    
    
    this.operands =  Multiply.shrinkOperands(this.operands);
    
    var complexArgs = false; var divArgs = false;
    for(var i= 0; i < this.operands.length; i++)
    {
       if (this.operands[i] instanceof Complex)
       {
         complexArgs = true;
         break;
       }
       else if (this.operands[i] instanceof Divide)
       {
         divArgs = true;
         break;
       }
    }
    
    // If any arguments are Divide, create a new Divide Object
    
    if (divArgs)
    {
      //console.log(this.operands);
      var topOps = new Array(); var bottomOps = new Array();
      
      for(var i = 0; i < this.operands.length; i++)
      {
          if (this.operands[i] instanceof Divide)
          {
             topOps.push(this.operands[i].oper1)
             bottomOps.push(this.operands[i].oper2);
          }
           else
             topOps.push(this.operands[i]);
           
      }
      //console.log(topOps,bottomOps);
      
      return new Divide(new Multiply(topOps),new Multiply(bottomOps));
    }     
           
    
    // If any of the arguments are complex, make everything a complex
    // 
    
    if (complexArgs)
    {
       var op = new Complex(Integer.ONE, Integer.ZERO);
       for(var i=0; i < this.operands.length; i++)
          op = op.times(this.operands[i])
          
       return op;
    }
    
    if (this.operands.length == 1)
        return this.operands[0];
    else
    {
      for(var i= 0; i < this.operands.length; i++)
        this.operands[i].simplify();
      
      return this;
    }
}

Divide.prototype = new Expression();
Divide.prototype.constructor = Divide;
Divide.prototype.evaluate = function(x,expr) 
{
   return new Divide(this.oper1.evaluate(x,expr),this.oper2.evaluate(x,expr));
}
Divide.prototype.evaluateToDouble = function(x,value) 
{
    return this.oper1.evaluateToDouble(x,value)/ this.oper2.evaluateToDouble(x,value);
}
Divide.prototype.toString = function() { return "div(" + this.oper1 + "," + this.oper2 + ")";}
/*Divide.prototype.toMathML = function() 
{ 
    return <mfrac>{this.oper1.toMathML()}{this.oper2.toMathML()}</mfrac>;
} */

Divide.prototype.toLaTeX = function () { return "\\frac{"+this.oper1.toLaTeX() + "}{" + this.oper2.toLaTeX() + "}";}


function Divide(oper1,oper2)
{
    this.oper1 = oper1;
    this.oper2 = oper2;
    return this.simplify();
}

Divide.prototype.simplify = function ()
{
   if(this.oper1.equals(Integer.ZERO))
      return new Integer(0);
   else if ((this.oper1 instanceof Mnumber) && (this.oper2 instanceof Mnumber))
      return Real.divideConstants(this.oper1,this.oper2);
   else if (this.oper2 instanceof Integer)
      return new Multiply(this.oper1,new Rational(1,this.oper2.value))
   else
   {
      this.oper1 = this.oper1.simplify();
      this.oper2 = this.oper2.simplify();
      return this;
   }
} 

Divide.prototype.equals = function (x)
{
   if (!(x instanceof Divide))
      return false;
    else
        return ((this.oper1.equals(x.oper1))&&(this.oper2.equals(x.oper2)));
}


Divide.prototype.differentiate = function(v)
{
    return new Subtract(new Divide(this.oper1.differentiate(v),this.oper2),
    new Divide(new Multiply(this.oper1,this.oper2.differentiate(v)),
       new Power(this.oper2,new Integer(2))));
}



Power.prototype = new Expression();
Power.prototype.constructor = Power;
Power.prototype.evaluate = function(x,value)
{
   return new Power(this.oper1.evaluate(x,value), this.oper2.evaluate(x,value));
}
Power.prototype.evaluateToDouble = function(x,value) 
{
    return Math.pow(this.oper1.evaluateToDouble(x,value), this.oper2.evaluateToDouble(x,value));
}
Power.prototype.toString = function() { return "power( " + this.oper1 + "," + this.oper2 + ")";}

function Power(oper1,oper2)
{
    this.oper1 = oper1;
    this.oper2 = oper2;
    
    return this.simplify();
}
Power.prototype.differentiate = function (varx)
{
    return new Multiply(this.oper2, this.oper1.differentiate(varx), 
       new Power(this.oper1, new Subtract(this.oper2,new Integer(1))));
    
}

Power.prototype.equals = function (x)
{
    return ((this.oper1.equals(x.oper1)) && (this.oper2.equals(x.oper2)));
}

Power.prototype.simplify = function () 
{ 
    if ((this.oper1 instanceof Integer) && (this.oper2 instanceof Integer))
    {
        if (this.oper2.value == 0)
            return new Integer(1);
        else if (this.oper2.value > 0)
        {
        var ops = new Array();
        for(var i = 0 ; i < this.oper2.value; i++)
            ops[i] = new Integer(this.oper1.value);
        
        return (new Multiply(ops)).simplify();
        }
    } else if ((this.oper1 instanceof Sqrt) && (this.oper2 instanceof Integer))
    {
      return (new Power(this.oper1.oper,new Rational(this.oper2.value,2))).simplify();
    } else
    {
      this.oper1 =this.oper1.simplify();
      this.oper2 = this.oper2.simplify();
        
      return this;
    }
}




Sqrt.prototype = new Expression();
Sqrt.prototype.constructor = Sqrt;
Sqrt.prototype.evaluateToDouble = function(x,value) { return Math.sqrt(this.oper.evaluateToDouble(x,value));}
Sqrt.prototype.toString = function() { return "sqrt(" + this.oper + ")";}
function Sqrt(oper)
{  
   if (arguments.length ==0)
      this.oper = null;
   else
   {
      this.oper = oper;
      return this.simplify();
   }
}

Sqrt.prototype.simplify = function ()
{
   if (this.oper.compareTo(Integer.ZERO)<0)
      return new Complex(new Integer(0),new Sqrt(new Multiply(new Integer(-1),this.oper)));
   else if (this.oper instanceof Integer)
   {
      if (this.oper.value == 1)
         return new Integer(1); 
      // See if there are perfect squares.
      var factors = Integer.factorInteger(this.oper.value);
      var outside = 1;
      var inside = 1;
      for(var i=0; i< factors.length - 1; i++)
      {
         if (i < factors.length - 1)
         {
            if (factors[i] == factors[i+1])
            {
               outside *= factors[i];
               i++;
            }  else  inside *= factors[i];
         }  
      }
      var sq = new Sqrt();
      sq.oper = new Integer(inside);
      
      return new Multiply(new Integer(outside), sq);
   
   } else return this;
}


Sine.prototype = new Expression();
Sine.prototype.constructor = Sine;
Sine.prototype.evaluate = function(x,value) { return new Sine(this.oper.evaluate(x,value));}
Sine.prototype.evaluateToDouble = function (x,value) { return Math.sin(this.oper.evaluateToDouble(x,value));}

Sine.prototype.toString = function() { return "sine(" + this.oper + ")";}
function Sine(oper)
{
    this.oper = oper;
}

Sine.prototype.simplify = function () { return new Sine(this.oper.simplify());}
Sine.prototype.differentiate = function (varx)
{
   return new Multiply(new Cosine(this.oper), this.oper.differentiate(varx));
}

Cosine.prototype = new Expression();
Cosine.prototype.constructor = Cosine;
Cosine.prototype.evaluateToDouble = function(x,value) { return Math.cos(this.oper.evaluateToDouble(x,value)); }
Cosine.prototype.toString = function() { return "Cosine(" + this.oper + ")";}
function Cosine(oper)
{
    this.oper = oper;
}
Cosine.prototype.simplify = function () { return new Cosine(this.oper.simplify());}
Cosine.prototype.differentiate = function (varx)
{
   return new Multiply(new Integer(-1), new Sine(this.oper), this.oper.differentiate(varx));
}

Tangent.prototype = new Expression();
Tangent.prototype.constructor = Tangent;
Tangent.prototype.evaluateToDouble = function(x,value) { return Math.tan(this.oper.evaluateToDouble(x,value)); }
Tangent.prototype.toString = function() { return "Tangent(" + this.oper + ")";}
function Tangent(oper)
{
    this.oper = oper;
}

Tangent.prototype.differentiate = function (varx)
{
   return new Divide(this.oper.differentiate(varx),new Power( new Cosine(this.oper),new Integer(2)));
}


Log.prototype = new Expression();
Log.prototype.constructor = Log;
Log.prototype.evaluateToDouble = function(x,value) { return Math.log(this.oper.evaluateToDouble(x,value)); }
Log.prototype.toString = function() { return "Log(" + this.oper + ")";}
function Log(oper)
{
    this.oper = oper;
}

Exp.prototype = new Expression();
Exp.prototype.constructor = Exp;
Exp.prototype.evaluateToDouble = function(x,value) { return Math.exp(this.oper.evaluateToDouble(x,value)); }
Exp.prototype.toString = function() { return "Exp(" + this.oper + ")";}
function Exp(oper)
{
    this.oper = oper;
}
Exp.prototype.differentiate = function(varx)
{
  return new Multiply(this.oper.differentiate(varx),new Exp(this.oper));
}
Exp.prototype.simplify = function()
{
  return new Exp(this.oper.simplify());
}

ArcSine.prototype = new Expression();
ArcSine.prototype.constructor = ArcSine;
ArcSine.prototype.evaluateToDouble = function(x,value) { return Math.asin(this.oper.evaluateToDouble(x,value)); }
ArcSine.prototype.toString = function() { return "ArcSine(" + this.oper + ")";}
function ArcSine(oper)
{
    this.oper = oper;
}

ArcCosine.prototype = new Expression();
ArcCosine.prototype.constructor = ArcCosine;
ArcCosine.prototype.evaluateToDouble = function(x,value) { return Math.acos(this.oper.evaluateToDouble(x,value)); }
ArcCosine.prototype.toString = function() { return "ArcCosine(" + this.oper + ")";}
function ArcCosine(oper)
{
    this.oper = oper;
}

ArcTangent.prototype = new Expression();
ArcTangent.prototype.constructor = ArcTangent;
ArcTangent.prototype.evaluateToDouble = function(x,value) { return Math.atan(this.oper.evaluateToDouble(x,value)); }
ArcTangent.prototype.toString = function() { return "ArcTangent(" + this.oper + ")";}
function ArcTangent(oper)
{
    this.oper = oper;
}

ArcTangent.prototype.differentiate = function (varx)
{
  return new Divide(this.oper.differentiate(varx),new Add(new Integer(1),new Power(this.oper,new Integer(2))));
}

ArcCosecant.prototype = new Expression();
ArcCosecant.prototype.constructor = ArcCosecant;
ArcCosecant.prototype.evaluateToDouble = function(x,value) { return 0; }
ArcCosecant.prototype.toString = function() { return "ArcCosecant(" + this.oper + ")";}
function ArcCosecant(oper)
{
    this.oper = oper;
}

ArcSecant.prototype = new Expression();
ArcSecant.prototype.constructor = ArcSecant;
ArcSecant.prototype.evaluateToDouble = function(x,value) { var z = this.oper.evaluateToDouble(x,value); return Math.atan(Math.sqrt(z*z)-1); }
ArcSecant.prototype.toString = function() { return "ArcSecant(" + this.oper + ")";}
function ArcSecant(oper)
{
    this.oper = oper;
}

ArcCotangent.prototype = new Expression();
ArcCotangent.prototype.constructor = ArcCotangent;
ArcCotangent.prototype.evaluateToDouble = function(x,value) { return 0; }
ArcCotangent.prototype.toString = function() { return "ArcCotangent(" + this.oper + ")";}
function ArcCotangent(oper)
{
    this.oper = oper;
}


Cosh.prototype = new Expression();
Cosh.prototype.constructor = Cosh;
Cosh.prototype.evaluateToDouble = function(x,value) { return 0.5*(Math.exp(this.oper.evaluateToDouble(x,value))+Math.exp(-this.oper.evaluateToDouble(x,value))); }
Cosh.prototype.toString = function() { return "Cosh(" + this.oper + ")";}
function Cosh(oper)
{
    this.oper = oper;
}


Sinh.prototype = new Expression();
Sinh.prototype.constructor = Sinh;
Sinh.prototype.evaluateToDouble = function(x,value) { return 0.5*(Math.exp(this.oper.evaluateToDouble(x,value))-Math.exp(-this.oper.evaluateToDouble(x,value))); }
Sinh.prototype.toString = function() { return "Sinh(" + this.oper + ")";}
function Sinh(oper)
{
    this.oper = oper;
}



Tanh.prototype = new Expression();
Tanh.prototype.constructor = Tanh;
Tanh.prototype.evaluateToDouble = function(x,value) { return (Math.exp(this.oper.evaluateToDouble(x,value))-Math.exp(-this.oper.evaluateToDouble(x,value)))/(Math.exp(this.oper.evaluateToDouble(x,value))+Math.exp(-this.oper.evaluateToDouble(x,value))); }
Tanh.prototype.toString = function() { return "Tanh(" + this.oper + ")";}
function Tanh(oper)
{
    this.oper = oper;
}



Sech.prototype = new Expression();
Sech.prototype.constructor = Sech;
Sech.prototype.evaluateToDouble = function(x,value) { return 2.0/(Math.exp(this.oper.evaluateToDouble(x,value))+Math.exp(-this.oper.evaluateToDouble(x,value))); }
Sech.prototype.toString = function() { return "Sech(" + this.oper + ")";}
function Sech(oper)
{
    this.oper = oper;
}



Csch.prototype = new Expression();
Csch.prototype.constructor = Csch;
Csch.prototype.evaluateToDouble = function(x,value) { return 2.0/(Math.exp(this.oper.evaluateToDouble(x,value))-Math.exp(-this.oper.evaluateToDouble(x,value))); }
Csch.prototype.toString = function() { return "Csch(" + this.oper + ")";}
function Csch(oper)
{
    this.oper = oper;
}



Coth.prototype = new Expression();
Coth.prototype.constructor = Coth;
Coth.prototype.evaluateToDouble = function(x,value) { return (Math.exp(this.oper.evaluateToDouble(x,value))+Math.exp(-this.oper.evaluateToDouble(x,value)))/(Math.exp(this.oper.evaluateToDouble(x,value))-Math.exp(-this.oper.evaluateToDouble(x,value))); }
Coth.prototype.toString = function() { return "Coth(" + this.oper + ")";}
function Coth(oper)
{
    this.oper = oper;
}



