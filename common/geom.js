/* Note: some of the routines in this file use the jquery package.  The variable $j
  should be defined as
  var $j = jQuery.noConflict();
  in some file that uses geom.js
*/


// This is a general Geometric Object

function GeomObject(){
    this.color="black";
}

GeomObject.prototype.setColor = function(color)
{
    this.color=color;
}

GeomObject.prototype.setLineWidth = function (width)
{
    this.lineWidth = width;
}

Point.prototype = new GeomObject;
function Point(x,y)
{
    this.x = x;
    this.y = y;
}

Point.prototype.Xscr = function()
{
    return width*this.x/axes.width();
}

Point.prototype.Yscr = function()
{
    return height*this.y/axes.height();
}

Point.prototype.toString = function()
{
    return "(" + this.x + "," + this.y + ")";
}

Point.prototype.draw = function (ctx)
{
    ctx.beginPath();
    ctx.moveTo(this.x,this.y);
    ctx.arc(this.x,this.y,0.1,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();

}

// A Dot is a filled circle with some radius

Dot.prototype = new GeomObject;
function Dot(x,y,r)
{
    this.x = x; this.y = y; this.radius=r;
}

Dot.prototype.toString = function()
{
    return "(" + this.x + "," + this.y + ";" + this.radius +"," + this.color +")";
}

Dot.prototype.draw = function (axes)
{
    var ctx = axes.container.getContext('2d');
    ctx.save();
    ctx.beginPath();
    ctx.fillColor=this.color;
    ctx.strokeColor=this.color;
    var pt = axes.convert(new Point(this.x,this.y));
    ctx.moveTo(pt.x,pt.y);
    ctx.arc(pt.x,pt.y,this.radius,0,Math.PI*2,true);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

}



// Line Segment Code

LineSegment.prototype = new GeomObject;
function LineSegment(x1,y1,x2,y2)
{
    this.pt1 = new Point(x1,y1);
    this.pt2 = new Point(x2,y2);
}

LineSegment.prototype.toString = function()
{
    return "(" + this.pt1.toString() + ";" + this.pt2.toString() + ")";
}

LineSegment.prototype.toSVG = function()
{
   var s = createSVGElement("line");
   s.setAttributeNS(null,"x1",this.pt1.x);
   s.setAttributeNS(null,"x2",this.pt2.x);
   s.setAttributeNS(null,"y1",this.pt1.y);
   s.setAttributeNS(null,"y2",this.pt2.y);

   s.setAttributeNS(null,"stroke","gray");
   s.setAttributeNS(null,"stroke-width","0.01");

   return s;
}

LineSegment.prototype.draw = function(axes)
{
    var ctx = axes.container.getContext('2d');
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle=this.color;
    axes.drawLine(this.pt1,this.pt2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}


function Strand()
{
    this.points = new Array();
}

Strand.prototype.constructor = Strand;
Strand.prototype.addPoint = function(x,y)
{
    this.points.push(new Point(x,y));
}




Strand.prototype.toSVG = function()
{
   var str = createSVGElement("polyline");
   var pts = "";

   for(var i=0; i<this.points.length; i++)
        pts += " " + this.points[i].x + "," + this.points[i].y;

   str.setAttributeNS(null,"points",pts);
   str.setAttributeNS(null,"fill","none");
   str.setAttributeNS(null,"stroke","red");
   str.setAttributeNS(null,"stroke-width","0.01");


   return str;

}

function BStrand()
{
   this.bezs = new Array();
}

BStrand.prototype.addBezier = function(b)
{
   this.bezs.push(b);
}

BStrand.prototype.toSVG = function()
{
  var g = createSVGElement("g");
  for(var i = 0 ; i < this.bezs.length; i++)
    g.appendChild(this.bezs[i].toSVG());
  return g;
}

function BezierCurve()
{
  this.points = new Array();
  this.controlPoints = new Array();

}



BezierCurve.prototype.toString = function ()
{
  var str = "";
  points.each( function(el) { str += el.x + ", " + el.y + " ";});
  return str;
}

BezierCurve.prototype.toSVG = function ()
{
  var p = createSVGElement("path");

    var pathStr = "M" + this.points[0].x + "," + this.points[0].y + " ";

    for(var i=0; i<this.points.length-1;i++)
      pathStr += "C" + this.controlPoints[2*i].x + ","
    + this.controlPoints[2*i].y + " " +
    this.controlPoints[2*i+1].x + ","
    + this.controlPoints[2*i+1].y + " " +
    this.points[i+1].x + "," + this.points[i+1].y + " ";

    p.setAttributeNS(null,"d",pathStr);
    p.setAttributeNS(null,"stroke-width","0.01");
    p.setAttributeNS(null,"fill","none");
    p.setAttributeNS(null,"stroke","black");

return p;
}

Rectangle.prototype = new GeomObject;
function Rectangle(x,y,width,height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Rectangle.prototype.draw = function(axes)
{
    var ctx = axes.container.getContext('2d');
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle=this.color;
    axes.drawLine(new Point(this.x,this.y),new Point(this.x+this.width,this.y));
    axes.drawLine(new Point(this.x+this.width,this.y),new Point(this.x+this.width,this.y+this.height));
    axes.drawLine(new Point(this.x+this.width,this.y+this.height),new Point(this.x,this.y+this.height));
    axes.drawLine(new Point(this.x,this.y+this.height),new Point(this.x,this.y));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}




// The variable container is the svg element the axes are contained within

function Axes(x1,y1,x2,y2,container)
{
   this.xmin = x1;
   this.xmax = x2;
   this.ymin = y1;
   this.ymax = y2;

   if (x1>=x2) throw "Error in defining Axes";
   if (y1>=y2) throw "Error in defining Axes";

   this.container = container;

   this.objects = new Array();

}

Axes.prototype.clone = function()
{
    return new Axes(this.xmin,this.ymin,this.xmax,this.ymax,this.container);
}


Axes.prototype.toString = function ()
{
   return "Axes(" + this.xmin + "," + this.ymin + "," + this.xmax + "," + this.ymax + ")";
}

Axes.prototype.height = function()
{
    return this.ymax-this.ymin;
}

Axes.prototype.width = function()
{
    return this.xmax-this.xmin;
}

Axes.prototype.setAspectRatio = function(r)
{
  this.aspectRatio = r;
}


Axes.prototype.addObject = function(obj)
{
    this.objects[this.objects.length]=obj;
}

Axes.prototype.addObjects = function(objs)
{
    this.objects = $j.merge(this.objects,objs);
}

Axes.prototype.translate = function(dx,dy)
{
    //operands2.value = dx + " " + dy;
    this.xmin += Number(dx); this.xmax += Number(dx);
    this.ymin += Number(dy); this.ymax += Number(dy);
    document.getElementById("xminbox").value = this.xmin;
    document.getElementById("xmaxbox").value = this.xmax;
    document.getElementById("yminbox").value = this.ymin;
    document.getElementById("ymaxbox").value = this.ymax;


}

Axes.prototype.scale = function(scale)
{
    var w = this.width();
    var h = this.height();
    var origin = new Point(0.5*(this.xmax+this.xmin),0.5*(this.ymin+this.ymax));
    this.xmax = origin.x+0.5*scale*w;
    this.xmin = origin.x-0.5*scale*w;
    this.ymax = origin.y+0.5*scale*h;
    this.ymin = origin.y-0.5*scale*h;

}

//Clears the drawing pane and removes all objects on the axes.

Axes.prototype.clear = function()
{
   this.objects = new Array();
   this.container.width=this.container.width;
}

// This function converts cartesian coordinates to screen coordinates.

Axes.prototype.convert = function (pt)
{
    return new Point(Math.round((pt.x-this.xmin)*this.container.width/this.width()),
                     Math.round((this.ymax-pt.y)*this.container.height/this.height()));
}

Axes.prototype.drawLine = function(pt1,pt2)
{
    var pt3 = this.convert(pt1);
    var pt4 = this.convert(pt2);
    this.container.getContext('2d').moveTo(pt3.x,pt3.y);
    this.container.getContext('2d').lineTo(pt4.x,pt4.y);

}

Axes.prototype.draw2 = function ()
{
    var ctx = this.container.getContext('2d');
    ctx.save();

    // draw the axes

    ctx.beginPath();
    ctx.lineWidth=2;

    this.drawLine(new Point(this.xmin,0),new Point(this.xmax,0));
    this.drawLine(new Point(0,this.ymin),new Point(0,this.ymax));

    // draw the tick marks on the x axis

    var dx = this.width()/10.0;
    var factor = 1;
    while (dx<1) {  dx *=10; factor*=0.1; }
    while(dx>10) {  dx *= 0.1; factor*=10;}

    if(dx<2){ dx = 1;}
    else if (dx<3){ dx = 2;}
    else if (dx<5){ dx = 2.5;}
    else {dx = 5;}

    dx *=factor;

    var dy = this.height()/10.0;
    factor = 1;
    while (dy<1) {  dy *=10; factor*=0.1; }
    while(dy>10) {  dy *= 0.1; factor*=10;}

    if(dy<2){ dy = 1;}
    else if (dy<3){ dy = 2;}
    else if (dy<5){dy = 2.5;}
    else {dy = 5;}

    dy *=factor;

    ctx.lineWidth = 1;
     ctx.font = "12px sans-serif";
     ctx.textBaseline = "top";
     ctx.textAlign = "center";

    for(var x = dx; x<this.xmax; x+=dx)
    {
        this.drawLine(new Point(x,-1.0*this.height()/75),new Point(x,this.height()/75.0));
        var pt = this.convert(new Point(x, -1.0*this.height()/50));
        ctx.fillText(""+x,pt.x,pt.y);
    }

    for(var x = -1.0*dx; x>this.xmin; x-=dx)
     {
        this.drawLine(new Point(x,-1.0*this.height()/75),new Point(x,this.height()/75.0));
        var pt = this.convert(new Point(x, -1.0*this.height()/50));
        ctx.fillText(""+x,pt.x,pt.y);
    }
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    for(var y = dy; y<this.ymax; y+=dy)
    {
        this.drawLine(new Point(-1.0*this.width()/75,y),new Point(1.0*this.width()/75,y));
        var pt = this.convert(new Point(-1.0*this.width()/50,y));
        ctx.fillText(""+y,pt.x,pt.y);
    }

    for(var y = -1.0*dy; y>this.ymin; y-=dy)
    {
        this.drawLine(new Point(-1.0*this.width()/75,y),new Point(1.0*this.width()/75,y));
        var pt = this.convert(new Point(-1.0*this.width()/50,y));
        ctx.fillText(""+y,pt.x,pt.y);
    }
    ctx.closePath();
    ctx.stroke();
    // This draws all of the objects that have been added to the Axes.

    var ax = this.clone();
    $j.each(this.objects,function(index,value) { value.draw(ax); });




}


Axes.prototype.draw = function()
{

    var ctx = this.container.getContext('2d');
    ctx.save();

    var xthick = this.width()/250.0;
    var ythick = this.height()/250.0;

    var xScale = this.width()/this.container.width;
    var yScale = this.height()/this.container.height;

    var scale=0.5*((this.xmax-this.xmin)/this.container.width+(this.ymax-this.ymin)/this.container.height);

    ctx.scale(1/xScale,-1.0/yScale);


    ctx.translate(-1*this.xmin,-1*this.ymax);
    ctx.beginPath();

    // draw the axes

    ctx.lineWidth = xthick;
    ctx.moveTo(this.xmin,0); ctx.lineTo(this.xmax,0);
    ctx.lineWidth = ythick;
    ctx.moveTo(0,this.ymin); ctx.lineTo(0,this.ymax);

   // draw the tick marks on the x axis

    var dx = this.width()/10.0;
    var factor = 1;
    while (dx<1) {  dx *=10; factor*=0.1; }
    while(dx>10) {  dx *= 0.1; factor*=10;}

    if(dx<2){ dx = 1;}
    else if (dx<3){ dx = 2;}
    else if (dx<5){ dx = 2.5;}
    else {dx = 5;}

    dx *=factor;

    var dy = this.height()/10.0*this.aspectRatio;
    factor = 1;
    while (dy<1) {  dy *=10; factor*=0.1; }
    while(dy>10) {  dy *= 0.1; factor*=10;}

    if(dy<2){ dy = 1;}
    else if (dy<3){ dy = 2;}
    else if (dy<5){dy = 2.5;}
    else {dy = 5;}

    dy *=factor;

    ctx.lineWidth = xthick;

    for(var x = dx; x<this.xmax; x+=dx)
    {
        ctx.moveTo(x,-1.0*this.height()/40); ctx.lineTo(x,this.height()/40);
        ctx.save();
        ctx.translate(x,-1.0*this.height()/40);
        ctx.scale(xScale,-1.0*yScale);
        ctx.font = "14px sans-serif";
        ctx.fillText(""+x,-0.5*ctx.measureText(""+x).width,10);
        ctx.restore();

    }

    for(var x = -1.0*dx; x>this.xmin; x-=dx)
    {
        ctx.moveTo(x,-1.0*this.height()/40); ctx.lineTo(x,this.height()/40);
        ctx.save();
        ctx.translate(x,-1.0*this.height()/40);
        ctx.scale(xScale,-1.0*yScale);
                ctx.font = "14px sans-serif";
        ctx.fillText(""+x,-0.5*ctx.measureText(""+x).width,10);
        ctx.restore();

    }

    ctx.lineWidth = ythick;
    ctx.font = "14px sans-serif";

    for(var y = dy; y<this.ymax; y+=dy)
    {
        ctx.moveTo(-1.0*this.width()/40.0,y);ctx.lineTo(this.width()/40.0,y);
        ctx.save();
        ctx.translate(-1.0*this.width()/40.0,y);
        ctx.scale(xScale,-1.0*yScale);
                ctx.font = "14px sans-serif";
        ctx.fillText(""+y,-5-ctx.measureText(""+y).width,5);
        ctx.restore();

    }
    for(var y = -1.0*dy; y>this.ymin; y-=dy)
    {
        ctx.moveTo(-1.0*this.width()/40.0,y);ctx.lineTo(this.width()/40.0,y);
        ctx.save();
        ctx.translate(-1.0*this.width()/40.0,y);
        ctx.scale(xScale,-1.0*yScale);
                ctx.font = "14px sans-serif";
        ctx.fillText(""+y,-5-ctx.measureText(""+y).width,5);
        ctx.restore();

    }
    ctx.closePath();
    ctx.stroke();

    // This draws all of the objects that have been added to the Axes.

    $j.each(this.objects,function(index,value) { value.draw(ctx); });

    ctx.restore();


}


Axes.prototype.toSVG = function(dl)
{
   var ax = createSVGElement("g");
   // put transparent rectangle behind axes to make dragging easier

    var r1 = createSVGElement("rect");
    r1.setAttributeNS(null,"x",-(0.05*this.width()));
    r1.setAttributeNS(null,"y",this.ymin);
    r1.setAttributeNS(null,"width",0.1*this.width());
    r1.setAttributeNS(null,"height",this.height());
    r1.setAttributeNS(null,"opacity",0);
    ax.appendChild(r1);

    var r2 = createSVGElement("rect");
    r2.setAttributeNS(null,"x",this.xmin);
    r2.setAttributeNS(null,"y",-0.05*this.height());
    r2.setAttributeNS(null,"width",this.width());
    r2.setAttributeNS(null,"height",0.1*this.height());
    r2.setAttributeNS(null,"opacity",0);
    ax.appendChild(r2);



    var drawLabels = (dl == undefined)? true : dl;


    var vert = (new LineSegment(0,this.ymin,0,this.ymax)).toSVG();
    var horiz = (new LineSegment(this.xmin,0,this.xmax,0)).toSVG();
    vert.setAttribute("id","xaxis");
    horiz.setAttribute("id","yaxis");

    ax.setAttribute("id","axes");
    ax.setAttributeNS(null,"transform","scale(1," + this.aspectRatio + ")");
    ax.appendChild(vert);
    ax.appendChild(horiz);




    var dx = this.width()/10.0;
    var factor = 1;
    while (dx<1) {  dx *=10; factor*=0.1; }
    while(dx>10) {  dx *= 0.1; factor*=10;}

    if(dx<2){ dx = 1;}
    else if (dx<3){ dx = 2;}
    else if (dx<5){ dx = 2.5;}
    else {dx = 5;}

    dx *=factor;

    var dy = this.height()/10.0*this.aspectRatio;
    factor = 1;
    while (dy<1) {  dy *=10; factor*=0.1; }
    while(dy>10) {  dy *= 0.1; factor*=10;}

    if(dy<2){ dy = 1;}
    else if (dy<3){ dy = 2;}
    else if (dy<5){dy = 2.5;}
    else {dy = 5;}

    dy *=factor;

    var tickWidth = 5;

    vert.setAttributeNS(null,"stroke-width", dy*0.05*this.aspectRatio);
    horiz.setAttributeNS(null,"stroke-width", dy*0.05);

    var scaleStr = "scale(1," + (-1/this.aspectRatio) + ")";

    for(var x = dx; x<this.xmax; x+=dx)
    {
        var tick = (new LineSegment(x,-0.25*dy,x,0.25*dy)).toSVG();
        tick.setAttributeNS(null,"stroke-width", dx*0.05);
        ax.appendChild(tick);

                var g2 = createSVGElement("g");
        g2.setAttributeNS(null,"transform","translate(" + (x) + "," + (-0.5*dy)
            + ") scale(" +  (this.width()/width) + ")");

        var t = createSVGElement("text");
        t.appendChild(document.createTextNode(x.toFixed(2)));
        t.setAttributeNS(null,"font-size","12");
        t.setAttributeNS(null,"transform",scaleStr);
        g2.appendChild(t);
        ax.appendChild(g2);

        //if (drawLabels){  this.addLabel(new Point(x,0),""+x); }
    }
    for(var x = -dx; x>this.xmin; x-=dx)
    {
       var tick = (new LineSegment(x,-0.25*dy,x,0.25*dy)).toSVG();
       tick.setAttributeNS(null,"stroke-width", dx*0.05);
        ax.appendChild(tick);

         var g2 = createSVGElement("g");
        g2.setAttributeNS(null,"transform","translate(" + (x) + "," + (-0.5*dy)
            + ") scale(" +  (this.width()/width) + ")");

        var t = createSVGElement("text");
        t.appendChild(document.createTextNode(x.toFixed(2)));
        t.setAttributeNS(null,"font-size","12");
        t.setAttributeNS(null,"transform",scaleStr);
        g2.appendChild(t);
        ax.appendChild(g2);
    }





    for(var y = dy; y<this.ymax; y+=dy)
    {
        var tick = (new LineSegment(-0.25*dx,y,0.25*dx,y)).toSVG();
        tick.setAttributeNS(null,"stroke-width", dy*0.1/this.aspectRatio);
        ax.appendChild(tick);

        var g2 = createSVGElement("g");
        g2.setAttributeNS(null,"transform","translate(" + (-dx) + "," + (y)
            + ") scale(" +  (this.width()/width) + ")");
        var t = createSVGElement("text");
        t.appendChild(document.createTextNode(y.toFixed(2)));
        //t.setAttributeNS(null,"x",-dx);
        //t.setAttributeNS(null,"y",-y);
        t.setAttributeNS(null,"font-size","12");
        t.setAttributeNS(null,"transform","scale(1,-1)");
        g2.appendChild(t);
        ax.appendChild(g2);
    }
    for(var y = -dy; y>this.ymin; y-=dy)
    {
       var tick = (new LineSegment(-0.25*dx,y,0.25*dx,y)).toSVG();
        tick.setAttributeNS(null,"stroke-width", dy*0.1/this.aspectRatio);
        ax.appendChild(tick);

        var g2 = createSVGElement("g");
        g2.setAttributeNS(null,"transform","translate(" + (-dx) + "," + (y)
            + ") scale(" +  (this.width()/width) + ")");
        var t = createSVGElement("text");
        t.appendChild(document.createTextNode(y.toFixed(2)));
        //t.setAttributeNS(null,"x",-dx);
        //t.setAttributeNS(null,"y",-y);
        t.setAttributeNS(null,"font-size","12");
        t.setAttributeNS(null,"transform","scale(1,-1)");
        g2.appendChild(t);
        ax.appendChild(g2);
    }

    return ax;


}

Axes.prototype.addLabel = function (pt,str)
{

    var newDiv = document.createElement("div");
    var topleft = new Point(this.xmin,this.ymax);
    newDiv.setAttribute("id","textLabel" + this.labelNum);
    newDiv.appendChild(document.createTextNode(str.substring(0,4)));
    newDiv.style.position = "absolute";
    newDiv.style.left= (5 - topleft.Xscr() + pt.Xscr()) + "px";
    newDiv.style.top=(5 + topleft.Yscr() - pt.Yscr()) + "px";
    newDiv.style.fontSize="10px";
    this.labels.push(newDiv);
    this.labelNum++;

    this.container.appendChild(newDiv);
}

Axes.prototype.clearLabels = function()
{
    var cont = document.getElementById("canvasContainer");
    for(var i = 0; i < this.labels.length; i++)
    {
        cont.removeChild(this.labels[i]);
    }
    this.labels = new Array();
    this.lableNum=0;
}


