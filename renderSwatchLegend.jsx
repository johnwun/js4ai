/////////////////////////////////////////////////////////////////
// Render Swatch Legend v1.3 -- CC
//>=--------------------------------------
//
//  This script will generate a legend of rectangles for every swatch in the main swatches palette.
//  You can configure spacing and value display by configuring the variables at the top
//  of the script.
//   update: v1.1 now tests color brightness and renders a white label if the color is dark.
//   update: v1.2 uses adobe colour converter, rather than rgb colour conversion for a closer match. - wrokred
//   update: v1.3 adds multiple colour space values based on array printColors, and colour name separator - wrokred
//   update: v1.4 add option for HEX web colour output, and HSB/V colours - wrokred
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
// copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//
// Edits by Adam Green (@wrokred) www.wrokred.com
//
//////////////////////////////////////////////////////////////////
doc = activeDocument,
swatches = doc.swatches,
cols = 4, // number of columns in group
displayAs = "RGBColor",  //or "CMYKColor"
printColors = ["RGB", "CMYK", "LAB", "GrayScale", "HSB"], // RGB, CMYK, LAB, GrayScale and or HSB/HSV
colorSeparator = " ", // Character used to separate the colours eg "|" output = R: XXX|G: XXX|B: XXX
hex = true, // output RGB HEX values (RGB must be one of the print colours)
textSize = 10, // Value in points
rectRef=null,
textRectRef=null,
textRef=null,
swatchColor=null,
w=150;
h=120,
h_pad = 10,
v_pad = 10,
t_h_pad = 10,
t_v_pad = 10,
x=null,
y=null,
black = new GrayColor(),
white = new GrayColor()
;

black.gray = 100;
white.gray = 0;

activeDocument.layers[0].locked= false;
var newGroup = doc.groupItems.add();
newGroup.name = "NewGroup";
newGroup.move( doc, ElementPlacement.PLACEATBEGINNING );

for(var c=2,len=swatches.length;c<len;c++)
{
    var swatchGroup = doc.groupItems.add();
    swatchGroup.name = swatches[c].name;

    x= (w+h_pad)*((c-2)% cols);
    y=(h+v_pad)*(Math.round(((c)+.03)/cols))*-1 ;
    rectRef = doc.pathItems.rectangle(y,x, w,h);
    swatchColor = swatches[c].color;
    rectRef.fillColor = swatchColor;
    textRectRef =  doc.pathItems.rectangle(y- t_v_pad,x+ t_h_pad, w-(2*t_h_pad),h-(2*t_v_pad));
    textRef = doc.textFrames.areaText(textRectRef);
    textRef.contents = swatches[c].name + "\r" + getColorValues(swatchColor);
    textRef.textRange.fillColor = is_dark(swatchColor)? white : black;
    textRef.textRange.size = textSize;
    rectRef.move( swatchGroup, ElementPlacement.PLACEATBEGINNING );
    textRef.move( swatchGroup, ElementPlacement.PLACEATBEGINNING );
    swatchGroup.move( newGroup, ElementPlacement.PLACEATEND );
}

function getColorValues(c)
{
    if (c.typename == "SpotColor") {
        return getColorValues(c.spot.color);
    };
    if(c.typename)
    {
        switch(c.typename)
        {
            case "RGBColor": sourceSpace = ImageColorSpace.RGB; colorComponents=[c.red,c.green,c.blue]; break;
            case "CMYKColor": sourceSpace = ImageColorSpace.CMYK; colorComponents=[c.cyan,c.magenta,c.yellow,c.black]; break;
            case "LabColor": sourceSpace = ImageColorSpace.LAB; colorComponents=[c.l,c.a,c.b]; break;
            case "GrayColor": sourceSpace = ImageColorSpace.GrayScale; colorComponents=[c.gray]; break;
        }
        outputHex = new Array();
        outputColors = new Array();
        for (var i = printColors.length - 1; i >= 0; i--) {

            if (printColors[i] != "HSB" && printColors[i] != "HSV") {
                targetSpace = ImageColorSpace[printColors[i]];
                outputColors[i] = app.convertSampleColor(sourceSpace, colorComponents, targetSpace,ColorConvertPurpose.previewpurpose);
            } else {
                //convert to RGB
                targetSpace = ImageColorSpace["RGB"];
                convertionColors = app.convertSampleColor(sourceSpace, colorComponents, targetSpace,ColorConvertPurpose.previewpurpose);
                // convert to HSV
                outputColors[i] = rgb2hsv(convertionColors);
            };
            for (var j = outputColors[i].length - 1; j >= 0; j--) {
                if (hex == true && printColors[i] == "RGB") {
                    outputHex[j] = Math.round(outputColors[i][j]).toString(16).toUpperCase();
                    if (outputColors[i][j] <= 16) {
                        outputHex[j] = "0" + outputHex[j];
                    };
                };
                outputColors[i][j] = printColors[i].charAt(j)+": "+Math.round(outputColors[i][j]);
                if (j == outputColors[i].length -1) {
                    outputColors[i][j] += "\r";
                };
            };
            outputColors[i] = outputColors[i].join(colorSeparator);


        };

        if (hex == true && outputHex[0]) {
            outputColors[printColors.length] = "#"+outputHex.join("");
        };

        return outputColors.join("");

    }
    return "Non Standard Color Type";
}

function is_dark(c){
    if (c.typename == "SpotColor") {
        return is_dark(c.spot.color);
    };
    if(c.typename)
    {
        switch(c.typename)
        {
            case "RGBColor": sourceSpace = ImageColorSpace.RGB; colorComponents=[c.red,c.green,c.blue]; break;
            case "CMYKColor": sourceSpace = ImageColorSpace.CMYK; colorComponents=[c.cyan,c.magenta,c.yellow,c.black]; break;
            case "LabColor": sourceSpace = ImageColorSpace.LAB; colorComponents=[c.l,c.a,c.b]; break;
            case "GrayColor": sourceSpace = ImageColorSpace.GrayScale; colorComponents=[c.gray]; break;
        }

        targetSpace = ImageColorSpace.GrayScale;
        isDarkColors = app.convertSampleColor(sourceSpace, colorComponents, targetSpace,ColorConvertPurpose.previewpurpose);
        lightness = Math.floor(isDarkColors[0]);

        return lightness > 60 ? true : false;
    }
    return false;
}

function rgb2hsv (inputRGB) {
    var hsvColors = new Array(3),
    rr, gg, bb,
    r = inputRGB[0] / 255,
    g = inputRGB[1] / 255,
    b = inputRGB[2] / 255,
    h, s,
    v = Math.max(r, g, b),
    diff = v - Math.min(r, g, b),
    diffc = function(c){
        return (v - c) / 6 / diff + 1 / 2;
    };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    hsvColors[0] = (h * 360);
    hsvColors[1] = (s * 100);
    hsvColors[2] = (v * 100);

    return hsvColors;
};
