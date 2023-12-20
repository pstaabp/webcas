Expression.parse = function(str)
{
    // takes the input and returns an array of tokens:

    var functionNames = new Array("cos","sin","tan","sec",
    "csc","cot","ln","log",
    "acos","asin","atan","asec",
    "acsc","acot","cosh","sinh",
    "tanh","sech","csch","coth",
    "abs","sqrt","exp");

    var variabs = new Array();
    var tokens = new Array();
    var tokeRe = new RegExp(/([a-zA-Z]+)|(\()|(\))|(\*)|(\+)|(\-)|(\/)|(\^)|(\d*\.?\d+)/g);

    while (myArray = tokeRe.exec(str))
    {
        tokens[tokens.length] = myArray[0];
    }



    var varOrFunct = /[a-zA-Z]+/;
    var operRe = /(\*)|(\+)|(\-)|(\/)|(\^)/;
    var numRe = /\-?\d*\.?\d+/;
    var numInt = /\-?\d* /;

    var operators = new Array();
    var operands = new Array();

    var otherOperators = new Array();
    var otherOperands = new Array();

    var prevToken = "(";
    var thisToken = "(";


    for(var i = 0; i < tokens.length; i++)
    {
        if (numRe.test(tokens[i]))
        {
            operands.push(Mnumber.parseConstant(tokens[i]));
        } else if (tokens[i]=="pi")
        {
            operands.push(new MconstantPI());
        } else if (tokens[i]=="e")
        {
            operands.push(new MsymbE());
        } else if (varOrFunct.test(tokens[i]))
        {
            var pos = functionNames.indexOf(tokens[i]);
            if (pos==-1)
            {
                if (variabs.indexOf(tokens[i])<0){variabs.push(tokens[i]);}
                operands.push(new Variable(tokens[i]));
            }
            else {operators.push(tokens[i]);}

        }
        else if (operRe.test(tokens[i]))
        {
            if ((tokens[i]=="+") && ((i==0) ||(tokens[i-1]=="(")))
                {}
            else if ((tokens[i]=="-") && ((i==0) ||(tokens[i-1]=="(")))
                {  operands.push(new Integer(0)); operators.push("-");
                }
            else {
                operators.push(tokens[i]);
            }
        } else  if (tokens[i]=="(")
        {
            operators.push("(");
        }
        else if (tokens[i]==")")
        {
            if (operators.indexOf("(")<0)
            {
                alert("mismatched parentheses");
            }
            else {

                while( operators[operators.length -1] != "(")
                {
                    createFunction();
                }
                operators.pop();  // gets rid of the "("

                // check to see if a function name is on the operator stack

                var op = operators[operators.length-1];
                for(j = 0; j < functionNames.length;j++)
                {
                    if (functionNames[j]==op) {
                        createFunction();
                        break;
                    }
                }

            }

        }

    }



    while(operators.length>0)
    {
        createFunction();
    }



    return { express: operands.pop(), vars: variabs};


    function createFunction()
    {
        if (operators.length>1)
        {
            checkPrecedence();
        }

        var oper = operators.pop();

        switch(oper)
        {
            case "+":
            case "-":
            case "*":
            case "/":
            case "^":

            var right = operands.pop();
            var left = operands.pop();

            switch(oper)
            {

                case "+": operands.push(new Add(left,right)); break;
                case "-": operands.push(new Subtract(left,right)); break;
                case "*": operands.push(new Multiply(left,right)); break;
                case "/": operands.push(new Divide(left,right)); break;
                case "^":
                   if (left == "e") { operands.push(new Exp(right));}
                   else {operands.push(new Power(left,right));}
                break;
            } break;

            case "sqrt":
                operands.push(new Sqrt(operands.pop()));
                break;

            case "sin":
                operands.push(new Sine(operands.pop()));
                break;

            case "cos":
                operands.push(new Cosine(operands.pop()));
                break;

            case "tan":
                operands.push(new Tangent(operands.pop()));
                break;

            case "csc":
                operands.push(new Divide(new Integer(1),new Sine(operands.pop())));
                break;

            case "sec":
                operands.push(new Divide(new Integer(1),new Cosine(operands.pop())));
                break;

            case "cot":
                operands.push(new Mivide(new Integer(1),new Tangent(operands.pop())));
                break;

            case "abs":
                operands.push(new Sqrt(new Power(operands.pop(),new Integer(2))));
                break;
            case "ln":
            case "log":
                operands.push(new Log(operands.pop()));
                break;

            case "asin":
                operands.push(new ArcSine(operands.pop()));
                break;

            case "acos":
                operands.push(new ArcCosine(operands.pop()));
                break;

            case "atan":
                operands.push(new ArcTangent(operands.pop()));
                break;

            case "acsc":
                operands.push(new ArcCosecant(operands.pop()));
                break;

            case "asec":
                operands.push(new ArcSecant(operands.pop()));
                break;

            case "acot":
                operands.push(new ArcCotangent(operands.pop()));
                break;

            case "cosh":
                operands.push(new Cosh(operands.pop()));break;

            case "sinh":
                operands.push(new Sinh(operands.pop()));break;

            case "tanh":
                operands.push(new Tanh(operands.pop()));break;

            case "sech":
                operands.push(new Sech(operands.pop()));break;

            case "csch":
                operands.push(new Csch(operands.pop()));break;

            case "coth":
                operands.push(new Coth(operands.pop()));break;

          default:
                alert("Error in expression");

        }

        while (otherOperands.length >0)
        {
            operands.push(otherOperands.pop());
        }

        while (otherOperators.length >0)
        {
            operators.push(otherOperators.pop());
        }


    }


    function checkPrecedence()
    {

        var currentOperator = operators[operators.length-1];
        var nextOperator = operators[operators.length-2];
        if(operRe.test(currentOperator) && operRe.test(nextOperator))
        {
            switch (currentOperator)
            {
                case "-":
                case "+":

                switch (nextOperator)
                {
                    case "-":
                    case "+":
                    case "*":
                    case "/":
                    case "^":

                    otherOperands.push(operands.pop());
                    otherOperators.push(operators.pop());
                    if (operators.length > 1) { checkPrecedence();}
                    return;
                }
                break;

                case "*":
                case "/":

                switch (nextOperator)
                {
                    case "*":
                    case "/":
                    case "^":

                    otherOperands.push(operands.pop());
                    otherOperators.push(operators.pop());
                    if (operators.length > 1) { checkPrecedence();}
                    return;
                }

                case "^":
                switch(nextOperator)
                {
                    case "^":

                    otherOperands.push(operands.pop());
                    otherOperators.push(operators.pop());
                    if (operators.length > 1) { checkPrecedence();}
                    return;
                }
            }
        }
    }

}
