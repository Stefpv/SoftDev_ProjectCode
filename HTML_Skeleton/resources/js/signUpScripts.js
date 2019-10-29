// Create object for each region, which will contain the region name and an array of the residence halls in the region
var centralCampus = {
    region: "Central Campus",
    halls: [{hallName: "Aden", floorNumbers: [1,2]},{hallName: "Baker", floorNumbers: [1,2,3,4,5]},{hallName: "Bracket", floorNumbers: [1,2]},{hallName: "Cheyenne Arapaho", floorNumbers: [1,2,3]},{hallName: "Cockerell", floorNumbers: [1,2]},{hallName: "Crosman", floorNumbers: [1,2]},{hallName: "Farrand", floorNumbers: [1,2,3,4,5]},{hallName: "Hallet", floorNumbers: [1,2,3]},{hallName: "Libby", floorNumbers: [1,2,3]},{hallName: "Reed", floorNumbers: [1,2]},{hallName: "Willard", floorNumbers: [1,2,3]}]
};

var kittredgeLoop = {
    region: "Kittredge Loop",
    halls: [{hallName: "Andrews", floorNumbers: [1,2,3]},{hallName: "Arnett", floorNumbers: [1,2,3]},{hallName: "Buckingham", floorNumbers: [1,2,3]},{hallName: "Kittredge Central", floorNumbers: [1,2,3,4]},{hallName: "Kittredge West", floorNumbers: [1,2,3,4]},{hallName: "Smith", floorNumbers: [1,2,3]}]
};

var willVill = {
    region: "Williams Village",
    halls: [{hallName: "Darley North", floorNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},{hallName: "Darley South", floorNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},{hallName: "Stearns East", floorNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13]},{hallName: "Stearns West", floorNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13]},{hallName: "Williams Village East", floorNumbers: [1,2,3,4,5,6,7]},{hallName: "Williams Village North", floorNumbers: [1,2,3,4,5,6]}]
};

var sewall = {
    region: "Sewall",
    halls: [{hallName: "Sewall", floorNumbers: [1,2,3,4,5]}]
};

// Array to hold the 4 regions
var campusRegions = [centralCampus,kittredgeLoop,sewall,willVill];

// Function that creates the menu of campus regions
function regionDropDown(){
    
    var regionSelection = document.getElementById("campusRegionSelect");

    // The first option in the menu is just telling the user to select one of the following options
    var dropDownTitle = document.createElement('option');
    dropDownTitle.setAttribute('value',"Select Region");
    dropDownTitle.setAttribute('label',"Select Region");
    dropDownTitle.setAttribute('selected',true);
    regionSelection.add(dropDownTitle);

    var counter;
    for(counter=0; counter<campusRegions.length; counter++){
        var newRegion = document.createElement('option');
        newRegion.setAttribute('value',campusRegions[counter].region);
        newRegion.setAttribute('label',campusRegions[counter].region);
        regionSelection.add(newRegion);
    }
}

// Fills the hall menu depending on which region is selected
function hallDropDown(){

    // Access the region that has been selected, and the hall menu
    var regionName = document.getElementById("campusRegionSelect").value;
    var hallSelect = document.getElementById("residenceHallSelect");
    var length = hallSelect.length;

    // Clear out the current options
    if(length > 0){
        var k;
        for(k=length; k>=0; k--){
            hallSelect.remove(k);
        }
    }
    
    // The first option in the menu is just telling the user to select one of the following options
    var dropDownTitle = document.createElement('option');
    dropDownTitle.setAttribute('value',"Select Residence Hall");
    dropDownTitle.setAttribute('label',"Select Residence Hall");
    dropDownTitle.setAttribute('selected',true);
    hallSelect.add(dropDownTitle);

    // Add the new options
    var i;
    for(i=0; i<campusRegions.length; i++){
        if(regionName == campusRegions[i].region){
            var j;
            for(j=0; j<campusRegions[i].halls.length; j++){
                var newHall = document.createElement('option');
                newHall.setAttribute('value',campusRegions[i].halls[j].hallName);
                newHall.setAttribute('label',campusRegions[i].halls[j].hallName);
                hallSelect.add(newHall);
            }
            break;
        }
    }

    floorDropDown();
}

function floorDropDown(){

    // Access menus
    var regionName = document.getElementById("campusRegionSelect").value;
    var selectedHall = document.getElementById("residenceHallSelect").value;
    var floorNumber = document.getElementById("floorNumberSelect");

    // Length of the floor dropdown
    var length = floorNumber.length;

    // Clear out the current options
    if(length > 0){
        var l;
        for(l=length; l>=0; l--){
            floorNumber.remove(l);
        }
    }

    // The first option in the menu is just telling the user to select one of the following options
    var dropDownTitle = document.createElement('option');
    dropDownTitle.setAttribute('value',"Select Floor");
    dropDownTitle.setAttribute('label',"Select Floor");
    dropDownTitle.setAttribute('selected',true);
    floorNumber.add(dropDownTitle);

    // Search through campus regions and find the current hall, and then add the number of floors in that given hall
    var i;
    for(i=0; i<campusRegions.length; i++){
        if(campusRegions[i].region == regionName){
            var j;
            for(j=0; j<campusRegions[i].halls.length; j++){
                if(campusRegions[i].halls[j].hallName == selectedHall){
                    var k;
                    for(k=0; k<campusRegions[i].halls[j].floorNumbers.length; k++){
                        var newFloor = document.createElement('option');
                        newFloor.setAttribute('value',campusRegions[i].halls[j].floorNumbers[k]);
                        newFloor.setAttribute('label',campusRegions[i].halls[j].floorNumbers[k].toString());
                        floorNumber.add(newFloor);
                    }
                    break;
                }
            }
            break;
        }
    }
}

function enableButton(region, residenceHall, floorNumber, firstName, lastName, email, minimumLength, lowercase, uppercase, number, specChar, psswdsMatch){
    // Check that all fields are filled
    console.log("inside enable button");

        // Check that the dropdown menus have an option other than the first selected
        var livingSituationFilled = (region.value != "Select Region") && (residenceHall.value != "Select Residence Hall") && (floorNumber.value != "Select Floor");
        if(livingSituationFilled){
            console.log("Living Situation is filled");
        }

        // Check that the name fields are not empty
        var namesFilled = (firstName.value != "") && (lastName.value != "");

        // Check that the email ends in @colorado.edu
        var checkEmail = email.classList.contains("valid");
        
        // Check that the password requirements are all of class="valid"
        var psswdRequirementsMet = minimumLength.classList.contains("valid-password") && lowercase.classList.contains("valid-password") && uppercase.classList.contains("valid-password") && number.classList.contains("valid-password") && specChar.classList.contains("valid-password");

        // Check that the confirm password is valid
        var checkConfPassword = psswdsMatch.classList.contains("valid");
        
        // if all of the requirements are met, enable the submit button
        if(livingSituationFilled && namesFilled && checkEmail && psswdRequirementsMet && checkConfPassword){
            var submitButton = document.getElementById("mySubmitButton");
            submitButton.disabled = false;
            submitButton.classList.remove("not-allowed");
        }
}

function startSignUp(){

    // Create region drop down
    regionDropDown();

    // Create hall drop down
    hallDropDown();

    // Create floor drop down
    floorDropDown();

    // Retrieve variable inputs from the form
    var region = document.getElementById("campusRegionSelect");
    var residentHall = document.getElementById("residenceHallSelect");
    var floorNumber = document.getElementById("floorNumberSelect");
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var email = document.getElementById("staffEmail");
    var password = document.getElementById("userPassword");
    var confirmPassword = document.getElementById("confirmPassword");

    // Try to enable the button once the floor has been chosen
    floorNumber.onchange = function(){
        // enable the button if all fields are valid
        enableButton(region,residentHall,floorNumber,firstName,lastName,emailValid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }

    // Try to enable the button when the first name and last name fields are being completed
    firstName.onblur = function(){
        // enable the button if all fields are valid
        enableButton(region,residentHall,floorNumber,firstName,lastName,emailValid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }
    lastName.onblur = function(){
        // enable the button if all fields are valid
        enableButton(region,residentHall,floorNumber,firstName,lastName,emailValid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }

    // Retrieve requirement fields
    var emailValid = document.getElementById("validEmail");
    var minimum = document.getElementById("minimum");
    var lowerLetter = document.getElementById("lowercase");
    var upperLetter = document.getElementById("uppercase");
    var digit = document.getElementById("number");
    var specialCharacter = document.getElementById("specialChar");
    var match = document.getElementById("passwordsMatch");

    // Check that the email is @colorado.edu
    email.onfocus = function(){
        
        // Set the requirement mark to an 'x' if nothing has been typed
        if(email.value == ""){
            emailValid.setAttribute('class',"invalid");
        }

        email.onkeyup = function(){

            // Create regular expressions to check that the email is @colorado.edu
            var studentEmail1 = /[a-z]+\.[a-z]+@colorado.edu$/g;
            var studentEmail2 = /[a-z]{4}[0-9]{4}@colorado.edu$/g;

            // Validate the email
            if(email.value.match(studentEmail1) || email.value.match(studentEmail2)){
                emailValid.classList.remove("invalid");
                emailValid.classList.add("valid");
            }
            else{
                emailValid.classList.add("invalid");
                emailValid.classList.remove("valid");
            }
            // enable the button if all fields are valid
            enableButton(region,residentHall,floorNumber,firstName,lastName,emailValid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
        }
    }

    // Reset the email indicator if no email has been typed
    email.onblur = function(){
        if(email.value == ""){
            emailValid.classList.remove("valid","invalid");
        }
    }

    // Check password requirements
    password.onfocus = function(){

        // Set the requirements to invalid if there is nothing typed in the passwrod field
        if(password.value == ""){
            minimum.setAttribute('class',"invalid-password");
            lowerLetter.setAttribute('class',"invalid-password");
            upperLetter.setAttribute('class',"invalid-password");
            digit.setAttribute('class',"invalid-password");
            specialCharacter.setAttribute('class',"invalid-password");
        }

        password.onkeyup = function(){
            // Create the proper regular expressions to check for the requirements
            var lowerCaseLetters = /[a-z]/g; // for lowercase
            var upperCaseLetters = /[A-Z]/g; // for uppercase
            var numbers = /\d/g; // for numbers (0-9)
            var characterSpecial = /\W/g; // for special characters
            var minLength = 12; // for the minumum length

            // Validate lowercase letters
            if(password.value.match(lowerCaseLetters)) {             
                lowerLetter.classList.remove("invalid-password"); 
                lowerLetter.classList.add("valid-password"); 
            } else {
                lowerLetter.classList.remove("valid-password"); 
                lowerLetter.classList.add("invalid-password"); 
            }

            // Validate uppercase letters        
            if(password.value.match(upperCaseLetters)) { 
                upperLetter.classList.remove("invalid-password"); 
                upperLetter.classList.add("valid-password");
            } else {
                upperLetter.classList.remove("valid-password");
                upperLetter.classList.add("invalid-password");
            }

            // Validate numbers        
            if(password.value.match(numbers)) { 
                digit.classList.remove("invalid-password"); 
                digit.classList.add("valid-password"); 
            } else {
                digit.classList.remove("valid-password"); 
                digit.classList.add("invalid-password");
            }

            // Validate special characters
            if(password.value.match(characterSpecial)) {             
                specialCharacter.classList.remove("invalid-password"); 
                specialCharacter.classList.add("valid-password"); 
            } else {
                specialCharacter.classList.remove("valid-password"); 
                specialCharacter.classList.add("invalid-password"); 
            }

            // Validate length
            if(password.value.length >= minLength) {
                minimum.classList.remove("invalid-password");
                minimum.classList.add("valid-password");
            } else {
                minimum.classList.remove("valid-password");
                minimum.classList.add("invalid-password");
            }

            // enable the button if all fields are valid
            enableButton(region,residentHall,floorNumber,firstName,lastName,emailValid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
        }        
    }

    // Reset the style attributes of all the requirements in the list if the field is empty and the user clicks out of the text box
    password.onblur = function(){
        if(password.value == ""){
            minimum.classList.remove("valid-password","invalid-password");
            lowerLetter.classList.remove("valid-password","invalid-password");
            upperLetter.classList.remove("valid-password","invalid-password");
            digit.classList.remove("valid-password","invalid-password");
            specialCharacter.classList.remove("valid-password","invalid-password");
        }
    }

    // Check that the confirm password field is the same as the password field
    confirmPassword.onfocus = function(){
        if(confirmPassword.value == "" && password.value != ""){
            match.setAttribute('class',"invalid");
        }

        confirmPassword.onkeyup = function(){
            if(confirmPassword.value == password.value && password.value != ""){
                match.classList.add("valid");
                match.classList.remove("invalid");
            }
            else{
                match.classList.remove("valid");
                match.classList.add("invalid");
            }

            // enable the button if all fields are valid
            enableButton(region,residentHall,floorNumber,firstName,lastName,emailValid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
        }
    }

    // Reset the password indicator if the confirm password field is empty
    confirmPassword.onblur = function(){
        if(confirmPassword.value == ""){
            match.classList.remove("valid","invalid");
        }
    }
}


function resetForm(){

    // Access the various inputs
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var email = document.getElementById("staffEmail");
    var password = document.getElementById("userPassword");
    var confirmPassword = document.getElementById("confirmPassword");
    var regions = document.getElementById("campusRegionSelect");
    var residentHalls = document.getElementById("residenceHallSelect");
    var floorNumbers = document.getElementById("floorNumberSelect");

    // Reset all inputs
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";

    var hallLength = residentHalls.length;
    var regionLength = regions.length;
    var floorLength = floorNumbers.length;

    var i;
    for(i=hallLength; i>=0; i--){
        residentHalls.remove(i);
    }

    var j;
    for(j=regionLength; j>=0; j--){
        regions.remove(j);
    }

    var k;
    for(k=floorLength; k>=0; k--){
        floorNumbers.remove(k);
    }

    // Retrieve requirement fields
    var emailValid = document.getElementById("validEmail");
    var minimum = document.getElementById("minimum");
    var lowerLetter = document.getElementById("lowercase");
    var upperLetter = document.getElementById("uppercase");
    var digit = document.getElementById("number");
    var specialCharacter = document.getElementById("specialChar");
    var match = document.getElementById("passwordsMatch");
    
    // Reset the color/class of the requirement fields
    minimum.classList.remove("valid-password","invalid-password");
    lowerLetter.classList.remove("valid-password","invalid-password");
    upperLetter.classList.remove("valid-password","invalid-password");
    digit.classList.remove("valid-password","invalid-password");
    specialCharacter.classList.remove("valid-password","invalid-password");

    // Reset the email requirement mark
    emailValid.classList.remove("valid","invalid");

    // Reset the confirm password requirement mark
    match.classList.remove("valid","invalid");

    // Disable the submit button
    var submitBtn = document.getElementById("mySubmitButton");
    submitBtn.disabled = true;
    submitBtn.classList.add("not-allowed");
}