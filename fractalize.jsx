/////////////////////////////////////////////////////////////////
//Fractalize  v.2.0.0.0  -- CS, CS2, CS3, CS4
//>=--------------------------------------
//   
//   Makes pretty fractal designs.  Duplicates a Path Item for each point of the source object, 
//   Then repeats the process for each new object, then repeats...etc.
//   Each iteration is slightly more transparent than the last. 
//   User can choose to abort the process after each iteration.
//
//	  Original object transform code by John Kelly,  UI co-developed by  J. Kelly and J. Wundes.
//
//	  v 2.0 Now includes a single panel dialog for all variables, if using CS3 or above.
//			   Script degrades gracefully, and should now work for CS and CS2 as well...
// 
//>=--------------------------------------
// JS code by: John Kelly rithmikansur@yahoo.com; UI and stat tracking code by kelly and wundes ( john@wundes.com ) www.wundes.com
////////////////////////////////////////////////////////////////// 

var versionNum = app.version.split(".")[0];
//
var docRef = activeDocument;
var sel = docRef.selection;
var text = Array();
text[0] = "Enter size transformation value: (1-99)\nCAUTION!!: higher numbers can take a VERY long time!\n(Unless your object is VERY small)\nA value between 25 and 75 is recommended.";
text[1] = "Enter offset distance(experiment to see effects.)\n";
text[2] = "Enter minimum object size (in pixels) to end process:1 min, no max."
//
var transform_default = 50;
var offset_default = 0;
var endsize_default = 10;
var opacity_default = 80;
//
var transform = transform_default;
var offset = offset_default;
var endsize = endsize_default;
var opaDelta = opacity_default/100;
//
if (versionNum <13)
{
	// CS2 or below:
	transform = prompt(text[0], transform_default);
	offset=prompt(text[1], offset_default);
	endsize = prompt(text[2], endsize_default);
	main();
} else {
	//CS3 or above
	//

	var cstmUI = new Window('dialog', "Set Parameters:");
	cstmUI.location = [200,200];

	//------------------Transform----------------------------
	cstmUI.xform = cstmUI.add('group', undefined, 'Set Variables:'); 
	(cstmUI.xform.title1 = cstmUI.xform.add('statictext', [15,15,95,35], 'Shrink copies by:')).helpTip = "Amount to Shrink each succesive  iteration."; 
 	(cstmUI.xform.titleEt = cstmUI.xform.add('edittext', [100,12,130,32], 50)).helpTip = "Transform."; 
     cstmUI.xform.titleEt.text = transform_default;
	 cstmUI.xform.title2 = cstmUI.xform.add('statictext', [15,15,35,35], '%') ; 
	 cstmUI.xform.orientation='row';
	 	//------------------Offset----------------------------
	cstmUI.offset = cstmUI.add('group', undefined, 'Set Variables:'); 
	(cstmUI.offset.title1 = cstmUI.offset.add('statictext', [15,15,95,35], 'Offset copies by:')).helpTip = "Amount to offset each succesive  iteration."; 
 	(cstmUI.offset.titleEt = cstmUI.offset.add('edittext', [100,12,130,32], 50)).helpTip = "Offset."; 
     cstmUI.offset.titleEt.text = offset_default;
	 cstmUI.offset.title2 = cstmUI.offset.add('statictext', [15,15,35,35], 'px') ; 
	 cstmUI.offset.orientation='row';
	 	 //------------------endSize----------------------------
	cstmUI.endsize = cstmUI.add('group', undefined, 'Set Variables:'); 
	(cstmUI.endsize.title1 = cstmUI.endsize.add('statictext', [15,15,95,35], 'Stop at:')).helpTip = "Stop when objects reach this size"; 
 	(cstmUI.endsize.titleEt = cstmUI.endsize.add('edittext', [100,12,130,32], 50)).helpTip = "endSize."; 
     cstmUI.endsize.titleEt.text = endsize_default;
	 cstmUI.endsize.title2 = cstmUI.endsize.add('statictext', [15,15,35,35], 'px') ; 
	 cstmUI.endsize.orientation='row';
	 	 	 //------------------Opacity----------------------------
	cstmUI.xparancy = cstmUI.add('group', undefined, 'Set Variables:'); 
	(cstmUI.xparancy.title1 = cstmUI.xparancy.add('statictext', [15,15,95,35], 'Opacity Drop:')).helpTip = "% to drop opacity for each succesive  iteration."; 
 	(cstmUI.xparancy.titleEt = cstmUI.xparancy.add('edittext', [100,12,130,32], 50)).helpTip = "Opacity."; 
     cstmUI.xparancy.titleEt.text = opacity_default;
	 cstmUI.xparancy.title2 = cstmUI.xparancy.add('statictext', [15,15,35,35], '%') ; 
	 cstmUI.xparancy.orientation='row';
	 // ----------------Buttons:---------------------------
	cstmUI.btnPnl = cstmUI.add('group', undefined, 'Do It!'); 
	cstmUI.btnPnl.orientation='row';
	cstmUI.btnPnl.buildBtn1= cstmUI.btnPnl.add('button',[15,15,115,35], 'Cancel', {name:'cancel'}); 
	cstmUI.btnPnl.buildBtn2 = cstmUI.btnPnl.add('button', [125,15,225,35], 'OK', {name:'ok'}); 
	cstmUI.btnPnl.buildBtn1.onClick = actionCanceled;
	 cstmUI.btnPnl.buildBtn2.onClick = respond;
	cstmUI.show();
}

function respond(){
	transform = 1*(cstmUI.xform.titleEt.text);
	offset = 1*(cstmUI.offset.titleEt.text);
	endsize = 1*(cstmUI.endsize.titleEt.text);
	opaDelta = (cstmUI.xparancy.titleEt.text)/100;
	cstmUI.close();
	//alert("x:"+transform+", o:"+offset+", e:"+endsize+", op:"+opaDelta);
	 main();
}

function main(){ 
	
	if (sel.length<1 || sel[0].typename!="PathItem" ||transform == null || transform.length ==0 || transform==100 || offset == null || offset.length ==0 || endsize==0){
		   alert("Either, you canceled,\nYou have not selected an object,\nYou have selected more than 1 object,\nOr you selections is not a simple path item.\n (no groups or compound paths allowed.)")
		   //User canceled process or didn\'t enter anything, so do nothing and end nicely.
	} else{

	var thisxhandleL = 0;
	var thisxhandleR = 0;
	var thisyhandleL = 0;
	var thisyhandleR = 0;
	var newpath = Array();
	var lastHeight=sel[0].height;
	var lastTime = getTime();
	var minutes = 60;
	var hours = minutes*60;
	var days = hours*24;
	var years = days*365;
	var opaVal = 100;
	var ppl = sel[0].selectedPathPoints.length;

	// add progress window
	if (versionNum >= 13)
	{  
		var w = new Window('window', "Drawing Objects", undefined, {independent:true});
		w.frameLocation = [200,200];
		w.tracker = w.add ('statictext' , [15,15,250,35], "processing");
		w.prog = w.add ('progressbar' , [15,15,250,35], 0, ppl);
	} else {
		var w = new Array();;
		  w.prog = new Array();
		 w.prog.value = 0;;
		 w.prog.maxvalue = ppl;
		 w.tracker = new Array();
		 w.tracker.text = "";
	}
	opaVal *= opaDelta;
	 
	for(A=0; sel[A].width>endsize || sel[A].height>endsize ; A++){
		
		var cntrx=sel[A].position[0] + (sel[A].width/2);
		var cntry=sel[A].position[1] - (sel[A].height/2);
		
		if(sel[A].height < lastHeight-1){
			  lastHeight = sel[A].height
			redraw(); // per iteration

			opaVal *= opaDelta;
			var s = getSecondsPassed(lastTime);
			s= s*sel[0].selectedPathPoints.length;
			s=Math.round(s);
			var m= Math.floor(s/minutes);
			var secs = s%60;
	if (versionNum >= 13)
	{  
			w.close();	
	}
			//
			lastTime = getTime();
			w.prog.maxvalue*=ppl;
			w.prog.value=0;	
			var goconfirm = confirm("Iteration Complete. \nNext iteration will generate "+w.prog.maxvalue+" objects, and will take in the range of about  "+m+" minutes, "+secs+" seconds.\nDo you wish to continue?");
				if (versionNum >= 13)
				{  
						w.show();	
				}
		}

				if (versionNum >= 13)
				{  
						w.tracker.text ="Drawing "+w.prog.value+" of "+w.prog.maxvalue+" objects."; 
				}
			 
		if(goconfirm==false){
				break;
		}		   
		 for(B=0; B<sel[0].selectedPathPoints.length; B++){
					
			
			   var originx = sel[A].pathPoints[B].anchor[0];
			   var originy = sel[A].pathPoints[B].anchor[1];
			   var deltax = (cntrx - originx);
			   var deltay = (cntry - originy);
			   var duplicate = docRef.pathItems.add();
					   for(C=0; C<sel[0].selectedPathPoints.length; C++){
						   
							   var thispoint = duplicate.pathPoints.add();
							   var thisx = sel[A].pathPoints[C].anchor[0]*(-1);
							   var thisy = sel[A].pathPoints[C].anchor[1]*(-1);
							   thisxhandleL = sel[A].pathPoints[C].leftDirection[0]*(-1);
							   thisyhandleL = sel[A].pathPoints[C].leftDirection[1]*(-1);
							   thisxhandleR = sel[A].pathPoints[C].rightDirection[0]*(-1);
							   thisyhandleR = sel[A].pathPoints[C].rightDirection[1]*(-1);
							   var newx = thisx + (originx*2);
							   var newy = thisy + (originy*2);
							   thispoint.anchor = Array(newx, newy);
							   thispoint.leftDirection = Array(thisxhandleL+(originx*2), thisyhandleL+(originy*2));
							   thispoint.rightDirection = Array(thisxhandleR+(originx*2), thisyhandleR+(originy*2));
								// redraw(); // per segment
					   }
					   duplicate.closed = true;
					   sel[sel.length] =duplicate;
					   duplicate.resize(transform,transform);
					   duplicate.translate(deltax-(deltax*(transform/100))*offset, deltay-(deltay*(transform/100))*offset);
					   duplicate.zOrder(ZOrderMethod.SENDTOBACK);
					   newpath = Array();
					   duplicate.opacity = opaVal;
					   try{
						w.prog.value++; 
					   }
					  
					   catch(e){
						//if nothing there, skip it..
					   }
						
						 
					  // redraw(); // per item
					 
					 
			   }
						//redraw(); // per cluster
					   //colorIndex = Math.floor(Math.random() * (100 - 0 + 1) + 0);
					   //duplicate.fillColor.black = colorIndex;

		}
	}
}
function getTime(){
	var d = new Date();
	var  t = d.getTime();
	return t;
}
function getSecondsPassed(old){
	var d = new Date();
	var  t = d.getTime();
	
	return (t-old)/1000;
}
function actionCanceled() { 
	//OK = 3;
	dlg.close();
}