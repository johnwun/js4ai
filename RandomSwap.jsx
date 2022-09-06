var doc=app.activeDocument;
var sym = doc.symbols;  

if(doc.selection.length>0)
{
	try{
		for(i=doc.selection.length-1;i>=0;i--)
		{
			var iObj = doc.selection[i];
			
			var iObjL= iObj.left;
			var iObjW = iObj.width;
			var iObjT = iObj.top;
			var iObjH = iObj.height; 
			var currDotx = iObjL; //+ (iObjW/2);
			var currDoty = iObjT;//+ (iObjH/2);
			var currDot=doc.symbolItems.add(sym[Math.floor(Math.random() * sym.length)]);
			currDot.height = iObjH;
			currDot.width = iObj.width;
			currDot.position=[currDotx,currDoty];
			// iObj.remove();
		}
	}
	catch(e)
	{
		alert("Unknown error occured.");
	}
}
else
{
	alert("There is no selection");
}