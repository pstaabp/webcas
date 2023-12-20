var axes;
var data;
var objs;
var bmax=10; var bmin=-10;
var mmax=8; 
var $j = jQuery.noConflict();    

// Run the following code upon loading the document.

$j(document).ready(function() 
    {
  $j("#auto-menu").css("color","gray").css("background","lightgray");
  
  $j("#auto-menu").click(function (){
      $j("#sliderBorder").css("display","none");
    $j("#bestfit").css("display","block");
    $j("#man-menu").css("background-color","lightgray").css("color","gray");
    $j("#auto-menu").css("background-color","white").css("color","black");    
  });
  
  $j("#man-menu").click(function () {
          $j("#sliderBorder").css("display","block");
    $j("#bestfit").css("display","none");
    $j("#man-menu").css("background-color","white").css("color","black");
    $j("#auto-menu").css("background-color","lightgray").css("color","gray");
  });
  
  makeCloseButton();

  // sets up the slider for the slope 
  $j("#slope-slider").slider({max: 200});

  $j("#slope-slider").bind( "slidechange", function(event, ui) {
      $j("#slope-value").val(calcSlope($j("#slope-slider").slider("option","value")));
      updateLine();
      });
  
  $j("#intercept-slider").slider({max: 200});
  $j("#intercept-slider").bind( "slidechange", function(event, ui) {
      $j("#intercept-value").val(bmin + ($j("#intercept-slider").slider("option","value"))/200*(bmax-bmin));
      updateLine();
      });
  $j("#closebutton").click(function() {$j("#help").css("display","none");})
  
  axes = new Axes(-10,-10,10,10,$j("#lscanvas")[0]);

  axes.draw2();

  
});

function showErrorBoxes()
{
  for (var i = 0; i < data.length; i++)
  {
    var m = calcSlope($j("#slope-slider").slider("option","value"));
    var b = bmin + ($j("#intercept-slider").slider("option","value"))/200*(bmax-bmin);
    var h = data[i].y-m*data[i].x-b;
    
    var rect = new Rectangle(data[i].x,m*data[i].x+b,h,h);
    rect.setColor("red");
    axes.addObject(rect);
  }
  
}
/* This calculates the slope based on the slider value. It increments the slope
  as a fixed angle
*/
  
function calcSlope(sliderVal)
{
  return -1*mmax*Math.tan(Math.atan(Math.PI/180*(sliderVal-100)*0.8)/Math.atan(Math.PI/180*(0-100)*0.8));
}


function makeCloseButton()
{
  var ctx = $j("#closebutton")[0].getContext('2d');
  ctx.font = "18px bold sans-serif black";
  ctx.beginPath();

  ctx.fillStyle = "yellow";
  ctx.fillRect(0,0,20,20);
  ctx.fillStyle = "black";
  ctx.fillText("X",2,18);
  ctx.stroke();
  
}


function updateLine()
{
  $j("#esquared").html("E<sup>2</sup>=" + calcEsquared(data,Number($j("#slope-value").val()),
                                                      Number($j("#intercept-value").val())));
  
  axes.clear();
 

  axes.addObjects(objs);
  
  var line = new LineSegment(axes.xmin,axes.xmin*Number($j("#slope-value").val())+Number($j("#intercept-value").val()),
                             axes.xmax,axes.xmax*Number($j("#slope-value").val())+Number($j("#intercept-value").val()));
  line.setColor("blue");
  line.setLineWidth(0.01);
  
  axes.addObject(line);
  if($j("#errbox").attr("checked")) {showErrorBoxes();}
  axes.draw2();
}


function display(name)
{
  
  switch(name)
  {
  case "manual":
    break;     
    
  case "auto":
        
    break;
  }
  
}

function parse()
{
  
  
  var els = $j("#inputarea").val().split(/\n/);
  var NumReg = /\s*(\d*\.?\d*)\s+(\d*\.?\d*)\s*/
  
  var xmin = 0.0, ymin = 0.0, xmax = 0.0, ymax = 0.0;
  
  data = new Array(); 
  
  for(var i = 0; i< els.length; i++)
  {
    if (NumReg.test(els[i]))
    {
      
      var x = Number(els[i].split(/\s+/)[0]);
      var y = Number(els[i].split(/\s+/)[1]);
      data[data.length]=new Point(x,y);
      
      if (x< xmin)  xmin = x; 
      if (x> xmax) xmax = x;
      if (y< ymin) ymin = y;
      if (y> ymax) ymax = y;
      
    }
  }
  
  var xRange = xmax-xmin;
  var yRange = ymax-ymin;
  
  xmin -= 0.2*xRange; xmax+= 0.2*xRange;
  ymin -= 0.2*yRange; ymax+= 0.2*yRange;
  
  var max = Math.max(xmax,ymax);
  var min = Math.min(xmin,ymin);
  
  bmin = ymin-0.2*yRange;
  bmax = ymax+0.2*yRange;
  
  
  
  
  objs = new Array();
  for(var i=0; i< data.length; i++){objs[i]=new Dot(data[i].x,data[i].y,3);}
  
  
  axes.clear();
  axes = new Axes(xmin,ymin,xmax,ymax,$j("#lscanvas")[0]);

  axes.addObjects(objs);
  
  var line = new LineSegment(xmin,0.5*(ymax+ymin),xmax,0.5*(ymax+ymin));
  line.setColor("blue");
  //line.setLineWidth(Math.max(xRange,yRange)/150.0);
  
  axes.addObject(line);
  
  axes.draw2();
  
  mmax = 2*axes.height()/axes.width();
  
  $j("#slope-slider").slider("option","value",100);
  $j("#slope-value").val(0);
  $j("#intercept-slider").slider("value",100);
  $j("#intercept-value").val(0.5*(bmin+bmax));
  
}

function calcEsquared(data,m,b)
{
  var sum = 0.0;
  for(var i = 0; i < data.length ; i++)
  {                      
    var ht = data[i].x * m + b - data[i].y;
    sum += ht*ht;
  }
  
  return sum;
}

function findBest()
{
  findLeastSquares(data);
}

function findLeastSquares(data)
{
  
  if (data==undefined) { data = parse();}
  var sumx = 0.0;
  var sumxsq = 0.0; 
  var sumy = 0.0;
  var sumxy = 0.0;
  
  for(var i = 0 ; i < data.length; i++)
  {
    sumx += Number(data[i].x);
    sumxsq += Number(data[i].x*data[i].x);
    sumy += Number(data[i].y);
    sumxy += Number(data[i].x*data[i].y);
  }
  var lineWidth = 2*Math.max(axes.height()/axes.container.height,
                             axes.width()/axes.container.width);
  
  
  var bestM = (data.length*sumxy - sumx*sumy)/
  (data.length*sumxsq-sumx*sumx);
  
  var bestB = (sumy - bestM*sumx)/data.length;
  
  $j("#best").html("m=" + bestM + "<br/>" + "b= " + bestB + "<br/> " + "E<sup>2</sup>= " + calcEsquared(data,bestM,bestB));
  
  var line = new LineSegment(axes.xmin,axes.xmin*bestM+bestB,
                             axes.xmax,axes.xmax*bestM+bestB);
  line.setColor("purple");
  line.setLineWidth(lineWidth);
  
    var line2 = new LineSegment(axes.xmin,axes.xmin*Number($j("#slope-value").val())+Number($j("#intercept-value").val()),
                             axes.xmax,axes.xmax*Number($j("#slope-value").val())+Number($j("#intercept-value").val()));
  line2.setColor("blue");
  line2.setLineWidth(0.01);
    
  axes.clear();
  axes.addObjects(objs);
  axes.addObject(line);
  axes.addObject(line2);
  axes.draw2();
  
  
}
