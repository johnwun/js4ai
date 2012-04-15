/////////////////////////////////////////////////////////////////
//Zoom and Center to Selection v2. -- CS, CS2
//>=--------------------------------------
//
//	Zooms active view to selected object(s).
//  
//  New in v.2:
//  If nothing is selected; sets view to 100% at current location.
//
//	Simple but REALLY cool!
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

if ( documents.length > 0)
{
	if(activeDocument.selection.length >0){
		mySelection = activeDocument.selection;
		//if object is a (collection of) object(s) not a text field.
		if (mySelection instanceof Array) {
			//initialize vars
			initBounds = mySelection[0].visibleBounds;
			ul_x = initBounds[0];
			ul_y = initBounds[1];
			lr_x = initBounds[2];
			lr_y = initBounds[3];
			//check rest of group if any
			for (i=1; i<mySelection.length; i++) {
			groupBounds = mySelection[i].visibleBounds;
			if (groupBounds[0]<ul_x){ul_x=groupBounds[0]}
			if (groupBounds[1]>ul_y){ul_y=groupBounds[1]}
			if (groupBounds[2]>lr_x){lr_x=groupBounds[2]}
			if (groupBounds[3]<lr_y){lr_y=groupBounds[3]}
			}

 
		}
	 
		//get x,y/x,y Matrix for 100% view
 
		activeDocument.views[0].zoom = 1;
		ScreenSize = activeDocument.views[0].bounds;
		ScreenWidth= ScreenSize[2] - ScreenSize[0];
		ScreenHeight=ScreenSize[1] - ScreenSize[3];
		screenProportion =ScreenHeight/ScreenWidth;

		//Determine upperLeft position of object(s)
		 cntrPos = [ul_x,ul_y];
		 
			 //mySelection[0].position;
		//cntrPos[0] += (mySelection[0].width /2);
		//cntrPos[1] -= (mySelection[0].height /2);
		//offset by half width and height
		mySelWidth=(lr_x-ul_x);
		mySelHeight=(ul_y-lr_y);
		cntrPos[0] = ul_x + (mySelWidth/2);
		cntrPos[1] = ul_y - (mySelHeight/2);
		//alert("ul point is "+cntrPos);
		//center to screen to the object
		activeDocument.views[0].centerPoint =  cntrPos;
		//alert("objWidth="+mySelection[0].width+", actualWidth="+ActualWidth);
		//alert("objHeight="+mySelection[0].height+", actualHeight="+ActualHeight);

		//set zoom for height and width
		zoomFactorW = ScreenWidth/mySelWidth;
		zoomFactorH = ScreenHeight/mySelHeight;
		//alert("zoomFactorW = "+zoomFactorW+"\r zoomFactorH = "+zoomFactorH);

		//decide which proportion is larger...
	if((mySelWidth*screenProportion) >= mySelHeight){
		zF = zoomFactorW;
		//alert("zoomFactorW = "+zoomFactorW);
	}else{
		zF = zoomFactorH;
		 //alert("zoomFactorH = "+zoomFactorH);
	}

	//and scale to that proportion minus a little bit.
	activeDocument.views[0].zoom = zF *.85;
 
	}else{
		//alert("Please select an object on the page.");
		activeDocument.activeView.zoom=1;
	}
}