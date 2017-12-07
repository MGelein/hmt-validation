/**
 * Entry point
 */
$(document).ready(init);

/**
 * Called to re-init or init
 */
function init(){
    //Be ready for the first step to be taken
    $('#step2,#step3,#step4,#explanation,#step1').hide();

    //Start loading external dependencies if not already loaded
    if(!persons) getPersonDB();

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
                    if(event.which == 13) $('#validateButton').click();
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
 * Submits the generated report file to be reviewed and downloaded by the user
 * @param {String} name
 * @param {String} data 
 */
function submitReport(name, data){
    //Create the markdown convertor
    showdown.setOption('tables', true);
    var convertor = new showdown.Converter();

    //Set the content after conversion
    var html = "<p>Please carefully validate the data below. If anything seems wrong, fix it in the file and revalidate. You can either approve or cancel this validation at the bottom of this preview</p>";
    html += convertor.makeHtml(data);
    html += getPreviewEnd();
    $('#normalRow').fadeOut(600, function(){
        $('#previewRow').fadeIn().find('.panel-body').html(html);
        styleAllTables();
        $('#correctButton').unbind('click').click(function(){
            downloadReport(name, data);
        });
        $('#incorrectButton').unbind('click').click(function(){
            startReinit();
        });
    });
}

/**
 * This returns the end String of a preview window
 */
function getPreviewEnd(){
    var s = "<h4>Is This Validation Report Correct?</h4><p class='col-xs-6'>";
    s += "If this validation report is <span class='bg-success text-success'>correct</span>, please download it, put it in the <code>reports</code> folder and <code>git push</code> it to the online repository. You can then mark your task as done.</p>";
    s += "<p class='col-xs-6'>If this validation report is <span class='bg-danger text-danger'>incorrect</span>, please cancel this preview, make the necessary revisions and revalidate."
    s += "</p><div class='btn-group btn-group-justified'>";
    s += "<a id='correctButton' href='#' class='btn btn-success'>Correct (Download File)</a>";
    s += "<a id='incorrectButton' href='#' class='btn btn-danger'>Incorrect (Cancel File)</a>";
    s += "</div>"
    return s;
}

/**
 * Starts the reinitializartion
 */
function startReinit(){
    $('#previewRow').fadeOut(600, function(){
        $('#normalRow').fadeIn();
    });
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
 * Style all tables
 */
function styleAllTables(){
    //Apply the correct bootstrap classes
    $('table').addClass('table table-striped table-bordered table-responsive');
    $('img').addClass('imgPreview')
}

/**
 * Actually downloads the report
 * @param {String} name 
 * @param {String} data 
 */
function downloadReport(name, data){
    var data = "data:text/plain;charset=utf-8," + encodeURI(data);
    //Then create the clicked link and download
    var link = document.createElement('a');
    link.download = name;
    link.href = data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    //Now reinit the doc
    startReinit();
}

/**
 * Turns the string into lowercase witht the first letter uppercase
 * @param {String} s 
 */
function capitalize(s){
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
}

//Person hash table by their URN
var persons;
function getPersonDB(){
    persons = {};
    $.get("https://raw.githubusercontent.com/homermultitext/hmt-authlists/master/data/hmtnames.csv?v=" + $.now(), function(data){
        var lines = data.split('\n'), parts;
        lines.forEach(function(line){
            parts = line.split(',');
            persons[parts[0]] = {
                label: parts[1],
                desc: parts[2],
                status: parts[3]
            };
        });
        getPlaceDB();
    });
}

var places;
function getPlaceDB(){
    places = {};
    $.get("https://raw.githubusercontent.com/homermultitext/hmt-authlists/master/data/hmtplaces.csv?v=" + $.now(), function(data){
        var lines = data.split('\n'), parts;
        lines.forEach(function(line){
           parts = line.split(',');
           places[parts[0]] = {
                label: parts[1],
                desc: parts[2],
                pleiades: parts[3],
                status: parts[4]
           };
        });
        $('#stepLoading').fadeOut(500, function(){
            $('#step1').fadeIn();
            $(this).remove();
        })
    });
}