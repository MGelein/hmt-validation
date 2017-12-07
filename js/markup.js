var TYPE;
var FOLIO;
/**
 * This 'class' handles the validation of XML markup
 * @param {String} target defines what kind of indexing we're validating
 * @param {String} folio defines what folio we're working on
 */
function Markup(target, folio){
    console.log("Starting validation of XML Markup of " + target + " for " + folio);
    FOLIO = folio;

    //Now decide what to load based on the target
    switch(target.toLowerCase()){
        case "iliadtext":
            TYPE = "iliad";
            loadFile("editions/Iliad/" + folio + ".xml", validateXML);
        break;
        case "mainscholia":
            TYPE = "scholia-main";
            loadFile("editions/scholia/MainScholia/" + folio + ".xml", validateXML);
        break;
        case "interiorscholia":
            TYPE = "scholia-interior";
            loadFile("editions/scholia/InteriorScholia/" + folio + ".xml", validateXML);
        break;
        case "intermarginalscholia":
            TYPE = "scholia-intermarginal";
            loadFile("editions/scholia/IntermarginalScholia/" + folio + ".xml", validateXML);
        break;
        case "interlinearscholia":
            TYPE = "scholia-interlinear";
            loadFile("editions/scholia/InterlinearScholia/" + folio + ".xml", validateXML);
        break;
        case "exteriorscholia":
            TYPE = "scholia-exterior";
            loadFile("editions/scholia/ExteriorScholia/" + folio + ".xml", validateXML);
        break;
    }
}
/**
 * Validates the file once it receives it from github
 * @param {String} file 
 */
function validateXML(file){
    var report = "# Validating XML Markup of " + capitalize(TYPE) + "\n\n";
    //Create re-usable variables
    var urn; var name; var person; var resolved; var desc;

    //First make the table for the personal names
    report += startNewTable("persName");
    var persNames = $(file).find('persName').each(function(){
        urn = $(this).attr('n');
        person = persons[urn];
        resolved = person ? person.label : "No Match";
        desc = person ? person.desc : "No Match";
        report += "| " + $(this).text() + " | " + urn + " | " + resolved + " | " + desc + " | \n";
    });

    report += startNewTable("placeName");
    var placeNames = $(file).find('placeName');

    report += startNewTable("rs");
    var rsNames = $(file).find('rs');

    submitReport("markup-" + TYPE + "-" + FOLIO + ".md", report);
}

/**
 * Returns the start of a new table to add a new header to the report
 * @param {String} name 
 */
function startNewTable(name){
    var s = "\n## " + capitalize(name) + " \n\n";
    s += "| Reading | URN | Resolved | Description |\n";
    s += "| :------------- | :------------- | :------------- |\n";
    return s;
}