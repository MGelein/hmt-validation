/**
 * Defines the Index class. This 'class' handles validation of indexing
 * @param {String} target defines what kind of indexing we're validating
 * @param {String} folio defines what folio we're working on
 */
function Index(target, folio){
    console.log("Starting validation of indexing of " + target + " for " + folio);

    //Now decide what to load based on the target
    switch(target.toLowerCase()){
        case "iliad":
            loadFile("relations/venA-textToImage-Iliad/" + folio + ".cex", indexIliad);
        break;
        case "mainscholia":
        break;
        case "interiorscholia":
        break;
        case "intermarginalscholia":
        break;
        case "interlinearscholia":
        break;
        case "exteriorscholia":
        break;
    }
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
        //Make the default line
        reportLine = "|PASSAGE|IMAGE|\n";
        //Split the columns
        parts = lines[i].split("#");
        //If there are not 4 parts, please stop
        if(parts.length != 4){
            reportLine.replace("PASSAGE", "Wrong number of columns in line " + (i + 2));
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
            reportLine = reportLine.replace("IMAGE", getImageURLFromURN(imageURN));
        }else{
            reportLine = reportLine.replace("IMAGE", "Bad URN");
        }

        //Add the line to the report
        report += reportLine;
    }
}