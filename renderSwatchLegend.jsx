/////////////////////////////////////////////////////////////////
// Render Swatch Legend v1.4.4 -- CC
//>=--------------------------------------
//
//  This script will generate a legend of rectangles for every swatch in the main swatches palette.
//  You can configure spacing and value display by configuring the variables at the top
//  of the script.
//   update: v1.1 now tests color brightness and renders a white label if the color is dark.
//   update: v1.2 uses adobe colour converter, rather than rgb colour conversion for a closer match.
//   update: v1.3 adds multiple colour space values based on array printColors.
//   update: v1.4.1 Updated by CarlCanto > https://community.adobe.com/t5/illustrator-discussions/illustrator-javascript-render-swatch-legend-lab-colour-values-incorrect/m-p/11437592
//   update: v1.4.2 Only on selected Rombout Versluijs
//   update: v1.4.3 Added HEX colors Rombout Versluijs
//   update: v1.4.4 Added Split by Color Component Rombout Versluijs

// LAB values by Carlos Canto - 09/16/2020
// reference: https://community.adobe.com/t5/illustrator/illustrator-javascript-render-swatch-legend-lab-colour-values-incorrect/m-p/11438710?page=2#M244722
//>=--------------------------------------
// JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
// copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
//
// Edits by Adam Green (@wrokred) www.wrokred.com

//////////////////////////////////////////////////////////////////
doc = activeDocument,
swatches = doc.swatches.getSelected(),
cols = 4, // number of columns in group
displayAs = "RGBColor", //or "CMYKColor"
printColors = ["HEX", "RGB", "CMYK", "LAB", "GrayScale"], // RGB, CMYK, LAB and/or GrayScale
colorSeparator = " ", // Character used to separate the colours eg "|" output = R: XXX|G: XXX|B: XXX
splitColorComponents = false;
textSize = 10, // output text size value in points
rectRef = null,
textRectRef = null,
textRef = null,
swatchColor = null,
w = 150;
h = 120,
h_pad = 10,
v_pad = 10,
t_h_pad = 10,
t_v_pad = 10,
x = null,
y = null,
black = new GrayColor(),
white = new GrayColor();
black.gray = 100;
white.gray = 0;
activeDocument.layers[0].locked = false;
var newGroup = doc.groupItems.add();
newGroup.name = "NewGroup";
newGroup.move(doc, ElementPlacement.PLACEATBEGINNING);
for (var c = 0, len = swatches.length; c < len; c++) {
    var swatchGroup = doc.groupItems.add();
    swatchGroup.name = swatches[c].name;
    x = (w + h_pad) * ((c) % cols);
    y = (h + v_pad) * (Math.round(((c+2) + .03) / cols)) * -1;
    rectRef = doc.pathItems.rectangle(y, x, w, h);
    swatchColor = swatches[c].color;
    rectRef.fillColor = swatchColor;
    textRectRef = doc.pathItems.rectangle(y - t_v_pad, x + t_h_pad, w - (2 * t_h_pad), h - (2 * t_v_pad));
    textRef = doc.textFrames.areaText(textRectRef);
    textRef.contents = swatches[c].name + "\r" + getColorValues(swatchColor);
    textRef.textRange.fillColor = is_dark(swatchColor) ? white : black;
    textRef.textRange.size = textSize;
    rectRef.move(swatchGroup, ElementPlacement.PLACEATBEGINNING);
    textRef.move(swatchGroup, ElementPlacement.PLACEATBEGINNING);
    swatchGroup.move(newGroup, ElementPlacement.PLACEATEND);
}

function getColorValues(c, spot) {
    if (c.typename) {
        if (c.typename == "SpotColor") {
            return getColorValues(c.spot.color, c.spot);
        };
        switch (c.typename) {
            case "RGBColor":
                sourceSpace = ImageColorSpace.RGB;
                colorComponents = [c.red, c.green, c.blue];
                break;
            case "CMYKColor":
                sourceSpace = ImageColorSpace.CMYK;
                colorComponents = [c.cyan, c.magenta, c.yellow, c.black];
                break;
            case "LabColor":
                sourceSpace = ImageColorSpace.LAB;
                colorComponents = [c.l, c.a, c.b];
                break;
            case "GrayColor":
                sourceSpace = ImageColorSpace.GrayScale;
                colorComponents = [c.gray];
                break;
        }
        var outputColors = new Array();
        for (var i = printColors.length - 1; i >= 0; i--) {
            colorType = printColors[i] == "HEX" ? "Indexed": printColors[i];
            targetSpace = ImageColorSpace[colorType] ;
            
            if (printColors[i] == 'LAB' && spot && spot.spotKind == 'SpotColorKind.SPOTLAB') {
                outputColors[i] = spot.getInternalColor();
            } else if(printColors[i] == 'HEX') {
                if (app.activeDocument.documentColorSpace == DocumentColorSpace.CMYK) {
                    colorArray = [c.cyan, c.magenta, c.yellow, c.black];
                    // [Math.round(c), Math.round(m), Math.round(y), Math.round(k)]
                    rgbConv = app.convertSampleColor(ImageColorSpace["CMYK"], colorArray, ImageColorSpace["RGB"], ColorConvertPurpose.defaultpurpose);          
                    outputColors[i] = [rgbConv[0].toString(16), rgbConv[1].toString(16), rgbConv[2].toString(16)];
                } else{
                    outputColors[i] = [c.red.toString(16), c.green.toString(16), c.blue.toString(16)];

                }
            }
            else {
                outputColors[i] = app.convertSampleColor(sourceSpace, colorComponents, targetSpace, ColorConvertPurpose.previewpurpose);
            }
            for (var j = outputColors[i].length - 1; j >= 0; j--) {
                colorComp = splitColorComponents == true ? printColors[i].charAt(j) + ": " : "";
                if(isNaN(outputColors[i][j])){
                    outputColors[i][j] = colorComp + outputColors[i][j];
                } else {
                    outputColors[i][j] = colorComp + Math.round(outputColors[i][j]);
                }
                if (j == outputColors[i].length - 1) {
                    outputColors[i][j] += "\r";
                };
            };
            outputColors[i] = outputColors[i].join(colorSeparator);
            if(!splitColorComponents) outputColors[i] = printColors[i]+" "+outputColors[i]
        };
        return outputColors.join("");
    }
    return "Non Standard Color Type";
}

function is_dark(c) {
    if (c.typename) {
        switch (c.typename) {
            case "CMYKColor":
                return (c.black > 50 || (c.cyan > 50 && c.magenta > 50)) ? true : false;
            case "RGBColor":
                return (c.red < 100 && c.green < 100) ? true : false;
            case "GrayColor":
                return c.gray > 50 ? true : false;
            case "SpotColor":
                return is_dark(c.spot.color);
                return false;
        }
    }
}
