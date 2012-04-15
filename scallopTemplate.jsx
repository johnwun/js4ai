/////////////////////////////////////////////////////////////////
//Create Scallop Template -- CS, CS2
//>=--------------------------------------
//Run script on selected object, then select both the object and the new scallop template
//then use Illustrators "subtract from shape area" transform to cut out the scallop.
// Works on all shapes, and even on sub-selected points of an object.
//
//currently version only works on single non-compound objects.
// v2 now allows you to choose between drawing a circle around ALL anchor points or just around corner anchors. 
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//////////////////////////////////////////////////////////////////

var docRef= app.activeDocument;
if ( app.documents.length > 0 && activeDocument.selection.length >0 )
{	
	if(activeDocument.selection[0].typename =="PathItem" ){
		var sel = activeDocument.selection[0];
		
		try{
			var cropGroup = app.activeDocument.groupItems.add();
			cropGroup.name= "scallops";
			var ci_r  = prompt("Scallop Radius:",12);
             var dif = ci_r/2;
             var selectAll = confirm("Scallop corners only?");
			var adsspp = activeDocument.selection[0].selectedPathPoints;
			var adssppLen = adsspp.length;
			
			for (var x = 0;x<adssppLen;x++){
				if(adsspp[x].pointType != PointType.SMOOTH || selectAll == false){
					var ellipse = cropGroup.pathItems.ellipse(adsspp[x].anchor[1]+dif, adsspp[x].anchor[0]-dif, ci_r, ci_r, false, true );
				}
			}
		}
		catch(e) {
			alert("Problem Found:\n"+e);
		}	
} 
else{
alert("Please select a single non-compound path only.");
}
}
else{
alert("Please select a single non-compound pathv.");
}
 