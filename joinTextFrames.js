/////////////////////////////////////////////////////////////////
//Join TextFrames v.2.1 -- CS,CS2
//>=--------------------------------------
// When Adobe came out with the new CS text engine,
// the text fields in documents saved in an older format were
// often broken into "sub" fields.
//
// This script is a rudimentary tool to help 
// rejoin the broken text fields. It works best on individual lines of horizontal text.
//
// It collects text from any number of selected (non-grouped) textframes 
// and aggrigates them into a single text frame.
// the order is based on relative x,y coordinates.
//
// If a selected text anchors vertical coordinate is the same as the next one, 
// text areas are assumed to be on the same line.
//
// If a selected text anchors vertical coordinate is different, 
// the text areas are assumed to be sequential lines, 
//
//
// This script WILL NOT make any attempt to maintain visual integrety of 
// character placement. It will only join the fields for easier editing,
// but sometimes, just this little bit is a HUGE time saver.
//
// As of Version 2.0 an option is given to maintain the individual styling of each letter.
// See first lines of the script for details.
//
//
// the sensitivity of what is considered "the same line" can 
// be adjusted by setting the "verticalTolerance" variable 
// near the top of the script (just below the style arrays).
// but please note, it is assumed that all selected text is on a horizontal plane.
// If you wish to join rotated textfields, you will have to unrotate them first.
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
//copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
////////////////////////////////////////////////////////////////// 

var format = true;
// Notes on usage:
// When running this script with the FULL 92 item list of character style options, script execution times 
// dropped to painfully slow levels. 
// My fix for this was to create a subset of common formattings that one would likely be looking for.
//  If you're not getting the behavior you want, you can either copy the desired attributes from 
// the "fullStylesArray" to the "basicStylesArray", or if you want to copy everything all the time, you can just assign
// the "stylesArray" the value of  "fullStylesArray" on (or around) line 50.
//
//
var fullStylesArray= ['Tsume','akiLeft','akiRight','alignment','alternateGlyphs','autoLeading','autoLeadingAmount','baselineDirection','baselinePosition','baselineShift','bunriKinshi','burasagariType','capitalization','characterAttributes','characterOffset','connectionForms','contents','contextualLigature','desiredGlyphScaling','desiredLetterSpacing','desiredWordSpacing','discretionaryLigature','everyLineComposer','figureStyle','fillColor','firstLineIndent','fractions','horizontalScale','hyphenateCapitalizedWords','hyphenation','hyphenationPreference','hyphenationZone','italics','justification','kerning','kerningMethod','kinsoku','kinsokuOrder','kurikaeshiMojiShori','language','leading','leadingType','leftIndent','length','ligature','maximumConsecutiveHyphens','maximumGlyphScaling','maximumLetterSpacing','maximumWordSpacing','minimumAfterHyphen','minimumBeforeHyphen','minimumGlyphScaling','minimumHyphenatedWordSize','minimumLetterSpacing','minimumWordSpacing','mojikumi','noBreak','openTypePosition','ordinals','ornaments','overprintFill','overprintStroke','paragraphAttributes','proportionalMetrics','rightIndent','romanHanging','rotation','singleWordJustification','size','spaceAfter','spaceBefore','story','strikeThrough','strokeColor','strokeWeight','stylisticAlternates','swash','tabStops=','tateChuYokoHorizontal','tateChuYokoVertical','textFont','textSelection','titling','tracking','underline','verticalScale','wariChuCharactersAfterBreak','wariChuCharactersBeforeBreak','wariChuEnabled','wariChuJustification','wariChuLineGap','wariChuLines','wariChuScale'];
//
var basicStylesArray=["alignment",'baselineDirection','baselinePosition',"baselineShift",'capitalization','characterOffset','contents','fillColor','horizontalScale','italics','justification','kerning','openTypePosition','ordinals','ornaments','strikeThrough','rotation','size','stylisticAlternates','textFont','titling','tracking','underline','verticalScale'];
//
// this sets the amount of vertical variance acceptable for anchors to be
// considered on the same line. Set to zero if you want to be exact.
var verticalTolerance = 0;
    verticalTolerance = prompt ("How much variance in pixels do you want to allow for letters to be considered on the same line?",1.5); //points
//
var stylesArray = basicStylesArray;
//var exclusionList = ["characterOffset","strokeWeight"];
var allFormatedChars = new Array(0);
//above lines used for copying formatting
mainSel = activeDocument.selection;
var groupFound = 0;
//join all ungrouped TextFrames.
var lines = new Array(0);
sortAndJoin(mainSel);	

//alert(allFormatedChars);
//--------------------
/*

*/

//-----------FUNCTIONS----------------

function sortAndJoin(sel){
	var slen = sel.length;
	if (slen >0)
	{

		textObjects = new Array();
		// OK, I'll give you ONE level of grouping for free...
		if(slen==1 && sel[0].typename == "GroupItem"){
			sel=sel[0].textFrames;
			slen = sel.length;
		}

		for (j=0;j<slen;j++ )
		{
			if(sel[j].typename == "TextFrame"){
				textObjects.push(sel[j]);
				//But if there are more groups selected, screw it...
			}else if(sel[j].typename == "GroupItem"){
				groupFound = 1;
			}
		}
		if (groupFound==1)
		{
			alert("Please ungroup selection first.");
		}else {
			var tlen = textObjects.length;
			//now sort the list
			if(tlen > 0){
				var tob=textObjects;

				sort(tob);

				//
				//
				var blab="";
				 for(x = 0; x < tob.length; x++) {
					blab+=tob[x].contents+" "+tob[x].name+"\n";
				 }
				//alert(blab);
				//
				//
				var disp = "";
				for (j=0;j<tlen;j++)
				{
					if (tob[j].name == ":hi:")
					{
						//add a return
						tob[j].contents+="\r";
					
					}
					//alert(tob[j]);
					if(format){
						// ---------------create formatting array here
						extractFormatting(tob[j]);
					}
					disp+=tob[j].contents;
				}
				

				tob[0].contents = disp;
				var tobLen = tob[0].contents.length
				//remove "extra" return
				if(tob[0].contents[tobLen-1]=="\r"){ 
					//alert("return found");
					tob[0].contents= tob[0].contents.substr(0,tobLen-1);
				}
							for (j=(tlen-1);j>0;j--)
				{
					tob[j].remove();
				}	
				app.redraw();
				// calculated for my CPU (2.5 Ghz) Your results may vary...
				 format = !confirm("Individual character formatting will take roughly "+(Math.round((tobLen)*(stylesArray.length*.0115)))+" seconds to complete.\n Do you wish to skip character formatting?");
				 
				tob[0].name = tob[0].contents.substr(0,5)+"...";
				 
				// alert(allFormatedChars);
				if(format){
					// ---------------assign formatting here
					 
					assignFormatting(tob[0]);
					//alert("formatting assigned");
				}

				//now kill all textfields...
				///*

				//*/
				
			}
		}
	}
	//alert("Text Objects:"+textObjects);
}

function copyText(a,b){
	//Copies text from a object to b object... 
	b.contents = a.contents;
} 
function addText(a,b){
	//Copies text from a object to b object... 
	b.contents += ("\n"+ a.contents);
}  
//anchor x,y
//position x,y
function isHiOrLeft(a,b){
	//alert(a+" "+b);
	// commented out version measures based on height instead of anchors.
	//if(a.position[1]-a.height > b.position[1]-b.height){
		if(a.anchor[1] > b.anchor[1] && !isWithin(a.anchor[1],b.anchor[1])){
		a.name = ":hi:";
		return true;
	// commented out version measures based on height instead of anchors.
	//} else if (a.position[1]-a.height == b.position[1]-b.height && a.position[0] < b.position[0]) {
	  } else if (isWithin(a.anchor[1],b.anchor[1]) && a.anchor[0] < b.anchor[0]) {
		a.name = ":left:";
		return true;
	}
	return false;
}
function isWithin(YposA,YposB){
	if(YposA==YposB){return true};
	if(findDiff(YposA,YposB)<verticalTolerance){
		return true;
	}
	return false;
}
function findDiff(a,b){
	if( a>0 && b>0 && b>a  || 
		a<0 && b>0		   ||  
		a<0 && b<0 && a>b  ){
			return Math.abs(b-a);
	}
	return Math.abs(a-b);
}
function swapItems(arr,aNum,bNum){
	//Copies text from a object to b object... 
	tmp = arr[aNum];
	arr[aNum]= arr[bNum];
	arr[bNum]=tmp;
}  

function sort(objArr){
  var x, y, holder;
  // The Bubble Sort method.
	obLen = objArr.length;
	//for each letter in textfield:
  for(x = 0; x < obLen; x++) {
	  //compare against each other letter
    for(y = 0; y < obLen-1; y++) {
      if(isHiOrLeft(objArr[y+1],objArr[y])) {
        holder = objArr[y+1];
        objArr[y+1] =objArr[y];
        objArr[y] = holder;
      }

    }
  }
}

//------------------------section added for handling text formatting:----------------------------------------

//following two lines moved to top of script:
//var exclusionList = ["characterOffset","strokeWeight"];
//var allFormatedChars = new Array(0);
//-------------:::USAGE:::-------
//extractFormatting(selection[0]);
//assignFormatting(selection[1]);

function extractFormatting(a){
	var charsLen = a.textRange.characters.length;
	for (var each=0;each < charsLen;each++){
		var tempAtts = new Array(0);
		//
		//EVERY setting takes too long, so we define our list of things to change instead
		for (everyValue in stylesArray){
		//for (everyValue in a.textRange.characters[each]){
			try{	
					//if(notExcluded(everyValue)){
						tempAtts.push([stylesArray[everyValue], a.textRange.characters[each][stylesArray[everyValue]]]); 
					//}
				}
			catch(e){
				//nothing...
			}
		}
		allFormatedChars.push(tempAtts);
	}
	
}
function assignFormatting(b){
	var charsLen =allFormatedChars.length;
	for (var each =0;each< charsLen;each++){
		//
		for (everyValuePair in allFormatedChars[each]){
			try{	
				var att = allFormatedChars[each][everyValuePair][0]+"";// stringify...
				b.textRange.characters[each][att]=allFormatedChars[each][everyValuePair][1]; 
				}
			catch(e){
				//nothing
			}
		}
	}

}
//not used
function notExcluded(item){
	for(var all in exclusionList){
		if(item == exclusionList[all]){
			//alert(each+" was excluded");
			return false;
		}
	}
	return true;

}
//not used
function stack(objArr){
	  var x, y, holder;
  // The Bubble Sort method.
	obLen = objArr.length;
	//for each letter in textfield:
  for(x = 0; x < obLen; x++) {
	  //compare against each other letter
	objArr[x].moveToBeginning(objArr[x].parent);
  }

}