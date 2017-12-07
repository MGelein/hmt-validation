/**
 * Entry point
 */
$(document).ready(function(){
    //Attach a listener to all buttons to call the same function
    $('button').click(function(){
        var validating = $(this).attr('validating');
        var folio = $(this).parent().parent().find('input[type="text"]').val().trim();
        
        //If there are illegal characters in the string
        if((folio.replace(/[a-z0-9]/g, '')).length > 0){
            console.log("Illegal Characters in URN");
            return false;
        }

        //We assume it is a good validating request, let's start it after clearing the field
        $(this).parent().parent().find('input[type="text"]').val('');
        startValidation(validating, folio);
    });
});

/**
 * This function decides what we're validating
 * @param {String} validating   the validating attribute of the button, decides what we're validating
 * @param {String} folio        decides what folio we're validating
 */
function startValidation(validating, folio){
    //Parse the validating part to figure out what we're going to do
    var validatingParts = validating.split("-");
    var method = validatingParts[0];
    var target = validatingParts[1];
    
    //Now switch based on the method
    switch(method){
        case 'index':
            Index(target, folio);
        break;
        case 'paleo':
            Paleo(target, folio);
        break;
        case 'markup':
            Markup(target, folio);
        break;
        default:
            console.log("Unknown method of validation: " + method);
        break;
    }
}

/**
 * Tries to parse a URN into a <img> element
 * @param {URN} urn a urn string data boject
 */
function getImageURLFromURN(urn){
    //Base image location
    var url = "http://www.homermultitext.org/iipsrv?OBJ=IIP,1.0&FIF=/project/homer/pyramidal/VenA/%FOLIO%.tif&RGN=%REGION%&WID=800&CVT=JPEG";

    //Split the URN into the necessary parts
    var region = urn.getModifier();
    var folioName = urn.parts[4].replace("@" + region, '');
    
    //Replace the region
    url = url.replace("%REGION%", region);
    url = url.replace("%FOLIO%", folioName);

    //Now return the finished url
    return url;
}