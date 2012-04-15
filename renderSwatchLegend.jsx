/////////////////////////////////////////////////////////////////
// Render Swatch Legend v1.1 -- CS, CS2, CS3, CS4, CS5
//>=--------------------------------------
//
//  This script will generate a legend of rectangles for every swatch in the main swatches palette.
//  You can configure spacing and value display by configuring the variables at the top
//  of the script. 
//   update: v1.1 now tests color brightness and renders a white label if the color is dark.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
// copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//
////////////////////////////////////////////////////////////////// 
    doc = activeDocument,
    swatches = doc.swatches,
    cols = 4,
    displayAs = "CMYKColor",  //or "RGBColor"
    rectRef=null,
    textRectRef=null,
    textRef=null,
    rgbColor=null,
    w=150;
    h=100,
    h_pad = 10,
    v_pad = 10,
    t_h_pad = 10,
    t_v_pad = 10,
    x=null,
    y=null,
    black = new GrayColor(),
    white = new GrayColor()
    ;

    black.gray = 100;
    white.gray = 0;

activeDocument.layers[0].locked= false;
var newGroup = doc.groupItems.add();
newGroup.name = "NewGroup";
newGroup.move( doc, ElementPlacement.PLACEATBEGINNING );

for(var c=0,len=swatches.length;c<len;c++)
{
        var swatchGroup = doc.groupItems.add();
        swatchGroup.name = swatches[c].name;
       
        x= (w+h_pad)*(c% cols);
        y=(h+v_pad)*(Math.floor((c+.01)/cols))*-1 ;
        rectRef = doc.pathItems.rectangle(y,x, w,h);
        rgbColor = swatches[c].color;
        rectRef.fillColor = rgbColor;
        textRectRef =  doc.pathItems.rectangle(y- t_v_pad,x+ t_h_pad, w-(2*t_h_pad),h-(2*t_v_pad));
        textRef = doc.textFrames.areaText(textRectRef);
        textRef.contents = swatches[c].name+ "\r" + getColorValues(swatches[c].color) ;
        textRef.textRange.fillColor = is_dark(swatches[c].color)? white : black;
        //
        rectRef.move( swatchGroup, ElementPlacement.PLACEATBEGINNING );     
        textRef.move( swatchGroup, ElementPlacement.PLACEATBEGINNING );
        swatchGroup.move( newGroup, ElementPlacement.PLACEATEND );
}

function getColorValues(color)
{
        if(color.typename)
        {
            switch(color.typename)
            {
                case "CMYKColor":
                    if(displayAs == "CMYKColor"){
                        return ([Math.floor(color.cyan),Math.floor(color.magenta),Math.floor(color.yellow),Math.floor(color.black)]);}
                    else
                    {
                        color.typename="RGBColor";
                        return  [Math.floor(color.red),Math.floor(color.green),Math.floor(color.blue)] ;
                       
                    }
                case "RGBColor":
                   
                   if(displayAs == "CMYKColor"){
                        return rgb2cmyk(Math.floor(color.red),Math.floor(color.green),Math.floor(color.blue));
                   }else
                    {
                        return  [Math.floor(color.red),Math.floor(color.green),Math.floor(color.blue)] ;
                    }
                case "GrayColor":
                    if(displayAs == "CMYKColor"){
                        return rgb2cmyk(Math.floor(color.gray),Math.floor(color.gray),Math.floor(color.gray));
                    }else{
                        return [Math.floor(color.gray),Math.floor(color.gray),Math.floor(color.gray)];
                    }
                case "SpotColor":
                    return getColorValues(color.spot.color);
            }    
        }
    return "Non Standard Color Type";
}
function rgb2cmyk (r,g,b) {
 var computedC = 0;
 var computedM = 0;
 var computedY = 0;
 var computedK = 0;

 //remove spaces from input RGB values, convert to int
 var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
 var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
 var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

 if ( r==null || g==null || b==null ||
     isNaN(r) || isNaN(g)|| isNaN(b) )
 {
   alert ('Please enter numeric RGB values!');
   return;
 }
 if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
   alert ('RGB values must be in the range 0 to 255.');
   return;
 }

 // BLACK
 if (r==0 && g==0 && b==0) {
  computedK = 1;
  return [0,0,0,1];
 }

 computedC = 1 - (r/255);
 computedM = 1 - (g/255);
 computedY = 1 - (b/255);

 var minCMY = Math.min(computedC,
              Math.min(computedM,computedY));
 computedC = (computedC - minCMY) / (1 - minCMY) ;
 computedM = (computedM - minCMY) / (1 - minCMY) ;
 computedY = (computedY - minCMY) / (1 - minCMY) ;
 computedK = minCMY;

 return [Math.floor(computedC*100),Math.floor(computedM*100),Math.floor(computedY*100),Math.floor(computedK*100)];
}

function is_dark(color){
       if(color.typename)
        {
            switch(color.typename)
            {
                case "CMYKColor":
                    return (color.black>50 || (color.cyan>50 &&  color.magenta>50)) ? true : false;
                case "RGBColor":
                    return (color.red<100  && color.green<100 ) ? true : false;
                case "GrayColor":
                    return color.gray > 50 ? true : false;
                case "SpotColor":
                    return is_dark(color.spot.color);
                
                return false;
            }
        }
}