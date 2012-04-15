/////////////////////////////////////////////////////////////////
//Text Tweaker v2.0 -- CS, CS2
//>=--------------------------------------
//
//  This script randomly tweaks each letter in all <b>selected</b> text fields.
//  Text lines remain unbroken, and text remains editable. 
// 
//   <b>Current tweakable attributes are:</b>
//     1) baselineShift
//     2) horizontalScale
//	   3) verticalScale
//	   4) rotation
//	   5) size
//	   6) strokeWeight
//	   7) tracking
//	   8) leading
// 
//   <b>New in version 1.1</b>
//     Select a linear range to scale text smoothly from 10 to 50.
//   <b>New in version 2.0</b>
//	   smoother transitions between states, and basic (bow and spike) envelope shapes.
//	   random setting is now set between start and end values rather than from 0
//	   uses cubic easing for all (non random) transforms
//
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
// copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//
//  Cubic Easing formulae from:
//  Robert Penner's Easing Equations v1.5 (c) 2003 
//	see his work here http://www.robertpenner.com/
////////////////////////////////////////////////////////////////// 
if ( app.documents.length > 0 && activeDocument.selection.length>0)
{
	//set defaults
	var start = 100;
	var finish = 200;
	var easeThis = prompt("Enter the number of the attribute to change:\n1) baselineShift\t2) HScale\t3) VScale\t4) rotation\t\t5) size \t6) strokeWeight\t\t7) tracking\t8) leading","5")*1;
	//var andRet = true;
	var adder = 0;
	var ui = prompt("Enter Start and Finish Text Point Sizes separated by a comma.",start+","+finish);
	var rand = confirm("Would you like to randomize the output?");
	start = (ui.split(",")[0]*1);
	finish = (ui.split(",")[1]*1);
	if(rand!=true){
		var andRet = confirm("Do you want the line to change to "+finish+" in the middle, and return to "+start+"?");
		/*
		1 = bow Left
		2 = full bow 
		3 = bow right
		4 = spike
		*/
		if(andRet==true){
			var waveShape = prompt("Enter 1-4 for transform shape (1)left, (2)bow, (3)right,or (4)spike.","4")*1;
		}else{
			var waveShape = prompt("Enter (1) to bow or (4) to spike","4")*1;
		}
	}
	var docRef = activeDocument;
	var sel = docRef.selection;
	for(all in sel){
		textRef = sel[all];
		if(textRef.typename == "TextFrame"){

			//activeDocument.selection[0].textRange.characters[1].characterAttributes
			var charCount = textRef.textRange.characters.length;
			var dif = finish-start;
			var gain = dif / (charCount-1);
			var size = start;
			if (rand==true){
				//Randomize Text
				randomizeText(charCount,dif,start,easeThis);
			}else if(andRet==true){
				//if we want to wave up and back:	
				var cc2 = Math.floor(charCount/2);
				//if line is not an even number of characters
				if(!(cc2 == charCount/2)){
					adder = 1;
				}
				charCount = cc2;
				dif = finish-start;
				gain = dif / (charCount-1);
				size = start;	

				//going up....
				easeText(0,charCount,easeThis);
				//
				//reset everything half way...
				var hold = start;
				start = finish;
				finish=hold;
				//
				dif = finish-start;
				gain = dif / (charCount-1);
				//
				size = start;	
				//now back down...
				easeText(charCount,(charCount*2)+adder,easeThis);	
			} else {
				//wave one direction only
				easeText(0,charCount,easeThis);
			}
		}else{
			//alert("Selection is not a Text Frame");
		}
	}
}else{
	alert("No open Documents or Nothing Selected.");
}

//--Randomize Data
function randomizeText(ct,d,st,easeMe){
	//charcount difference start
	for(i=0; i<charCount; i++) {
			var TRC = textRef.textRange.characters[i];
			var rndNum = Math.round(st+ (Math.random(1)*(d)));
			switchTransform(TRC,easeMe,rndNum);
			
		}

}
function switchTransform(TRC,swi,valu){
	switch (swi){
		case 1: TRC.characterAttributes.baselineShift =  valu ; break;
		case 2: TRC.characterAttributes.horizontalScale =  valu ; break;
		case 3: TRC.characterAttributes.verticalScale = valu ; break;
		case 4: TRC.characterAttributes.rotation = valu ; break;
		case 5: TRC.characterAttributes.size = valu ; break;
		case 6: TRC.characterAttributes.strokeWeight = valu ; break;
		case 7: TRC.characterAttributes.tracking = valu ; break;
		case 8: TRC.characterAttributes.leading = valu ; break;
		//case 9: TRC.characterAttributes.underline = valu ; break;
		default:	 TRC.characterAttributes.horizontalScale = TRZ.characterAttributes.horizontalScale;
					 TRC.characterAttributes.rotation = 0;
					 TRC.characterAttributes.verticalScale = TRZ.characterAttributes.verticalScale;
					 TRC.characterAttributes.size = TRZ.characterAttributes.size;
					 TRC.characterAttributes.strokeWeight = TRZ.characterAttributes.strokeWeight;
					 TRC.characterAttributes.tracking = TRZ.characterAttributes.tracking;
					 TRC.characterAttributes.leading = TRZ.characterAttributes.leading;	


	}

}
function easeText(stChar,finChar,easeWhat){
	var thisChr = "";
	// what else is here: ???
	 //activeDocument.selection[0].textRange.characters[1].characterAttributes
	 //
	//alert("size="+size+" start="+start+" finish="+finish+" dif="+dif+" stChar="+stChar+" finChar="+finChar);
		for(i=stChar; i< finChar; i++) {
			var TRC = textRef.textRange.characters[i];
			thisChr = i;
			if(andRet = true){
				thisChr = i-stChar;
			} 	
				//

			if(shape(start,finish,waveShape)){
				var easer = easeOutCubic(thisChr, start, dif, charCount);
			} else {
				var easer = easeInCubic(thisChr, start, dif, charCount);
			}
			switchTransform(TRC,easeWhat,easer);
		}
		 		
}
function shape(a,b,c){
	//define envelope shape
	switch (c){
		case 1:
			return true;
		case 2:
			return (a<b);
		case 3:
			return false;
		default:
			return (b<a);
		}
}

/// following Cubic easing formulae extracted from 
//  Robert Penner's Easing Equations v1.5 (c) 2003 
//  http://www.robertpenner.com/profmx
//
// cubic easing in - accelerating from zero velocity
// t: current time, b: beginning value, c: change in value, d: duration
// t and d can be frames or seconds/milliseconds
/*
So in this case:
b = beginning (start)
c = change (dif)
d = duration (length?)
t = time = "current character" (i)
*/

function easeInCubic(t, b, c, d) {
	return c*(t/=d)*t*t + b;
};

// cubic easing out - decelerating to zero velocity
function easeOutCubic(t, b, c, d) {
	//alert("t="+t+"b="+b+"c="+c+"d="+d);
	return c*((t=t/d-1)*t*t + 1) + b;
};
 /*
 ---------------------------------------------------------------------
The full list of attributes to play with, (along with sample values):
 1) Tsume=0
 2) akiLeft=-1
 3) akiRight=-1
 4) alignment=StyleRunAlignmentType.ROMANBASELINE
 5) alternateGlyphs= the requested attribute is undefined for the text range
 6) autoLeading=true
 7) baselineDirection=BaselineDirectionType.Standard
 8) baselinePosition=FontBaselineOption.NORMALBASELINE
 9) baselineShift=0
10) capitalization=FontCapsOption.NORMALCAPS
11) connectionForms=false
12) contextualLigature=false
13) discretionaryLigature=false
14) figureStyle=FigureStyleType.DEFAULTFIGURESTYLE
15) fillColor=[CMYKColor]
16) fractions=false
17) horizontalScale=90.6311571598053
18) italics=false
19) kerningMethod= the requested attribute is undefined for the text range
20) language=LanguageType.ENGLISH
21) leading=75.1665802001953
22) ligature=true
23) noBreak=false
24) openTypePosition=FontOpenTypePositionOption.OPENTYPEDEFAULT
25) ordinals=false
26) ornaments=false
27) overprintFill=false
28) overprintStroke=false
29) parent=[Story]
30) proportionalMetrics=false
31) rotation=0
32) size=62.6388168334961
33) strikeThrough=false
34) strokeColor=[CMYKColor]
35) strokeWeight=1
36) stylisticAlternates=false
37) swash=false
38) tateChuYokoHorizontal=0
39) tateChuYokoVertical=0
40) textFont=[TextFont Broadveau]
41) titling=false
42) tracking=-20
43) typename=CharacterAttributes
44) underline=false
45) verticalScale=100
46) wariChuCharactersAfterBreak=2
47) wariChuCharactersBeforeBreak=2
48) wariChuEnabled=false
49) wariChuJustification=WariChuJustificationType.WARICHUAUTOJUSTIFY
50) wariChuLineGap=0
51) wariChuLines=2
52) wariChuScale=50
-----------------------------------------------------------------------
*/