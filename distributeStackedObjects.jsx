/////////////////////////////////////////////////////////////////
// Distribute Stacked Objects v1.1(and Center them too.)  -- CS,CS5
//>=--------------------------------------
// So you just imported 20 eps files and illustrator stacks them on top of each other. 
// You want to see them spread out a bit? Run this script.  
//
// This script distributes and centers all selected objects.  
// Each object's position is determined by it's stacking order in the layer palette.
// To adjust an objects position in the layout, 
// manually move the object's stacking order in the layer palette.
// The top object (in the layer) is always placed first.
//
// When the script is run, a prompt appears, 
// and the user can define a custom padding value for spacing the grid. 
// The script then auto-distributes objects, and centers them on the page.  
//
// This script was designed for creating artboards and for easy viewing 
// of a stack of imported artwork, but it should work with everything. 
//
// v1.1:Fixed a bug that crashed the script.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var doc = activeDocument;
var selx = doc.selection;
if(selx.length ==0){alert("You must select objects to distribute.");}
else{makeGrid(selx);}


function makeGrid(sel)
{
    var objectsCentered = true;
    if(objectsCentered){
         var newGroup = app.activeDocument.groupItems.add();
    }
   
    var maxW = maxH = currentX = currentY  = maxRowH = 0;
    var padding = "not valid";
    while (isNaN(padding)){
        padding = Number(prompt("How much padding between objects?","10"));
    }
	var layout ='g';
	layout = prompt('(H)orizontal, (V)ertical, or (G)rid?\nIf you don\'t care and want to skip this dialog, comment out line 44)','G'); 
    var gridCols =  (layout.toLowerCase() == "h") ? sel.length : 1;
           gridCols = (layout.toLowerCase() == "g" )  ?  Math.round(Math.sqrt(sel.length))  : gridCols; 
    for(var e=0, slen=sel.length;e<slen;e++)
    {

        if(objectsCentered){
                // ::Add to group
                sel[e].moveToBeginning( newGroup );
        }

        //   :::SET POSITIONS:::
        sel[e].top = currentY;
        sel[e].left = currentX;
        
        //  :::DEFINE X POSITION:::
        currentX += (sel[e].width + padding);
     
        var itembottom = (sel[e].top-sel[e].height);
        maxRowH = itembottom <  maxRowH ? itembottom : maxRowH;
        
        if((e % gridCols) == (gridCols - 1))
        { 
            currentX = 0;    
            maxH =  (maxRowH);
            
            //  :::DEFINE Y POSITION:::
            currentY  = maxH-padding; 
            maxRowH=0;
        }
    }



    if(objectsCentered){ 
            newGroup.top = -( doc.height/2) + newGroup.height/2;
            newGroup.left = (doc.width/2)-newGroup.width/2;

            //   :::UNGROUP:::
            var sLen=sel.length;
            while(sLen--)
            {
                sel[sLen].moveToBeginning( doc.activeLayer );
            }
    }
}