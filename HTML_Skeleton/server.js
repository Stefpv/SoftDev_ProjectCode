var path = require('path');
var express = require('express');
var app = express();

const bodyParser = require('body-parser');          // Add the body-parser tool has been added
app.use(bodyParser.json());                         // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const pgp = require('pg-promise')();

// IMPORTANT! Change these to reflect your system.
const database_name = 'postgres';
const database_password = 'csci';

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: database_name,
	user: 'postgres',
	password: database_password
};


let db = pgp(dbConfig);

// statically serve the files (images, javascript, css...) in current directory.
// NOTE: may need to serve files in 'resources' instead, for better security; this requires fixing urls in html files.
app.use(express.static(__dirname));

var view_dir = path.join(__dirname + "/views")

// send html files to browser, depending on url request.
app.get('/homepage.html', function(req, res){
    res.sendFile('homepage.html', { root: view_dir } );
});

app.get('/login.html', function(req, res){
    res.sendFile('login.html', { root: view_dir } );
});

// NOTE: storing user password in database is not secure. Might be better to hash password into database.

// verifies login request
app.post('/homepage.html/verify',function(req,res){

    // Retrieve form data from log in page
    var logInEmail = req.body.loginEmail;
    var logInPsswd = req.body.loginPassword;

    // Change email format to match database
    logInEmail = logInEmail.toLowerCase();

    // Query to search the table of profiles
    var login_query = 'SELECT * FROM profile_information WHERE (user_password=\'' + logInPsswd + '\') AND (user_email=\'' + logInEmail + '\');';

    db.any(login_query)
        .then(function(rows){
            if(rows.length == 0){
				console.log("Incorrect Email or Password");
				
				/* TO DO: remember user has logged in for the duration of site visit (nate that this is different than 'remember me')
				Procedure found on StackOverflow, by (link to be placed.)
				- generate random 258 bit token for user, and store in database
				- send token and user_email to browser to be stored in sessionStorage, as client_token and user_email
				- every page requires validation with server
					- send client_token and user_email to server from sessionStorage
					- look up user info on database using user_email ONLY
					- compare client_token and token on database, using timing-safe comparison
				- may also store time of first login and/or last activity, and require a new login based on time and/or inactivity
				*/
            }
            else{
                console.log("Log in successful");
        
				// Log them in and maintain their session
				res.redirect('/staff_form.html');
            }
        })
        .catch(function(err){
            console.log("SQL query could not be processed", err);
        })
})

// process sign up request
app.post('/homepage.html/signup', function(req,res){

    console.log("Sign Up Requested");

    // Retrieve the input from the Sign Up Form
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var staffPosition = req.body.staffPositions;
    var email = req.body.userEmail;
    var userID = req.body.userID;
	var password = req.body.confirmPassword;

    // Change capitalization formatting to match the format of the data base
        // First Name 
        firstName = firstName[0].toUpperCase() + firstName.substring(1).toLowerCase();
        
        // Last Name
        lastName = lastName[0].toUpperCase() + lastName.substring(1).toLowerCase();

        // Email
		email = email.toLowerCase();
		

	console.log(firstName);
	console.log(lastName);
	console.log(staffPosition);
	console.log(email);
	console.log(userID);
	console.log(password);

    // Declare query that will be run to see if there is a match in the data base
    var signup_query;

    // Set the query according to what staff position the user selected
    if(staffPosition == "Resident Advisor"){
		signup_query = 'SELECT * FROM resident_advisors WHERE (\'' + userID + '\'=student_ID) AND (\'' + firstName + '\'=first_name) AND (\'' + lastName + '\'=last_name) AND (\'' + email + '\'=student_email);';
    }
    else{
		signup_query = 'SELECT * FROM hall_directors WHERE (\'' + userID + '\'=staff_ID) AND (\'' + firstName + '\'=first_name) AND (\'' + lastName + '\'=last_name) AND (\'' + email + '\'=staff_email);';
    }

	console.log(signup_query);

    // Run the query to see if there is a match in the table
    db.any(signup_query)
        .then(function(rows){
			console.log(rows.length);

			// if no rows are returned, then the user does not exist in the university resident hall staff data base
			if(rows.length == 0){

				// Create a modal/popup that tells the user the following:
					if(staffPosition == "Resident Advisor"){
						console.log("Invalid RA");

						// "The information that you entered does not correspond to a current Resident Advisor of the University of Colorado: Boulder."
						// "Please check that you entered all of your information correctly. If issues persist, please contact ____"
					}
					else{
						console.log("Invalid Hall Director");
						// "The information that you entered does not correspond to a current Hall Director of the University of Colorado: Boulder."
						// "Please check that you entered all of your information correctly. If issues persist, please contact ____"
					}            
		
				// Upon closing the modal: leave their information in the form, and allow them to change it and submit again
			}
			else{
				console.log(rows[0].has_staff_portal_account);
				console.log("Valid Staff Member");

				if(rows[0].has_staff_portal_account == true){ // user already has an account
					// Tell the user that an account has aleady been created using the information they entered
					// "An account has already been created with the information that you entered"
					console.log("Account has already been created");
				}
				else{ // Create their account
					
					console.log("Creating Account");

					// Fill in the profile_information table
					var insert_profile_query = 'INSERT INTO profile_information VALUES (\'' + userID + '\',\'' + password + '\',\'' + email + '\',' + '\'\'' + ',\'' + staffPosition + '\',' + '\'\'' + ',' + '\'\'' + ',' + '\'\'' + ',' + '\'\'' + ');';
					
					// Update the boolean value to indicate that they have created an account for our website
					var update_boolean_query;
					if(staffPosition == "Resident Advisor"){
						update_boolean_query = 'UPDATE resident_advisors SET has_staff_portal_account=TRUE WHERE student_ID =\'' + userID + '\';';
					}
					else{
						update_boolean_query = 'UPDATE hall_directors SET has_staff_portal_account=TRUE WHERE staff_ID =\'' + userID + '\';';
					}
					
					console.log(insert_profile_query);
					console.log(update_boolean_query);

					// Run the insertion queries
					db.task('get-everything', task => {
						return task.batch([
							task.any(insert_profile_query),
							task.any(update_boolean_query)
						]);
					})
					.then(info => {
						// Tell the user that their account has successfully been created, and redirect them to log in
						res.redirect('/homepage.html');
						console.log("Successfully Inserted into tables");
					})
					.catch(error => {
						console.log('SQL queries were unable to be processed',error);
					})		
				}
			}
        })
        .catch(function(err){
            console.log("SQL query could not be processed", err);
        })
});

app.get('/resourcepage.html', function(req, res){
    res.sendFile('resourcepage.html', { root: view_dir } );
});

app.post('/resourcepage.html', function(req, res){
    var hall_name = req.body.hall;

    var query = 'SELECT * FROM resource_links;';

		getResources(query);

    function getResources (query) {
			db.any(query)
	      .then(function (rows) {
	          var data_array = [];

	          for (i = 0; i < rows.length; i++) {
	            var resources = rows[i];
	            data_array.push({linkimg: resources.image_link, name: resources.website_name , description: resources.description, link: resources.page_link});
	          }

	          res.json({
	            data : data_array
	          });
	        })
	        .catch(function (err) {
	            // display error message
	            console.log('Could not process SQL query.', err);

	            // send back an empty array.
	            res.json({
	              data : []
	            });
	        })
				}
});

// process sign up request
app.post('/resourcepage.html/addResource', function(req, res){
  console.log("Add Resource requested.");

	var name = req.body.resourceTitle;
	var link = req.body.resourceLink;
	var linkimg = req.body.resourceLinkimg;
  var discription = req.body.resourceDiscription;
console.log("1");
	var query = "INSERT INTO resource_links VALUES ('" + name + "','" +link+  "','"+ linkimg +"','"+ discription +"');";
	//var query = "INSERT INTO resource_links (website_name, page_link, image_link, description) VALUES " + name + ", " + link + ", " + linkimg + ", " + discription + ";";
console.log("2");
  db.any(query)
    .then(function (rows) {
				console.log('Added to database');
				res.sendFile('resourcepage.html', { root: view_dir } );
      })
      .catch(function (err) {
          // display error message
          console.log('Could not process SQL query.', err);
      })


});

app.get('/staff_form.html', function(req, res){
    res.sendFile('staff_form.html', { root: view_dir } );
});

app.get('/staff-page.html', function(req, res){
    res.sendFile('staff-page.html', { root: view_dir } );
});

app.post('/staff-page.html/select_hall', function(req, res){
    var hall_name = req.body.hall;

    var query = 'SELECT * FROM residentAdvisors LEFT JOIN profile_information ON residentAdvisors.student_ID = profile_information.user_ID WHERE residentAdvisors.residence_hall = \'' + hall_name + '\';';

		searchStaff(query);

    function searchStaff (query) {
			db.any(query)
	      .then(function (rows) {
	          var staff_array = [];

	          for (i = 0; i < rows.length; i++) {
	            var user = rows[i];
	            staff_array.push({picture_link: user.profile_picture, name: user.user_id, occupation: user.staff_position, description: user.bio});
	          }

	          res.json({
	            staff : staff_array
	          });
	        })
	        .catch(function (err) {
	            // display error message
	            console.log('Could not process SQL query.', err);

	            // send back an empty array.
	            res.json({
	              staff : []
	            });
	        })
				}
});

app.get('/survey.html', function(req,res){	
	res.sendFile('survey.html', {root: view_dir}); 	   
});	
//Post is not working
app.post('/survey.html', function(req, res){
<<<<<<< Updated upstream
<<<<<<< Updated upstream
	console.log("Got here...");
	console.log("request body: "+ Object.keys(req.body));
	var s_id = req.body.user_id;
	var urgencyNum = req.body.urgency;
	var fname = req.body.firstname;
	var lname = req.body.lastName;
	var des = req.body.description;
	var classifications = [];
	for(var i = 0; i < 5; i++)
	{
		classifications[i] = req.body.classifications;
	}

	var insert_statment = "INSERT INTO feedback(user_ID, urgency, first_name, last_name, description, classifications) Values('"+s_id+"','"+urgencyNum+"','"+fname+"', '"+lname+"','"+des+",'"+classifications+"') ON CONFLICT DO NOTHING;";
=======
=======
>>>>>>> Stashed changes

	var s_id = req.body.studentID; 
	var urgencyNum = req.body.Urgency; 
	var fname = req.body.firstname; 
	var lname = req.body.lastname; 
	var des = req.body.description; 
	var classifications = req.body.classifications; 

	var surveyClassification = []; 

	console.log(s_id); 
	console.log(urgencyNum); 
	console.log(fname);
	console.log(lname); 
	console.log(des); 
	console.log(classifications); 

	// var class_str = '{';
	// for(var i = 0; i < classifications.length; i++)
	// {
	// 	if(i == classifications.length-1)
	// 	{
	// 		class_str = class_str + classifications[i].toString();
	// 	}
	// 	else
	// 	{
	// 		class_str += classifications[i].toString() + ', ';
	// 	}
	// }
	// class_str += '}'; 


	// console.log(class_str); 
	var class_test = []; 
	class_test.push({classifications})

	var insert_statment = "INSERT INTO feedback(user_ID, urgency, first_name, last_name, description, classifications) Values('"+s_id+"','"+urgencyNum+"','"+fname+"', '"+lname+"','"+des+"','"+class_str+"') ON CONFLICT DO NOTHING;"; 
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
	db.task('get-everything', task =>{
		return task.batch([
			task.any(insert_statment)
		]);
	})
	.catch(function(err){
		console.log('Could not insert into SQL',err);
	})
});

// create server at port 3000
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
