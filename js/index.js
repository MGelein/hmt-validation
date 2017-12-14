var FOLIO;
var TYPE;
var NO_MATCH = "<span class='nomatch text-warning'>No Match</span>";
/**
 * Defines the Index class. This 'class' handles validation of indexing
 * @param {String} target defines what kind of indexing we're validating
 * @param {String} folio defines what folio we're working on
 */
function Index(target, folio){
    console.log("Starting validation of indexing of " + target + " for " + folio);
    FOLIO = folio;

    //Now decide what to load based on the target
    switch(target.toLowerCase()){
        case "iliadtext":
            loadFile("relations/venA-textToImage-Iliad/" + folio + ".cex", indexIliad);
        break;
        case "mainscholia":
            TYPE = "main";
            loadFile("dse-models/venA-mainScholia/" + folio + ".cex", indexScholia);
        break;
        case "interiorscholia":
            TYPE = "interior";
            loadFile("dse-models/venA-interior/" + folio + ".cex", indexScholia);
        break;
        case "intermarginalscholia":
            TYPE = "intermarginal";
            loadFile("dse-models/venA-intermarginal/" + folio + ".cex", indexScholia);
        break;
        case "interlinearscholia":
            TYPE = "interlinear";
            loadFile("dse-models/venA-interlinear/" + folio + ".cex", indexScholia);
        break;
        case "exteriorscholia":
            TYPE = "exterior";
            loadFile("dse-models/venA-exterior/" + folio + ".cex", indexScholia);
        break;
    }
}

/**
 * Once provided with the string data will proceed to validate it
 * @param {String} file 
 */
function indexScholia(file){
    var type = TYPE;
    //Divide the file up in lines and drop the first line (the header);
    var lines = file.split("\n");
    lines.splice(0, 1);

    //Create the empty report string;
    var report = "# Verification of index for *" + capitalize(type) + " Scholia*\n\n";
    //Add the table header
    report += "| Text     | Image     |\n| :------------- | :------------- |\n"
    //Now loop through all the lines and evaluate all parts
    var parts = []; var reportLine;
    for(var i = 0; i < lines.length; i++){
        //Skip empty lines
        if(lines[i].trim().length == 0) continue;
        //Make the default line
        reportLine = "| PASSAGE | IMAGE |\n";
        //Split the columns
        parts = lines[i].split("#");
        //If there are not 4 parts, please stop
        if(parts.length != 4 && parts.length != 3){
            reportLine.replace("PASSAGE", "Wrong number of columns in line " + (i + 2));
            report += reportLine;
            //Continue with the next line
            continue;
        }

        //Try to parse the passage URN
        var passageURN = new URN(parts[0]);
        if(passageURN){
            reportLine = reportLine.replace("PASSAGE", passageURN.parts[4]);
        }else{
            reportLine = reportLine.replace("PASSAGE", "Bad URN");
        }

        //Try to parse the image URN
        var imageURN = new URN(parts[1]);
        if(imageURN){
            reportLine = reportLine.replace("IMAGE", "![" + passageURN.parts[4] + "](" + getImageURLFromURN(imageURN) + ")");
        }else{
            reportLine = reportLine.replace("IMAGE", "Bad URN");
        }

        //Add the line to the report
        report += reportLine;
    }

    submitReport("indexing-scholia-" + type + "-" + FOLIO + ".md", report);
}

/**
 * Once provided with the string data will proceed to validate it
 * @param {String} file 
 */
function indexIliad(file){
    //Divide the file up in lines and drop the first line (the header);
    var lines = file.split("\n");
    lines.splice(0, 1);

    //Create the empty report string;
    var report = "# Verification of index for *Iliad* text\n\n";
    //Add the table header
    report += "| Text     | Image     |\n| :------------- | :------------- |\n"
    //Now loop through all the lines and evaluate all parts
    var parts = []; var reportLine;
    for(var i = 0; i < lines.length; i++){
        //Skip empty lines
        if(lines[i].trim().length == 0) continue;
        //Make the default line
        reportLine = "| PASSAGE | IMAGE |\n";
        //Split the columns
        parts = lines[i].split("#");
        //If there are not 4 parts, please stop
        if(parts.length != 4 && parts.length != 3){
            reportLine.replace("PASSAGE", "Wrong number of columns in line " + (i + 2));
            report += reportLine;
            //Continue with the next line
            continue;
        }

        //Try to parse the passage URN
        var passageURN = new URN(parts[0]);
        if(passageURN){
            reportLine = reportLine.replace("PASSAGE", passageURN.parts[4]);
        }else{
            reportLine = reportLine.replace("PASSAGE", "Bad URN");
        }

        //Try to parse the image URN
        var imageURN = new URN(parts[2]);
        if(imageURN){
            reportLine = reportLine.replace("IMAGE", "![" + passageURN.parts[4] + "](" + getImageURLFromURN(imageURN) + ")");
        }else{
            reportLine = reportLine.replace("IMAGE", "Bad URN");
        }

        //Add the line to the report
        report += reportLine;
    }

    submitReport("indexing-iliad-" + FOLIO + ".md", report);
}