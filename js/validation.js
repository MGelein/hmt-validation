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
        break;
        case 'paleo':
        break;
        case 'markup':
        break;
        default:
            console.log("Unknown method of validation: " + method);
        break;
    }
}
