/////////////////////////////////////////////////////////////////
//Organify 2.0 -- CS, CS2
//>=--------------------------------------
//Randomizes all selected anchors by a selected number of points.
//
//  Enter small numbers to make objects look hand drawn.
//  Enter larger numbers to make objects look organic.
//  Enter even larger numbers to distort beyond recognition.
//
// V.2 now offers a choice for randomizing 'Anchors Only', 'Control Handles Only' or both.
//  <a href='http://www.wundes.com/js4ai/images/organifyDetail.gif'>(click here to view sample image.)</a>
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var organify_options = {
    move_handles: false,
    move_anchors: true,
    stray_distance: 30 /*in points */,
    canceled: false,
    
    create_dialog: function()
    {
        var rsrc = "dialog { text:'Organify', " + 
            "radioPanel: Panel { orientation:'column', alignment:'fill', alignChildren:'left',\
                text: 'Control Point Options', \
                anchorsRb: RadioButton { text:'Anchors Only (Spikey)', value:true  }, \
                handlesRb: RadioButton { text:'Handles Only (Bulbous)'}, \
                bothRb: RadioButton { text:'Anchors and Handles (Chaotic)' } \
              }, \
              stray: Group { orientation: 'row', \
                label: StaticText { text:'Amount to stray (in points):' }, \
                amount: EditText { text:'30', characters: 10 } \
                }, \
              buttons: Group { orientation: 'row', alignment:'right', \
                cancelBtn:   Button { text:'cancel', properties:{name:'cancel'} }, \
                organifyBtn: Button { text:'organify', properties:{name:'ok'}  } \
                } \
              }";
         this.win = new Window(rsrc);
         w = this.win;
         this.win.buttons.cancelBtn.onClick   = function () { w.close(-1); };
         this.win.buttons.organifyBtn.onClick = function () { w.close(1); };
    },
    get_options_from_user: function()
    {
        this.create_dialog();
        if (this.win.show() < 0)
        {
            this.canceled = true;
        }
        this.get_options_from_window();
        this.win = null;
    },
    get_options_from_window: function()
    {
        if (this.win.radioPanel.anchorsRb.value)
        {
            this.move_anchors = true;
            this.move_handles = false;
        }
        else if (this.win.radioPanel.handlesRb.value)
        {
            this.move_anchors = false;
            this.move_handles = true;
        }
        else // both
        {
            this.move_anchors = true;
            this.move_handles = true;
        }
        stray_distance = parseFloat(this.win.stray.amount.text);
    }
};



if ( app.documents.length > 0)
{	
    organify_options.get_options_from_user();
    if (!organify_options.canceled)
    {
        var sel = activeDocument.selection;
        var max = sel.length;

        for(var cpi=0;cpi<max;cpi++)
        {
            currentObj = sel[cpi];
            testObj(currentObj, organify_options);
        }
    }
}
		 
function tweakPath(obj, options){
		try{	//activeDocument.Selection.SelectedPathPoints		 
			var adsspp = obj.selectedPathPoints;
			var adssppLen = adsspp.length;
			for (var x = 0;x<adssppLen;x++){
			var spp = obj.selectedPathPoints[x];
			if(options.move_anchors)
             {
			//Randomizes Anchors
				va = spp.anchor[0]+((Math.random()*options.stray_distance)-(options.stray_distance/2));
				vb = spp.anchor[1]+((Math.random()*options.stray_distance)-(options.stray_distance/2))
				spp.anchor = Array(va,vb);
			}

			//Randomizes handles too
			 if(options.move_handles){
				la = spp.leftDirection[0]+((Math.random()*options.stray_distance)-(options.stray_distance/2));
				lb = spp.leftDirection[1]+((Math.random()*options.stray_distance)-(options.stray_distance/2))
				spp.leftDirection = Array(la,lb);
				 
				ra = spp.rightDirection[0]+((Math.random()*options.stray_distance)-(options.stray_distance/2));
				rb = spp.rightDirection[1]+((Math.random()*options.stray_distance)-(options.stray_distance/2))
				spp.rightDirection = Array(ra,rb);
			 }
			}
		}
		catch(e) {
			alert("Problem Found:\n"+e);
		}
}
function testObj(curr, options){
		if(curr.typename =="PathItem" ){
			tweakPath(curr, options);
		} else if(curr.typename =="GroupItem"){
			//can't tweak grouped items yet.
			//activeDocument.selection[0]==activeDocument.groupItems[0]
			//activeDocument.groupItems[0].pathItems
			//activeDocument.selection[0].groupItems[0].pathItems[0]
			//
			//hit all path items in group...
			var gpMax = curr.pathItems.length;
			for(var gpi=0;gpi<gpMax;gpi++){
				tweakPath(curr.pathItems[gpi], options);
			}
			//hit all group items in group...
			var grMax = curr.groupItems.length
			for(var gri=0;gri<grMax;gri++){
				testObj(curr.groupItems[gri], options);
			}
		}
		else{
			//aint nothing to select.
		}
}
