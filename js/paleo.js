var TYPE;
var FOLIO;
/**
 * This 'class' handles the validation of Paleographic transcriptions
 * @param {String} target defines what kind of indexing we're validating
 * @param {String} folio defines what folio we're working on
 */
function Paleo(target, folio){
    console.log("Starting validation of Paleography of " + target + " for " + folio);

    //Lowercase the target to be sure. Choose SCHOLIA or ILIAD
    if(target.toLowerCase().indexOf('scholia') != -1){
        TYPE = "scholia";
    }else{
        TYPE = "iliad";
    }
    FOLIO = folio;
    loadFile("paleography/paleography-" + TYPE + '/' + FOLIO + '.cex', validatePaleo);
}

function validatePaleo(file){
    //Divide the file up in lines and drop the first line (the header);
    var lines = file.split("\n");
    lines.splice(0, 1);

    //Create the empty report string;
    var report = "# Verification of Paleography for *" + capitalize(TYPE) + "*\n\n";
    //Add the table header
    report += "| Record | Reading | Image |\n| :------------- | :------------- | :------------- |\n"
    //Now loop through all the lines and evaluate all parts
    var parts = []; var reportLine;
    for(var i = 0; i < lines.length; i++){
        //Skip empty lines
        if(lines[i].trim().length == 0) continue;
        //Make the default line
        reportLine = "| RECORD | READING | IMAGE |\n";
        //Split the columns
        parts = lines[i].split("#");
        //If there are not 4 parts, please stop
        if(parts.length != 4 && parts.length != 3 && parts.length != 5){
            reportLine.replace("READING", "Wrong number of columns in line " + (i + 2));
            report += reportLine;
            //Continue with the next line
            continue;
        }

        //Try to parse the record URN
        var recordURN = new URN(parts[0]);
        if(recordURN){
            reportLine = reportLine.replace("RECORD", recordURN.urnString);
        }else{
            reportLine = reportLine.replace("RECORD", BAD_URN);
        }

        //Try to parse the record URN
        var readingURN = new URN(parts[1]);
        if(readingURN){
            reportLine = reportLine.replace("READING", readingURN.getModifier());
        }else{
            reportLine = reportLine.replace("READING", BAD_URN);
        }

        //Try to parse the image URN
        var imageURN = new URN(parts[2]);
        if(imageURN){
            reportLine = reportLine.replace("IMAGE", "![" + recordURN.parts[4] + "](" + getImageURLFromURN(imageURN) + ")");
        }else{
            reportLine = reportLine.replace("IMAGE", BAD_URN);
        }

        //Add the line to the report
        report += reportLine;
    }

    submitReport("paleo-" + TYPE + "-" + FOLIO + ".md", report);
}