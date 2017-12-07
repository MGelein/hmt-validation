/**
 * Contains the URN class. Example urn: `urn:cite2:hmt:pers:pers1`
 * @param {String} urnString the string that will be parsed to URN
 * @returns {URN} returns itself if succesful, undefined if not
 */
function URN(urnString){
    //Stores the original data object
    this.urnString = urnString;
    //Assume it is not valid untill proven otherwise
    this.valid = false;

    //The string has to be set
    if(this.urnString == undefined) {
        console.error("URN constructor String undefined.");
        return;
    }
    //The string has to have at least 9 character (5 parts & 4 delimiters)
    if(this.urnString.length < 9){
        console.error("URN constructor String has to have at least 8 characters (4 parts & 4 delimiters");
        return;
    }
    
    //Stores the parts of the urn string
    this.parts = urnString.split(":");

    //The URN has to consist of exactly 5 parts
    if(this.parts.length != 5){
        console.error("URN does not define enough parts. " +  this.parts.length + " were found but 5 were expected");
        return;
    }
    //First part should ALWAYS be URN
    if(this.parts[0] != "urn"){
        console.error("URN's should ALWAYS start with 'urn:' instead of " + this.parts[0]);
        return;
    }

    //This is a valid urn. Tag it as such and return this instance
    this.valid = true;
    return this;
}