/////////////////////////////////////////////////////////////////
//Add Highlight And Shadow Swatches v.1 -- CS, CS2
//>=--------------------------------------
// A simple script for Animators. Takes current fill color from color pallate. 
// a prompt will ask you to name the color, then it adds it to the swatch palate, 
// along with the highlight and shadow for that color.
//
// feel free to tweak the values to get whatever percentages work best for you.
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var docRef= app.activeDocument;
if ( app.documents.length > 0 )
{	
		//set RGB values here
	RGBdarkenBy = -35;
	RGBlightenBy = 75;
		//set CMYK values here
	CMYKdarkenBy = 10;
	CMYKlightenBy = -18;
	defName = "";
	nameMsg = "Enter a name for the selected color:\n";

	//get Color Space Name
	t=[];
	t = ((activeDocument.documentColorSpace)+"").split(".")
	colSpace = t[1];

	try{
			var fill = docRef.defaultFillColor;
			if(docRef.defaultFilled == false){
			throw ("Sorry, no default fill found.\nPlease select a fill color.");
			
			}
			if (fill.typename != "SpotColor" && fill.typename != "RGBColor" && fill.typename != "CMYKColor") 
			{
				throw("Sorry, "+fill.typename+" Objects are not currently supported.\nPlease convert the color to "+colSpace+".");
			}
			
			if(fill.typename == "SpotColor"){
				nameMsg += "***Warning: You have selected a spot color.***\nNew swatches will be converted to the current documents default color space.";
				fill = docRef.defaultFillColor.spot.color;
				defName = colSpace+"("+docRef.defaultFillColor.spot.name+")";
			}				
				if(fill.typename == "RGBColor"){
					fr = roundHack(fill.red);
					fg = roundHack(fill.green);
					fb = roundHack(fill.blue);
					if (defName.length <1 )
					{
						defName = "r="+ fr+" g="+fg + " b="+fb;
					}
					colName = getName();
					//If you want to add more RGB color variations, add them here:
					makeColor([fr,fg,fb],RGBlightenBy,colName+" Highlight");
					makeColor([fr,fg,fb],0,colName);
					makeColor([fr,fg,fb],RGBdarkenBy,colName+" Shadow");
				} else if(fill.typename == "CMYKColor"){
					fc = roundHack(fill.cyan);
					fm = roundHack(fill.magenta);
					fy = roundHack(fill.yellow);
					fk = roundHack(fill.black);
					if (defName.length <1)
					{
						defName = "c="+ fc+" m="+fm + " y="+fy+ " k="+fk;
					}
					colName = getName();
					//If you want to add more CMYK color variations, add them here:
					makeColor([fc,fm,fy,fk],CMYKlightenBy,colName+" Highlight");
					makeColor([fc,fm,fy,fk],0,colName);
					makeColor([fc,fm,fy,fk],CMYKdarkenBy,colName+" Shadow");	
				} 
			 
		}
	catch(e) {
		alert("Problem Found:\n"+e);
	}

}
function getName(){
	x = prompt(nameMsg,defName);
	if (x == null)
	{
		throw "No name value entered";
	}
	return x;
	}
function makeColor(arr,offset,cname){
	for (each in arr)
	{
		arr[each] = parseInt(arr[each]);
		arr[each] += offset;
	}
	
	if(arr.length == 3){
	//RGB
			var nc = new RGBColor();
				nc.red = limit(arr[0],255);
				nc.green = limit(arr[1],255);
				nc.blue = limit(arr[2],255);
					
	} else if (arr.length == 4){
	//CMYK
			var nc = new CMYKColor();
				nc.cyan = limit(arr[0],100);
				nc.magenta = limit(arr[1],100);
				nc.yellow = limit(arr[2],100);
				nc.black = limit(arr[3],100);

	}  
		var col = docRef.swatches.add();
			col.name = cname;
			col.color = nc;
}
function roundHack(n){
	//make it a string
	n = n +"" ;
	ta = [];
	ta = n.split(".");
	return ta[0];
}
function limit(num,max){
	if (num <= 0)
		{
			return 0;	
		}
		else if(num > max )
		{
			return max;
		}	
		else {
			return num;
		}
}