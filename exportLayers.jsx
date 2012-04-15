/////////////////////////////////////////////////////////////////
// Batch Export Unlocked Layers v2 -- CS5
//>=--------------------------------------
//	This script will generate a separate raster image for every UNLOCKED layer in your .ai file.  
// 
//	Locked images will be left as is.
//	To <b>hide</b> any layer; 
//	Lock it, and hide it on the Layers palate before running this script.
//	
//	To <b>include</b> a layer in every image:
//	Lock it, and make sure it's visible before running this script.
//
//	This script auto-generates a production script into the image export directory,
//	so if you ever need to re-run the script, just re-open all the same source files, 
//	double click the .jsx file in your image export directory, and it will re-export
//  all the images with the same settings.
//  MUCH thanks to Chris Gebab for help brainstorming
//  a hack to get this working as a palette in illustrator.
//  For more info, see my <a href="http://js4ai.blogspot.com/2010/06/export-layers-as-images.html">blog</a>
// update: v2 adds ability to scale the exported images.
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

#target illustrator
try{
#targetengine estoolkit
} catch(e)
{
    //don't care...    
}

var desc1 =
    "\nThis script will generate a separate raster image for every UNLOCKED layer in your file.\n\n"+
   "Locked images will be left as is, so if you want to hide a layer, lock it, and hide it in the Layers palate.\n\n"+
 "If you want a locked layer to be included in every layer export, just make sure it's visible when you run this script.";  
 
var fname = app.activeDocument.name;
fname = fname.substr(0,fname.lastIndexOf("."));

var fileNameConst = fname;
var filename = fileNameConst;
var exampleSuffix = "01";
var savePrompt = "(You MUST enter a Save Location)";
var savePromptFlag = 0;
var WINDOW_title = "Raster Image Batch Exporter";
var ProcessTitle = "Process Files:";
var FileNameTitle = "Exported File Names:";
var FileTypeTitle = "Exported File Type:";
var SaveTitle = "Save Location:";
var AA_helpTip="Soften image edges?"; 
var CLIP_helpTip="Crops images to the current artBoard.";
var JPG_QUAL_helpTip="Higher Quality == Larger Filesize. Usually 80% is a good compromise.";
var TRANS_helpTip="Should the background be transparent?";
var PNG24_helpTip="256 Level Alpha Mask, non-lossy format";
var scale_helpTip="Adjust the scale of the output as a percentage. 100 is normal.";
var saveLocation = new Folder();

var filesBool = false;
var baseFilename = "";
var separator = "_";
var layerNameBool = true;
var exportFileType = "JPG";
var img_aa = true;
var img_clip=true;
var jpg_quality = 85;
var img_trans = true;
var img_scale = 100;
var save_location = "~";




function BatchExportUI() 
{

	 /**
        Maintain reference to the window we created
	  @type Window
    */
   this.windowRef = null;
}

/**
 Functional part of this snippet.  Creates window with different alignment settings.
 @return boolean True if the snippet ran as expected, false if otherwise. For this snippet,
 there is at present no code path that can return false, as the snippet can run in any app
 that supports ScriptUI.
 @type boolean
*/
//BatchExportUI.prototype.run = function() 
function drawDialog()
{

	var res1 =
		"window {																				\
			properties:{ closeButton:true, maximizeButton:false, opacity:.5,				\
				minimizeButton:false, resizeable:false },						\
			orientation:'column', spacing:12, margins:13,							\
			alignChildren:['fill','top'],														\
			description: StaticText { properties:{ multiline:true },			\
				characters:40},																\
			separator: Panel { preferredSize:[20, 0] },							\
			p1: Panel {																		\
				orientation:'row', spacing:25, text:'"+ProcessTitle+"',										\
				x1: RadioButton { text:'Current File Only', alignment:['center','center'],value:true },	\
				x2: RadioButton  { text:'All Open Files', alignment:['center','center'] },		\
			},																						\
             p2: Panel {																		\
				orientation:'column', spacing:15, text:'"+FileNameTitle+"',										\
                    g1:Group{\
                            orientation:'row', spacing:6,	\
                            x1: StaticText { text:'Base', alignment:['center','center']},	\
                            x2: EditText  { text:'"+filename+"', characters:36, alignment:['center','center'] },		\
                    },\
                    g2:Group{\
                            orientation:'row', spacing:10, 	\
                            x1: StaticText { text:'separator', alignment:['center','center']},	\
                            x2: EditText  { text:'_',characters:1, alignment:['left','center'] },		\
                            r1: RadioButton { text:'Numeric suffix',value:true, alignment:['right','center'] }, \
                            r2: RadioButton  { text:'LayerName suffix', alignment:['right','center'] },	\
                    },\
                    g3:Group{    \
                           orientation:'row', spacing:6, alignment:'left',\
                            x1: StaticText { text:'Example:', enabled:false,  alignment:['left','center']},	\
                            x2: EditText  { text:'"+filename+"_01.jpg',  characters:36, enabled:false,alignment:['left','center']},	\
                    },\
			},																						\
			p3: Panel {																		\
				   orientation:'column', spacing:2,text:'"+FileTypeTitle+"',										\
                     d1: DropDownList { preferredSize: [100, 20],  alignment:'right' },			\
                     g1:Group{orientation:'stack', alignment:'right',\
                             JPG:Group{    \
                                       orientation:'column', spacing:8,\
                                        antiAliasing:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'antiAliasing:',helpTip:'"+AA_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true,helpTip:'"+AA_helpTip+"', alignment:['right','center']},	\
                                        },\
                                        artBoardClipping:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'artBoardClipping:', helpTip:'"+CLIP_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true, helpTip:'"+CLIP_helpTip+"', alignment:['right','center']},	\
                                         },\
                                        qualitySetting:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'qualitySetting:', helpTip:'"+JPG_QUAL_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            s1: Slider {value:"+85+",minvalue:0,maxvalue:100, helpTip:'"+JPG_QUAL_helpTip+"', alignment:['right','center']},	\
                                            x2: EditText  { text:'"+85+"', characters:2, alignment:['right','center'] },		\
                                        },\
                                        scaleSetting:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'scaleSetting (in %):', helpTip:'"+scale_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            s1: Slider {value:"+100+",minvalue:1,maxvalue:700, helpTip:'"+scale_helpTip+"', alignment:['right','center']},	\
                                            x2: EditText  { text:'"+100+"', characters:3, alignment:['right','center'] },		\
                                        },\
                                }\
                              GIF:Group{       \
                                      orientation:'column', spacing:8,  alignment:'right' , visible:false,\
                                        antiAliasing:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'antiAliasing:',helpTip:'"+AA_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true,helpTip:'"+AA_helpTip+"', alignment:['right','center']},	\
                                        },\
                                        artBoardClipping:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'artBoardClipping:', helpTip:'"+CLIP_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true, helpTip:'"+CLIP_helpTip+"', alignment:['right','center']},	\
                                         },\
                                        transparency:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'transparency:', helpTip:'"+TRANS_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true, helpTip:'"+TRANS_helpTip+"', alignment:['right','center']},	\
                                        },\
                                        scaleSetting:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'scaleSetting (in %):', helpTip:'"+scale_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            s1: Slider {value:"+100+",minvalue:1,maxvalue:700, helpTip:'"+scale_helpTip+"', alignment:['right','center']},	\
                                            x2: EditText  { text:'"+100+"', characters:3, alignment:['right','center'] },		\
                                        },\
                                }\
                               PNG:Group{    \
                                      orientation:'column', spacing:8,  alignment:'right' , visible:false,\
                                        antiAliasing:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'antiAliasing:',helpTip:'"+AA_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true,helpTip:'"+AA_helpTip+"', alignment:['right','center']},	\
                                        },\
                                        artBoardClipping:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'artBoardClipping:', helpTip:'"+CLIP_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true, helpTip:'"+CLIP_helpTip+"', alignment:['right','center']},	\
                                         },\
                                        transparency:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'transparency:', helpTip:'"+TRANS_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            x2: Checkbox {value:true, helpTip:'"+TRANS_helpTip+"', alignment:['right','center']},	\
                                        },\
                                        scaleSetting:Group{    \
                                            orientation:'row', spacing:8, alignment:'right',\
                                            x1: StaticText { text:'scaleSetting (in %):', helpTip:'"+scale_helpTip+"', enabled:true,    alignment:['right','center']},	\
                                            s1: Slider {value:"+100+",minvalue:1,maxvalue:700, helpTip:'"+scale_helpTip+"', alignment:['right','center']},	\
                                            x2: EditText  { text:'"+100+"', characters:3, alignment:['right','center'] },		\
                                        },\
                                }\
                            },\
			},																						\
			p4: Panel {																		\
				orientation:'row', spacing:2,text:'"+SaveTitle+"',											\
				x1: EditText { text:'"+savePrompt+"',characters:30 , alignment:['left','center'] },			\
                  b1: Button { text:'Browse', alignment:['center','center'] },			\
			},																						\
			buttons: Group {																		\
				orientation:'row', spacing:15,											\
				cancelBtn: Button { text:'Cancel', alignment:['center','center'] },			\
				okBtn: Button { text:'OK', enabled:false, alignment:['center','center'] },				\
			},																						\
		}";
 


    
    //enabled:false,
    //  NOTE: Creates window here.  Array determines position not size.
	var win = demo (WINDOW_title, desc1, res1, [550, 170]);
    win.center();

// Add list items to the drop-down list
	var item = win.p3.d1.add ('item', 'JPG');
                item.group = win.p3.g1.JPG;
           item = win.p3.d1.add ('item', 'GIF');
                item.group = win.p3.g1.GIF;
           item = win.p3.d1.add ('item', 'PNG');
                item.group = win.p3.g1.PNG;
                 
                // Not implemented.  You can if you want.
                /*
           item = win.p3.d1.add ('item', 'SVG');
                item.group = win.p3.g1.SVG;
            item = win.p3.d1.add ('item', 'FLA');
                item.group = win.p3.g1.FLA;     
             */
           win.p3.d1.selection = 0;
    
    
 	// Define button behavior
        win.buttons.okBtn.onClick = function () {
           
           

              exportValues();
           
            //doIt();
            var myFile = new File(save_location+"/Export"+exportFileType+".jsx");
            var content= renderExportScript();
            //alert(content);
            myFile.open("w"); // 'w' overwrites whatever is there.
            myFile.write(content);
            myFile.close();          
              this.parent.parent.close(1);         
                        myFile.execute();
            };
        
        /*
        = function () {
                //alert("click");
                //exportValues();
              this.parent.parent.close(2); 
               // doIt();
                //Now Do the ACTUAL CODE!!!
               
        };
     */
        win.buttons.cancelBtn.onClick = function () {

             this.parent.parent.close(2);

         };

    //Event Listener for JPG Quality Slider:
        win.p3.g1.JPG.qualitySetting.s1.onChange = function(){
                win.p3.g1.JPG.qualitySetting.x2.text = Math.round(this.value);
        }
        win.p3.g1.JPG.qualitySetting.x2.onChange = function(){
                win.p3.g1.JPG.qualitySetting.s1.value = this.text; 
        }    
    
        //Event Listener for JPG scale Slider:
        win.p3.g1.JPG.scaleSetting.s1.onChange = function(){
                win.p3.g1.JPG.scaleSetting.x2.text = Math.round(this.value);
        }
        win.p3.g1.JPG.scaleSetting.x2.onChange = function(){
                win.p3.g1.JPG.scaleSetting.s1.value = this.text; 
        }  
    
            //Event Listener for GIF scale Slider:
        win.p3.g1.GIF.scaleSetting.s1.onChange = function(){
                win.p3.g1.GIF.scaleSetting.x2.text = Math.round(this.value);
        }
        win.p3.g1.GIF.scaleSetting.x2.onChange = function(){
                win.p3.g1.GIF.scaleSetting.s1.value = this.text; 
        }  
                //Event Listener for PNG scale Slider:
        win.p3.g1.PNG.scaleSetting.s1.onChange = function(){
                win.p3.g1.PNG.scaleSetting.x2.text = Math.round(this.value);
        }
        win.p3.g1.PNG.scaleSetting.x2.onChange = function(){
                win.p3.g1.PNG.scaleSetting.s1.value = this.text; 
        }  
           
    
    //Event listener for the dropdown:
    
        win.p3.d1.onChange = function(){
            if (this.selection != null) {
                for (var g = 0; g < this.items.length; g++){
                     this.items[g].group.visible = false; //hide all other groups
                    this.selection.group.visible = true;//show this group
                    
                    }
                updateExampleText();
                //win.p2.g3.x2.text =  this.selection.text;
            }
                
        }    
    //Event listener for the FileName and separator text areas:
        win.p2.g1.x2.onChange = win.p2.g2.x2.onChange =  function(){
                updateExampleText();    
         }
    //Event listener for "Save" textfield
         win.p4.x1.onActivate = function(){
             //clear it the first time;
             if(savePromptFlag==0){
                 savePromptFlag=1;
                win.p4.x1.text='';
              }
            win.buttons.okBtn.enabled=true;     
         }
    
	// Event listener for the radio buttons
        win.p2.g2.r1.onClick = win.p2.g2.r2.onClick = function () {
            var selected = "";
            if(win.p2.g2.r1.value) 
            {
                exampleSuffix = "01";
                updateExampleText();
            }
            else if(win.p2.g2.r2.value) {
                exampleSuffix="layer3"; 
                updateExampleText();
             } 
        }


        win.p4.b1.onClick = function(){
               saveLocation = saveLocation.selectDlg('Where would you like to save your images?');
               if (saveLocation != null){
                    win.p4.x1.text=saveLocation.absoluteURI;
                    win.buttons.okBtn.enabled=true;
                }
        }
 
  
        function updateExampleText(){
            win.p2.g3.x2.text =  win.p2.g1.x2.text+win.p2.g2.x2.text+exampleSuffix+"."+win.p3.d1.selection.text.toLowerCase();
        }
    
	// Creates and shows the windows
        function demo (title, description, resource, ref)
        {
                var w = new Window (resource);
                w.text = title;
                w.description.text =description;
                if (typeof ref.frameBounds != "undefined")
                    w.frameLocation = [ref.frameBounds.left, ref.frameBounds.bottom + 5];
                else
                    w.frameLocation = ref;
                w.show();
                return w;
        }
    
    function  exportValues(){
         
        // alert("Now tie this in to the doIt function.\nLike this:"+ win.p2.g3.x2.text);
            //alert("exporting values");
            filesBool = win.p1.x2.value; 
            save_location = win.p4.x1.text;
            baseFilename = win.p2.g1.x2.text;
            separator = win.p2.g2.x2.text;
            layerNameBool = win.p2.g2.r2.value;
            jpg_quality = win.p3.g1.JPG.qualitySetting.x2.text;
            exportFileType = win.p3.d1.selection.text;
            img_aa =    win.p3.g1[exportFileType].antiAliasing.x2.value;
            img_clip =   win.p3.g1[exportFileType].artBoardClipping.x2.value;
            
            if (exportFileType=="GIF" || exportFileType =="PNG"){
                     img_trans = win.p3.g1[exportFileType].transparency.x2.value;
            }
            img_scale = win.p3.g1[exportFileType].scaleSetting.x2.text;
        
            
     
       // alert("values exported");
       }

    return true;
}
// NON-UI FUNCTION BELOW:
function renderExportScript(){
var newFileBody = " #target illustrator\
//This file was autogenerated by BatchExportUI.jsx from wundes.com\
// it is safe to erase, as it will be recreated the next time exportLayers.jsx is run.\
var fileName = '';\
doIt();\
function doIt(){    \
    // for each layer\
    if("+filesBool+"){\
        var allDocsLen = app.documents.length;\
        while (allDocsLen--){\
            app.documents[app.documents.length-1].activate();\
            redraw();\
            processDocument(app.documents[0]);\
        }\
    }else{\
           processDocument(app.activeDocument);\
    }\
   }\
\
function processDocument(currDoc){\
\
    doc = currDoc;\
    var len = doc.layers.length;\
    var fname = doc.name;\
    fname = fname.substr(0,fname.lastIndexOf(\".\"));\
    fileName = \""+baseFilename+"\" == \""+fileNameConst+"\" ? fname : \""+baseFilename+"\";\
    while (len--){\
        \
           //if layer isn't locked\
        var thisLayer = doc.layers[len];\
        if(thisLayer.locked == false){\
            hideAllUnlocked();\
            thisLayer.visible=true;\
            app.redraw();\
\
\
            var suffix =  "+layerNameBool+" ? thisLayer.name:len;\
            switch(\""+exportFileType+"\")\
            {\
                case \"JPG\":\
                    exportJPG(suffix);\
                    break;\
                case \"GIF\":\
                    exportGIF(suffix);\
                    break;\
                case\"PNG\":\
                    exportPNG(suffix);\
                    break;\
                default:\
                    break;\
                \
            }\
            \
            }\
       }\
}\
function hideAllUnlocked(){\
    var all = doc.layers.length;\
    while(all--){\
        if( doc.layers[all].locked==false){\
        doc.layers[all].visible=false;\
        }\
     }\
   }\
\
function exportJPG(num){\
     var exportOptions = new ExportOptionsJPEG();   \
    var exportName = (\""+save_location+"\"+\"/\"+ fileName+\""+separator+"\"+num);\
    var dest = new File(exportName);\
    var type = ExportType.JPEG;\
    exportOptions.antiAliasing = "+img_aa+";\
    exportOptions.qualitySetting = "+jpg_quality+";\
    exportOptions.horizontalScale = "+img_scale+";\
    exportOptions.verticalScale = "+img_scale+";\
    exportOptions.optimization=true;\
    exportOptions.artBoardClipping="+img_clip+";\
\
    doc.exportFile(dest,type,exportOptions);\
    }\
function exportGIF(num){\
     var exportOptions = new ExportOptionsGIF(); \
    var exportName = (\""+save_location+"\"+\"/\"+ fileName+\""+separator+"\"+num);\
    var dest = new File(exportName);\
    var type = ExportType.GIF;\
     exportOptions.antiAliasing = "+img_aa+";\
     exportOptions.artBoardClipping="+img_clip+";\
     exportOptions.transparency="+img_trans+" ;\
     exportOptions.horizontalScale = "+img_scale+";\
     exportOptions.verticalScale = "+img_scale+";\
    doc.exportFile(dest,type,exportOptions);\
    }\
function exportPNG(num){\
     var exportOptions = new ExportOptionsPNG24();  \
    var exportName = (\""+save_location+"\"+\"/\"+ fileName+\""+separator+"\"+num);\
    var dest = new File(exportName);\
    var type = ExportType.PNG24;\
     exportOptions.antiAliasing = "+img_aa+";\
     exportOptions.artBoardClipping="+img_clip+";\
     exportOptions.transparency="+img_trans+" ;\
     exportOptions.horizontalScale = "+img_scale+";\
     exportOptions.verticalScale = "+img_scale+";\
    doc.exportFile(dest,type,exportOptions); \
    }";
    return newFileBody;
    }


/**
 "main program": construct an anonymous instance and run it
 
*/


//get export folder
//var filename = prompt("This script will toggle and export all unlocked layers.\nPlease enter a name for the images:","export");
//var folder = prompt("Please enter the export folder: \nthe default ~ means your home directory, e.g.,  '/Users/username'\nNote: You can press escape to quit.","~");

if(app.documents.length>0){
        var doc ;// global ref to the current document (changes) 
    //new BatchExportUI().run();
    drawDialog();
}else{
     alert("You must have at least one document open to run this script.");
}
 