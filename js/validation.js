/**
 * Entry point
 */
$(document).ready(init);

/**
 * Called to re-init or init
 */
function init(){
    //Be ready for the first step to be taken
    $('#step2,#step3,#step4,#explanation').hide();

    //Called when the first step has been made
    $('#step1 .btn').unbind('click').click(function(){
        //Make sure this is the only active within this button group
        $(this).parent().find('.active').removeClass('active');
        $(this).toggleClass('active');

        if($(this).html().indexOf('aleo') != -1){
            //Show the explanation if Paleo was chosen
            $('#explanation').html("For Paleography Scholia type doesn't matter, choose any type or Iliad text");
            $('#explanation').fadeIn();
        }else{
            $('#explanation').fadeOut();
        }

        //Now show step2 and add listeners
        $('#step2').fadeIn(1000).find('.btn').unbind('click').click(function(){
            //Make sure this is the only active within this button group
            $(this).parent().find('.active').removeClass('active');
            $(this).toggleClass('active');
            
            //Now show step3 and add listeners
            $('#step3').fadeIn(1000);
            //When we start typing, show step4
            $('#folioField').focus().keydown(function(event){
                $('#step4').fadeIn(1000);
                //After the first key start listening to make sure all keys are correct
                $('#folioField').unbind('keydown').keydown(function(event){
                    //Check input
                });
                //And add the listener to the validate button
                $('#validateButton').unbind('click').click(function(){
                    //Stop listening for more clicks
                    $('#validateButton').unbind('click').removeClass('btn-primary').addClass('btn-warning').html('Validating...');

                    //Get the data from the selection and sanitize the input
                    var type = $('#step1 .active').html().toLowerCase().replace(/\s/g, '');
                    var target = $('#step2 .active').html().toLowerCase().replace(/\s/g, '');
                    var folio = $('#folioField').val().toLowerCase().replace(/\s/g, '');

                    startValidation(type + "-" + target, folio);
                });
            });
        });
    });
};

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
        case 'indexing':
            Index(target, folio);
        break;
        case 'paleo':
            Paleo(target, folio);
        break;
        case 'xmlmarkup':
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
    var url = "http://www.homermultitext.org/iipsrv?OBJ=IIP,1.0&FIF=/project/homer/pyramidal/VenA/%FOLIO%.tif&RGN=REGION&WID=800&CVT=JPEG";

    //Split the URN into the necessary parts
    var region = urn.getModifier();
    var folioName = urn.parts[4].replace("@" + region, '');
    
    //Replace the region
    url = url.replace("REGION", region.trim());
    url = url.replace("%FOLIO%", folioName.trim());

    //Now return the finished url
    return url;
}

/**
 * Loads a file from the raw github server
 * @param {String} file the url of the file to load 
 * @param {Function} callback called with the loaded data as an argument
 */
function loadFile(file, callback){
    $.get("https://raw.githubusercontent.com/hmteditors/leiden2017/master/" + file.trim(), function(data){
        callback(data);
    });
}

/**
 * Submits the generated report file to be downloaded by the user
 * @param {String} name
 * @param {String} data 
 */
function submitReport(name, data){
    var data = "data:text/json;charset=utf-8," + encodeURI(data);
    //Then create the clicked link and download
    var link = document.createElement('a');
    link.download = name;
    link.href = data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    //Now show we're done
    $('#validateButton').removeClass('btn-warning').addClass('btn-success').html("Done!");
    $('#folioField').val('');
    $('.active').removeClass('active');
    $('#step3').fadeOut(1000, function(){
        $('#step2').fadeOut(1000, function(){
            $('#validateButton').removeClass('btn-success').addClass('btn-primary').html('Validate');
            $('#step4').fadeOut(1000), function(){
                init();
            }
        });
    });
}

/**
 * Turns the string into lowercase witht the first letter uppercase
 * @param {String} s 
 */
function capitalize(s){
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
}