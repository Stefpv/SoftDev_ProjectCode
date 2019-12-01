/** Project: Residence Hall Advisor Portal
 *  This file: controls the functionality of the sign up page
 */

// Enables the button if all fields of the form are filled
function enableButton(firstName, lastName, residentAdvisor, hallDirecor, email, userID, minimumLength, lowercase, uppercase, number, specChar, psswdsMatch){
    // Check that all fields are filled
    console.log("inside enable button");

        // Check that the name fields are not empty
        var namesFilled = (firstName.value != "") && (lastName.value != "");

        // Check that either the RA of Hall Director options are checked off
        var staffPositionSelected = (residentAdvisor.checked) || (hallDirecor.checked);

        // Check that the email is valid
        var checkEmail = email.classList.contains("valid");

        // Check that the studnet ID is valid
        var checkID = userID.classList.contains("valid");
        
        // Check that the password requirements are all valid
        var psswdRequirementsMet = minimumLength.classList.contains("valid-password") && lowercase.classList.contains("valid-password") && uppercase.classList.contains("valid-password") && number.classList.contains("valid-password") && specChar.classList.contains("valid-password");

        // Check that the confirm password is valid
        var checkConfPassword = psswdsMatch.classList.contains("valid");
        
        // if all of the requirements are met, enable the submit button
        if(namesFilled && staffPositionSelected && checkEmail && checkID && psswdRequirementsMet && checkConfPassword){
            var submitButton = document.getElementById("mySubmitButton");
            submitButton.disabled = false;
            submitButton.classList.remove("not-allowed");
        }
}

function startSignUp(){

    // Retrieve variable inputs from the form
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var residentAdvisor = document.getElementById("residentAdvisor");
    var hallDirector = document.getElementById("hallDirector");
    var email = document.getElementById("staffEmail");
    var userID = document.getElementById("userID");
    var password = document.getElementById("userPassword");
    var confirmPassword = document.getElementById("confirmPassword");

    // Try to enable the button when the first name and last name fields are being completed
    firstName.onblur = function(){
        // enable the button if all fields are valid
        enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }

    lastName.onblur = function(){
        // enable the button if all fields are valid
        enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }

    // Try to enable the button when one of the staff positions is selected
    residentAdvisor.onclick = function(){
        residentAdvisor.checked = true;
        hallDirector.checked = false;

        // Direct the labeling/content to resident advisors
        document.getElementById("emailRequirement").innerHTML = "Must be your student email associated with the university";
        document.getElementById("idHeader").innerHTML = "Student ID";
        userID.placeholder = "Your 9 Digit Student ID";

        // Try to enable the submit button
        enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }

    hallDirector.onclick = function(){
        residentAdvisor.checked = false;
        hallDirector.checked = true;

        // Direct the labeling/content to hall directors
        document.getElementById("emailRequirement").innerHTML = "Must be your staff email associated with the university";
        document.getElementById("idHeader").innerHTML = "Staff ID";
        userID.placeholder = "Your 9 Digit Staff ID";

        // Try to enable the submit button
        enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
    }

    // Retrieve requirement fields
    var emailValid = document.getElementById("validEmail");
    var userIDvalid = document.getElementById("validID");
    var minimum = document.getElementById("minimum");
    var lowerLetter = document.getElementById("lowercase");
    var upperLetter = document.getElementById("uppercase");
    var digit = document.getElementById("number");
    var specialCharacter = document.getElementById("specialChar");
    var match = document.getElementById("passwordsMatch");

    // Check that the email is @colorado.edu for RAs and any email for Hall Directors
    email.onfocus = function(){
        
        // Set the requirement mark to an 'x' if nothing has been typed
        if(email.value == ""){
            emailValid.setAttribute('class',"invalid");
        }

        email.onkeyup = function(){

            // Create regular expressions to check that the email is @colorado.edu
            var studentEmail1 = /^[a-zA-Z]{1}[a-z]+\.[a-zA-Z]{1}[a-z]+@colorado\.edu$/g;
            var studentEmail2 = /^[a-z]{4}[0-9]{4}@colorado\.edu$/g;

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
            enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
        }
    }

    // Reset the email indicator if no email has been typed
    email.onblur = function(){
        if(email.value == ""){
            emailValid.classList.remove("valid","invalid");
        }
    }

    // Check that the student ID is correct format
    userID.onfocus = function(){
        
        // Set the requirement mark as wrong if nothing has been typed
        if(userID.value == ""){
            userIDvalid.classList.add("invalid");
        }

        userID.onkeyup = function(){
            
            // Regular expression to check that the ID is a 9 digit number
            var nineDigitNum = /[0-9]{9}/g;

            // Validate the ID
            if(userID.value.match(nineDigitNum)){
                userIDvalid.classList.add("valid");
                userIDvalid.classList.remove("invalid");
            }
            else{
                userIDvalid.classList.add("invalid");
                userIDvalid.classList.remove("valid");
            }

            // enable the button if all fields are valid
            enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
        }
    }

    // Reset the ID indicator if the ID field is emtpy
    userID.onblur = function(){
        if(userID.value == ""){
            userIDvalid.classList.remove("valid","invalid");
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
            enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
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
            enableButton(firstName,lastName,residentAdvisor,hallDirector,emailValid,userIDvalid,minimum,lowerLetter,upperLetter,digit,specialCharacter,match);
        }
    }

    // Reset the password indicator if the confirm password field is empty
    confirmPassword.onblur = function(){
        if(confirmPassword.value == ""){
            match.classList.remove("valid","invalid");
        }
    }
}

// Resets the form when the user exits the modal
function resetForm(){

    // Access the various inputs
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var residentAdvisor = document.getElementById("residentAdvisor");
    var hallDirector = document.getElementById("hallDirector");
    var email = document.getElementById("staffEmail");
    var userID = document.getElementById("userID");
    var password = document.getElementById("userPassword");
    var confirmPassword = document.getElementById("confirmPassword");

    // Reset the radio for the staff position
    residentAdvisor.checked = true;
    hallDirector.checked = false;

    // Resest the placeholders and title for the email & ID fields
    document.getElementById("emailRequirement").innerHTML = "Must be your student email associated with the university";
    document.getElementById("idHeader").innerHTML = "Student ID";
    userID.placeholder = "Your 9 Digit Student ID";

    // Reset all inputs
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    userID.value = "";
    password.value = "";
    confirmPassword.value = "";

    // Retrieve requirement fields
    var emailValid = document.getElementById("validEmail");
    var IDvalid = document.getElementById("validID");
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

    // Reset the ID requirement mark
    IDvalid.classList.remove("valid","invalid");

    // Reset the confirm password requirement mark
    match.classList.remove("valid","invalid");

    // Disable the submit button
    var submitBtn = document.getElementById("mySubmitButton");
    submitBtn.disabled = true;
    submitBtn.classList.add("not-allowed");
}

// Changes the color of the "Log In" button when it is clicked
function changeColor(buttonID){
    var changeButton = document.getElementById(buttonID);
    var changeButtonText = document.getElementById(buttonID + "Text");
    // var logInBox = document.getElementById("login");

    changeButtonText.setAttribute('style','color: black');
    changeButton.classList.add("login-or-features-selected");
    changeButton.classList.remove("show-login-or-features");

    if(buttonID == "changeToLogIn"){
        document.getElementById("changeToFeatures").classList.add("show-login-or-features");
        document.getElementById("changeToFeatures").classList.remove("login-or-features-selected");

        document.getElementById("login").style.display = "block";
        document.getElementById("features").style.display = "none";

        document.getElementById("changeToFeaturesText").setAttribute('style','color: white');
    }
    else{
        document.getElementById("changeToLogIn").classList.add("show-login-or-features");
        document.getElementById("changeToLogIn").classList.remove("login-or-features-selected");

        document.getElementById("login").style.display = "none";
        document.getElementById("features").style.display = "block";

        document.getElementById("changeToLogInText").setAttribute('style','color: white');
    }
}