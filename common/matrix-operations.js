Matrix.prototype.constructor = Matrix;

function Matrix(str)
{
  var arr = new Array();
  if (arguments.length ==1)
  {
    // New RegEx location, handles standard and LaTeX
    str = str.replace(/\s*&\s*/g, " ").replace(/\\\\/g, "").replace(/\n/g, ";").replace(/;*$/, "").replace(/\\hline/g, "");
    if (/(.*);\s*$/.test(str))
    {
      str = /(.*);\s*$/.exec(str)[1];
    }
    var s = str.split(";");
    for(var i=0; i< s.length; i++)
    {
      var s2 = s[i].split(/\s+/);
      var row = new Array();
      for(var j=0;j < s2.length; j++)
      {
        if (s2[j]!="")
          row[row.length]=Mnumber.parseConstant(s2[j]);
      }
      arr[i] = row;
    }

    for(var i = 1; i < arr.length; i++)
    {
      if (arr[0].length != arr[i].length)
      {
        throw "Error in constructing matrix.  Each row must be the same length.";
      }
    }
  }

  if (arguments.length==2)
  {
    var arr = new Array(arguments[0]);
    for(var j=0; j< arr.length; j++)
    {
      arr[j] = new Array(arguments[1]);
      for(var i=0; i< arr[0].length; i++)
        arr[j][i] = new Integer(0);
    }

  }
  this.arr = arr;
}


Matrix.prototype.setElement = function(i,j,value)
{
  this.arr[i][j] = value;
}

Matrix.prototype.toString = function ()
{
  var str = "";
  for (var j = 0; j < this.arr.length; j++)
  {
    str += this.arr[j] + "<br/>";
  }

  return str;
}

Matrix.prototype.toPlainText = function ()
{
  var str = "";
  for (var j = 0; j < this.arr.length; j++)
  {
    for(var i = 0; i < this.arr[j].length; i++)
      str += this.arr[j][i] + " ";
    str +="\n";
  }

  return str;
}

Matrix.prototype.toLaTeX = function ()
{
  var m = this.arr.length;
  var n = this.arr[0].length;

  var str = "\\left[\\begin{array}{";
  for(var j = 0; j<n; j++) {str += "r";}
  str += "}\n"

  for (var j = 0; j < m; j++)
  {
    for(var i = 0; i < n; i++)
    {
      str += (this.arr[j][i].toString()+"").replace("(","").replace(")","");

      if (i!= n-1)  str += " & ";}
    str += "\\\\";

   str += "\n";
  }

  str += "\\end{array} \\right] \n";

 return str;
}

// This method checks to determine if any of the matrix entries are Decimals (not integers or rationals)

Matrix.prototype.isDecimal = function ()
{
  var m = this.arr.length;
  var n = this.arr[0].length;
  for(var j = 0; j< m; j++){
    for(var i = 0; i< n; i++){
      if(!((this.arr[j][i] instanceof Integer) || (this.arr[j][i] instanceof Rational)))
      {
          return true;
      }
    }
  }
  return false;
}

// This method converts all the decimal entries to integers or rationals and returns that matrix.

Matrix.prototype.toRational = function()
{
  var mat = this.clone();

  var m = this.arr.length;
  var n = this.arr[0].length;
  for(var j = 0; j< m; j++){
    for(var i = 0; i< n; i++){
     if(!((mat.arr[j][i] instanceof Integer) || (mat.arr[j][i] instanceof Rational)))
      {
          mat.arr[j][i]=this.arr[j][i].toRational();
      }
    }
  }
  return mat;
}

/* This matrix converts all of the entries that are Rationals to Decimals */

Matrix.prototype.toDecimal = function()
{
 var mat = this.clone();

  var m = this.arr.length;
  var n = this.arr[0].length;
  for(var j = 0; j< m; j++){
    for(var i = 0; i< n; i++){
     if(mat.arr[j][i] instanceof Rational)
      {
          mat.arr[j][i]=this.arr[j][i].toDouble();
      }
    }
  }
  return mat;
}

/* checks if the given vector is an integer multiple of a column of the identity matrix.
Also, returns the location and value of the non-zero element. */
function isIdentityMultiple(vect) {
  const abssum = vect.reduce((sum,v) => new Add(sum, v.abs()),Integer.ZERO);
  const absmax = vect.reduce((max,v) => v.abs().compareTo(max)> Integer.ZERO ? v.abs() : max , Integer.ZERO);
  if (! abssum.equals(absmax)) return {is_identity: false};
  for(var j = 0; j< vect.length; j++) {
    if(vect[j].abs().equals(absmax)) {
      return {
        is_identity: true,
        location: j+1,
        value: vect[j]
      };
    }
  }
  return { is_identity: false};
}

Matrix.prototype.column = function(col) {
  const column = [];
  var m = this.arr.length;
  for(var j = 0; j< m; j++) {
    column.push(this.arr[j][col-1]);
  }
  return column;
}



/* This is how matrix operations are performed.  The matrix operations include:
  Row operations, pivots and converting to Decimals. */

Matrix.prototype.operate = function (rowOp)
{
  if (rowOp instanceof RowSwap) return this.swapRows(rowOp.row1-1,rowOp.row2-1);
  else if (rowOp instanceof RowMultiply) return this.multiplyRowBy(rowOp.row-1,rowOp.factor);
  else if (rowOp instanceof RowMultiplyAndAdd) {
    if (!((rowOp.row1==rowOp.row3)||(rowOp.row2==rowOp.row3)))
      throw "illegal row input row cannot equal " + rowOp.row3;

      return this.multiplyRowBy(rowOp.row1-1,rowOp.factor1,rowOp.row2-1,
        rowOp.factor2,rowOp.row3-1);
  } else if (rowOp instanceof Pivot) {
    if (this.arr[rowOp.row-1][rowOp.col-1].equals(Integer.ZERO)) throw "The matrix cannot be pivoted about a 0 entry.";
    return this.pivot(rowOp.row-1,rowOp.col-1);
  } else if (rowOp instanceof PivotPreserveIntegers)
  {
    if (this.arr[rowOp.row-1][rowOp.col-1].equals(Integer.ZERO)) throw "The matrix cannot be pivoted about a 0 entry.";
    return this.pivotPreserveIntegers(rowOp.row-1,rowOp.col-1);

  } else if (rowOp instanceof ToDecimal)return this.toDecimal();
  return;
}

/* The following is a pivot about the given row and column resulting in a column which is a column
  of the identity matrix. */

Matrix.prototype.pivot = function (row,col) {
  var m = this.clone();

  var factor = new Divide(new Integer(1),this.arr[row][col])
  m = m.multiplyRowBy(row,factor);

  for(var i = 0; i < this.arr.length; i++)
    if (i != row)
      m = m.multiplyRowBy(row, new Multiply(new Integer(-1),this.arr[i][col]),i,Integer.ONE);

  return m;

}

/* The following is a pivot about the given row and column that preserves integers
  in the matrix.  The resulting column will be a positive multiple of a column of the
  identity matrix.  */

Matrix.prototype.pivotPreserveIntegers = function (row,col) {
  let m = this.clone();

  /* This needs m.SMMultiplier to be defined.  If not, try to detect it.
  This goes through all columns to determine if each is a multiple of the identity
  Matrix or not.  If so, make sure that all columns are covered.  Store the
  multiple of the columns. */

  if (m.SMMultiplier === undefined) {
    const cols = [];
    let mult = undefined;
    // Common error
    const err = 'When using Simplex Method mode, you must ' +
    'have all basic columns the same multiple of a row of the identity matrix.';
    for(let j=0; j< this.arr[0].length; j++) {
      const c = isIdentityMultiple(m.column(j+1));
      if (c.is_identity) {
        if (mult == undefined) mult = c.value
        else if (!c.value.equals(mult)) throw err;
        cols.push(c);
      }
      console.log(mult);
    }
    // Check that every location is filled.
    const seq = new Array(m.arr.length).fill(1).map( (_, i) => i+1 );
    let valid = true;
    for(let j=0; j<cols.length; j++) {
      const loc = seq.findIndex(i => i==cols[j].location);
      if (loc> -1) {
        seq.splice(loc,1);
      } else {
        throw err;
      }
    }
    // if (! (seq.length == cols.length && cols.map((c) => c.location).sort().every((v,i) => v == seq[i])) )
    //   throw err;
    m.SMMultiplier = mult;
  }
  const mult = m.SMMultiplier;

  // This is a standard pivot, keeping the pivoted number throughout the matrix.
  if (m.arr[row][col].compareTo(Integer.ZERO)<0) m = m.multiplyRowBy(row, new Integer(-1));
  for(var k = 0; k < this.arr.length; k++)
    if (k != row)
      m = m.multiplyRowBy(row,new Multiply(new Integer(-1), new Divide(m.arr[k][col], mult)),
                          k,new Divide(new Multiply(m.arr[row][col]), mult));

  m.SMMultiplier = m.arr[row][col];

  return m;
}


/* Mulitply a Row of the matrix by a number (and add to a multiple of another row) */


Matrix.prototype.multiplyRowBy = function (row1,num1,row2,num2,row3)
{
  if (arguments.length==2)
  {
    row2 = row1;
    num2 = new Integer(0);
    row3 = row1;
  }

  else if (arguments.length==3)
  {
    num2 = new Integer(1);
    row3 = row2;
  }
  else if (arguments.length==4)
  {
    row3 = row2;
  }


  var m = this.clone();
  for(var j = 0; j < this.arr[row2].length; j++)
  {
    var tmp = new Add(new Multiply(this.arr[row1][j],num1),
      new Multiply(this.arr[row2][j],num2));

    m.arr[row3][j] = tmp.simplify();
  }

  return m;
}

Matrix.prototype.addRows = function(i,j)
{
  return this.multiplyRowBy(i,new Integer(1),j, new Integer(1));
}

Matrix.prototype.swapRows = function(i,j)
{
  var m = this.clone();
  var row = m.arr[i];
  m.arr[i] = m.arr[j];
  m.arr[j] = row;

  return m;
}

/* This method create a clone of the this matrix. */

Matrix.prototype.clone = function()
{
  var m = new Matrix(this.arr.length,this.arr[0].length);
  for(i=0; i < this.arr.length; i++)
    for(j=0; j< this.arr[i].length; j++)
    m.arr[i][j] = this.arr[i][j];
  m.SMMultiplier = this.SMMultiplier;
  return m;
}

/* This is the transpose of the matrix */
Matrix.prototype.transpose = function()
{
  var m = new Matrix(this.arr[0].length,this.arr.length);
  for(i=0; i < m.arr.length; i++)
    for(j=0; j< m.arr[i].length; j++)
      m.arr[i][j] = this.arr[j][i];

  return m;
}


/* This checks for equality of the dimensions */

Matrix.prototype.equalDimensions = function(B)
{
  return ((this.arr.length==B.arr.length) && (this.arr[0].length == B.arr[0].length));
}

/* This produces an augmented matrix */

Matrix.prototype.augment = function(B)
{
  if (this.arr.length != B.arr.length) {
    throw "The number of rows of the two matrices must be equal";
  }
  var m = new Matrix(this.arr.length,this.arr[0].length + B.arr[0].length);
  for(i=0; i < this.arr.length; i++) {
    for(j=0; j< this.arr[i].length; j++)
      m.arr[i][j] = this.arr[i][j];
    for(j=0; j<B.arr[0].length; j++)
      m.arr[i][this.arr[0].length + j] = B.arr[i][j];
  }
  return m;
}
/* This adds the current matrix to B and return the result */

Matrix.prototype.plus = function (B)
{

  if (!this.equalDimensions(B))
    throw "Matrices are not the same size for addition";

  var m = new Matrix(this.arr.length,this.arr[0].length);

  for(var j = 0; j < this.arr.length; j++)
    for(var i = 0; i < this.arr[0].length; i++)
    m.arr[j][i] = new Add(this.arr[j][i],B.arr[j][i]);

  return m;
}

/* This subtracts B from the current matrix and returns the result */

Matrix.prototype.minus = function(B)
{
  if (!this.equalDimensions(B))
    throw "Matrices are not the same size for addition";

  var m = new Matrix(this.arr.length,this.arr[0].length);

  for(var j = 0; j < this.arr.length; j++)
    for(var i = 0; i < this.arr[0].length; i++)
    m.arr[j][i] = new Subtract(this.arr[j][i],B.arr[j][i]);

  return m;
}

/* This multiplies the current matrix to B and return the result */

Matrix.prototype.times = function (B)
{
  if(B instanceof Matrix)
  {
    if (this.arr[0].length != B.arr.length)
      throw "Matrices are not compatible for multiplication";

    var m = new Matrix(this.arr.length, B.arr[0].length);
    for(var j = 0; j < this.arr.length; j++)
      for(var i = 0; i < B.arr[0].length; i++)
      {
        var ops = new Array();
        for (var k = 0; k < B.arr.length; k++)
          ops[k] = new Multiply(this.arr[j][k],B.arr[k][i]);
        m.arr[j][i] = new Add(ops);
      }

      return m;

  } else  // scalar multiplication
  {
    var m = new Matrix(this.arr.length, this.arr[0].length);

    for(var j = 0; j < this.arr.length; j++)
      for(var i = 0; i < this.arr[0].length; i++)
      m.arr[j][i] = new Multiply(this.arr[j][i],B);

    return m;
  }
}

/* The following raises the matrix to an integer power.  Currently this
uses matrix multiplication over and over.  In the future, possibly it should use
eigenvalues/vectors.

*/

Matrix.prototype.power = function(n)
{

  if (n<0) throw "The matrix must be raised to a positive integer power";

  if (! this.isSquare())
    throw "The matrix must be square in order to raise it to a power";


  var m = Matrix.identity(this.arr.length);

  for(var i = 0; i < n; i++)
    m = m.times(this);

  return m;
}

/* This returns the n by n identity matrix  */


Matrix.identity = function(n)
{
  if (n<1) throw "identity matrix must be at least a 1 by 1 matrix";

  var m = new Matrix(n,n);

  for(var i=0; i< n; i++)
    m.arr[i][i] = new Integer(1);


  return m;
}

/* This checks if all elements of the matrix are either integers or rationals. */


Matrix.prototype.isRational = function()
{
  for(i=0; i < this.arr.length; i++)
    for(j=0; j< this.arr[i].length; j++)
    if(!( (this.arr[i][j] instanceof Integer) ||
      (this.arr[i][j] instanceof Rational)))
    return false;

    return true;
}

/* This check if any element of the matrix has a Real element (not integer or rational) */

Matrix.prototype.isReal = function()
{
  for(i=0; i < this.arr.length; i++)
    for(j=0; j< this.arr[i].length; j++)
    if(this.arr[i][j] instanceof Real)
    return true;

  return false;
}

/* This is designed to determine if the matrix is real or rational and then
  perform different types of row reduction.  (Perhaps doing pivoting).  This
  is not operationals yet.  */


Matrix.prototype.rowReduce = function ()
{
  //  if (this.isReal())
  //   return this.rowReduceReal();
  // else
  return this.rowReduceRational();
}

/* This performs row reduction to a matrix.  It will return the ?? form
  of the matrix.  */

Matrix.prototype.rowReduceRational = function ()
{
  var m = this.clone();

  var row = 0;
  for(var col = 0; col < m.arr[0].length; col++)
  {
    var columnOfZeros = true;

    // Search for a non-zero entry in column col

    if (m.arr[row][col].equals(Integer.ZERO))
    {
      for (var j=row+1;j < m.arr.length; j++)
      {
        if (!m.arr[j][col].equals(Integer.ZERO))
        {
          m = m.swapRows(row,j);

          columnOfZeros = false;
          break;
        }
      }
        } else { columnOfZeros = false;}

        if (!columnOfZeros)
        {
           // First divide the current row to get a 1 in leading position.
          var rat = null;
          if (m.arr[row][col] instanceof Integer)
            rat = new Rational(1,m.arr[row][col].value)
          else if (m.arr[row][col] instanceof Rational)
            rat = new Rational(m.arr[row][col].bottom,m.arr[row][col].top);
          else if (m.arr[row][col] instanceof Complex)
            rat = new Divide(m.arr[row][col].conjugate(),new Power(m.arr[row][col].abs(),new Integer(2)));
          m = m.multiplyRowBy(row,rat);
          for(var j=0;j< m.arr.length; j++)
          {
            if (j!=row)  // eliminate to get zeros in all other positions.
               m = m.multiplyRowBy(row,new Multiply(new Integer(-1),m.arr[j][col]),j,new Integer(1));
          }
          row++;
        }
        if (row == m.arr.length) break;
  }

  return m;


}

/* This is designed to simplify all elements of the matrix.  */

Matrix.prototype.simplify = function ()
{
  var m = new Matrix(this.arr.length, this.arr[0].length);

  for(var j = 0; j < this.arr.length; j++)
    for (var i = 0; i < this.arr[0].length; i++)
    m.arr[j][i] = this.arr[j][i].simplify();

  return m;
}

/* Checks if the matrix is square (# of row = # cols ) */

Matrix.prototype.isSquare = function ()
{
  return (this.arr.length == this.arr[0].length);
}

/*
*  The following method finds the determinant of the matrix.  The method used
is Gaussian Elimination
**/

Matrix.prototype.determinant = function ()
{
  if (! this.isSquare())
    throw "Error in taking determinant.  The matrix is not square.";

  var det = new Integer(1);

  var m = this.clone();

  var row = 0;
  for(var col = 0; col < m.arr[0].length; col++)
  {
    var columnOfZeros = true;

    // Search for a non-zero entry in column col

    if (m.arr[row][col].equals(new Integer(0)))
    {
      for (var j=row+1;j < m.arr.length; j++)
      {
        if (!m.arr[j][col].equals(new Integer(0)))
        {
          m = m.swapRows(row,j);

          columnOfZeros = false;
          break;
        }
      }
        } else { columnOfZeros = false;}

        if (!columnOfZeros)
        {
          var rat = new Divide(new Integer(1),m.arr[row][col]);
          det = new Multiply(det,m.arr[row][col]);
          m = m.multiplyRowBy(row,rat);
          for(var j=row+1;j< m.arr.length; j++)
          {
            var rat = (m.arr[j][col] instanceof Integer)?
            new Integer(-m.arr[j][col].value):
            new Rational(-m.arr[j][col].top,m.arr[j][col].bottom);
            m = m.multiplyRowBy(row,rat,j,new Integer(1));
          }
          row++;
        }

        if (row == m.arr.length) break;

  }

  return det;
}

/* This returns the minor of the matrix formed by removing the ith row and
the jth column  */

Matrix.prototype.minor = function(i,j)
{
  var m = new Matrix(this.arr.length-1,this.arr[0].length-1);

  for(var k1 = 0; k1 < i; k1++)
  {
    for(var k2 = 0; k2 < j; k2++)
      m.arr[k1][k2] = this.arr[k1][k2];
    for(var k2= j+1; k2 < this.arr[0].length; k2++)
      m.arr[k1][k2-1] = this.arr[k1][k2];
  }
  for(var k1= i+1; k1 < this.arr.length; k1++)
  {
    for(var k2 = 0; k2 < j; k2++)
      m.arr[k1-1][k2] = this.arr[k1][k2];
    for(var k2= j+1; k2 < this.arr[0].length; k2++)
      m.arr[k1-1][k2-1] = this.arr[k1][k2];
  }

  return m;
}

/* This find the determinant of a matrix using the row expansion method */


Matrix.prototype.det2 = function()
{
  if (! this.isSquare())
    throw "Error in taking determinant.  The matrix is not square.";

  var result;

  if (this.arr.length == 2)
  {
    result = new Add(new Multiply(this.arr[0][0],this.arr[1][1]),
      new Multiply(new Integer(-1),this.arr[0][1],this.arr[1][0]));
  }
  else
  {
    var ops = new Array();
    for(var i = 0; i < this.arr.length; i++)
    {
      if (i%2 == 0)
        ops[i] = new Multiply(this.arr[0][i], this.minor(0,i).det2());
      else
        ops[i] = new Multiply(new Integer(-1),this.arr[0][i], this.minor(0,i).det2());

      ops[i] = ops[i].simplify();
    }

    result = new Add(ops);
  }
  return result.simplify();

}

/* The following finds the inverse of the matrix stored in this.

*/

Matrix.prototype.invert = function ()
{
  if (! this.isSquare())
    throw "Error in taking inverse.  The matrix is not square.";

  var m = new Matrix(this.arr.length,2*this.arr[0].length);

  for(var j = 0; j < m.arr.length; j++)
  {
    for(var i = 0; i < this.arr[0].length; i++)
      m.arr[j][i] = this.arr[j][i];
    m.arr[j][j+this.arr.length] = new Integer(1);
  }



  m = m.rowReduceRational();

  var minv = new Matrix(this.arr.length, this.arr.length);

  // check to see if the matrix is invertible

  var exists = true;
  for(var i = 0; i < this.arr[0].length - 1; i++)
    if (! m.arr[m.arr.length-1][i].equals(Integer.ZERO))
    {
      exists = false;
      break;
    }

    if (!m.arr[m.arr.length-1][m.arr.length-1].equals(Integer.ONE))
      exists = false;

    if (!exists)
      throw "The inverse of the matrix does not exist";

    for(var j = 0; j < minv.arr.length; j++)
    {
      for(var i = 0; i < minv.arr[0].length; i++)
        minv.arr[j][i] = m.arr[j][i+minv.arr.length];
    }

    return minv;



}



/* The follow is the ElementaryRowOperation object.  This is a more robust manner to
store a matrix operation */

ElementaryRowOperation.prototype.constructor = ElementaryRowOperation;

function ElementaryRowOperation()
{

}

/* This method parses a string and returns either a RowSwap, RowMultiplication
  Pivot or ToDecimal Object.  Then typically a row operation is performed on
  the matrix.  */

ElementaryRowOperation.parse = function (str)
{
    var rowOps = new Array();

    var form3 =/pivot\((\d+),(\d+)\)/;
    var form4 =/piv\((\d+),(\d+)\)/;

    var result3 = form3.exec(str);
    var result4 = form4.exec(str);

    if(str=="toDecimal")
    {
      rowOps[0] = new ToDecimal();
    }
    else if(result3 != null)
    {
      rowOps[0] = new Pivot(Number(result3[1]),Number(result3[2]));
    }
    else if (result4 != null)
    {
      rowOps[0] = new PivotPreserveIntegers(Number(result4[1]),Number(result4[2]));
    }
    else if (str.indexOf(",")>0)
    {
      substrings = str.split(",");

      for(var i = 0; i< substrings.length; i++)
        rowOps[i] = this.parseString(substrings[i]);

    } else
    {
      rowOps[0] = this.parseString(str);

    }

    return rowOps;
}

ElementaryRowOperation.parseString= function (str)
{
  str = str.replace(/\s/g,"");
  var form1 = /(\(?(-?[\.\d+\/]*)\)?\*?R(\d+)(\+|-))?\(?(-?[\.\d+\/]*)?\)?\*?R(\d+)(->R(\d+)(.*))?/;
  var form2 = /S(\d+)(\d+)/;
  var form3 = /R(\d+)<->R(\d+)/;

  var num1, row1, num2, row2, row3;

/* First check if the operation is a row swap */

  var result2 = form2.exec(str);
  var result3 = form3.exec(str);

  if ((result2 != null)||(result3 != null))
  {
    result = (result2 != null)?result2:result3;

    row1 = Number(result[1]);
    row2 = Number(result[2]);

    if (row1==row2)
      throw "Error in Swapping rows: the two rows must be unique.";

    return new RowSwap(row1,row2);
  }


  var result = form1.exec(str);

  if(result != null)
  {
    if (result[1] == undefined) // has form 2R2->R2;
    {
      if (result[5]=="-")
        num2 = new Integer(-1);
      else if (result[4]=="-")
        num2 = new Multiply(Mnumber.parseConstant(result[5]),new Integer(-1));
      else
        num2 = Mnumber.parseConstant(result[5]);

      row2 = Number(result[6]);
      if (result[8] == undefined)
        row3 = row2
      else
        row3 = Number(result[8]);

      if (!((row2 == row3) || (row2 == row1)))
        throw "Illegal Row Operation.  The row number following \n the -> must be one of the first two rows.";
      return new RowMultiply(row2,num2);
    }
    if (result[2]=="")
      num1 = new Integer(1);
    else if (result[2]=="-")
      num1 = new Integer(-1);
    else
      num1 = Mnumber.parseConstant(result[2]);
    row1 = Number(result[3]);

    if ((result[5]==undefined)||(result[5]==""))
    {
      if (result[4]=="-")
        num2 = new Integer(-1);
      else
        num2 = new Integer(1);
    }  else
    {
      if (result[4]=="-")
        num2 = new Multiply(Mnumber.parseConstant(result[5]),new Integer(-1));
      else
        num2 = Mnumber.parseConstant(result[5]);
    }

    row2 = Number(result[6]);

    if (result[8] == undefined)
      row3 = row2;
    else
      row3 = Number(result[8]);

    return new RowMultiplyAndAdd(row1, num1, row2, num2, row3);


  }



  throw "Error in Row operation";
  // Throw an error!

}

RowSwap.prototype = new ElementaryRowOperation();
RowSwap.prototype.constructor = RowSwap;
function RowSwap(i,j)
{
  this.row1 = i;
  this.row2 = j;
}

RowSwap.prototype.toString = function ()
{
  return "swap-rows("+this.row1 + "," + this.row2 +")";
}

RowSwap.prototype.toLaTeX = function()
{
  return "R_{"+this.row1 + "} \\leftrightarrow R_{ " + this.row2 +"}";
}


RowMultiply.prototype = new ElementaryRowOperation();
RowMultiply.prototype.constructor = RowMultiply;
function RowMultiply(row, factor)
{
  this.row = row;
  this.factor = factor;
}

RowMultiply.prototype.toString = function ()
{
  return "Mult row " + this.row + " by " + this.factor;
}

RowMultiply.prototype.toLaTeX = function()
{
  return this.factor.toLaTeX() + "R_{ " + this.row + "} \\rightarrow R_{ " + this.row + "}";
}


RowMultiplyAndAdd.prototype = new ElementaryRowOperation();
RowMultiplyAndAdd.prototype.constructor = RowMultiplyAndAdd;
function RowMultiplyAndAdd(row1, factor1, row2, factor2, row3)
{
  this.row1 = row1;
  this.factor1 = factor1;
  this.row2 = row2;
  this.factor2 = factor2;
  this.row3 = row3;
}

RowMultiplyAndAdd.prototype.toString = function ()
{
  return "Mult row " + this.row1 + " by " + this.factor1 + " and add to " +
  this.factor2 + " times row " + this.row3;
}

RowMultiplyAndAdd.prototype.toLaTeX = function()
{
  var r1="R_{ " + this.row1 +"}";

  var row1, row2;

  if ((this.factor1 instanceof Integer) &&  (this.factor1.value == -1))
    row1 = "-" + r1;
  else if ((this.factor1 instanceof Integer) && (this.factor1.value == 1))
    row1 = r1;
  else
    row1 = this.factor1.toLaTeX() + r1;

  var op, fact2;
  if ((this.factor2 instanceof Integer) && (this.factor2.value <0))
  {
    op = "-";
    fact2 = new Integer(-this.factor2.value);
  }

  else if ((this.factor2 instanceof Rational) && (this.factor2.top <0))
  {
    op = "-";
    fact2 = new Rational(-this.factor2.top,this.factor2.bottom);
  }
  else
  {
    op = "+";
    fact2 = this.factor2;
  }


  var r2 = "R_{" + this.row2 +" }";


  if ((fact2 instanceof Integer) &&  (fact2.value == 1))
    row2 = r2;
  else
    row2 = fact2.toLaTeX()+r2;



  return row1 + op + row2 + "\\rightarrow " + "R_{ " + this.row3 + "}";

}



Pivot.prototype = new ElementaryRowOperation();
Pivot.prototype.constructor = Pivot;
function Pivot(i,j)
{
  this.row = i;
  this.col = j;
}

Pivot.prototype.toString = function()
{
  return "pivot("+this.row +"," + this.col +")";
}

Pivot.prototype.toLaTeX = function ()
{
  return "\\mbox{pivot}(" + this.row + "," + this.col + ")";
}

/*
Pivot.prototype.toMathML = function ()
{
  return <mrow><mo>pivot</mo><mo>(</mo><mn>{this.row}</mn><mo>,</mo><mn>{this.col}</mn><mo>)</mo></mrow>;
} */

PivotPreserveIntegers.prototype = new ElementaryRowOperation();
PivotPreserveIntegers.prototype.constructor = PivotPreserveIntegers;
function PivotPreserveIntegers(i,j)
{
  this.row = i;
  this.col = j;
}

PivotPreserveIntegers.prototype.toString = function()
{
  return "PivotPreserveIntegers("+this.row +"," + this.col +")";
}

PivotPreserveIntegers.prototype.toLaTeX = function ()
{
  return "\\mbox{piv}(" + this.row + "," + this.col + ")";
}

ToDecimal.prototype = new ElementaryRowOperation();
ToDecimal.prototype.constructor = ToDecimal;
function ToDecimal() {}

ToDecimal.prototype.toString = function () { return "ToDecimal";}

ToDecimal.prototype.toLaTeX = function () { return "\\mbox{The matrix converted to decimals is:}";}
