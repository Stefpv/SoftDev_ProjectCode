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
app.set('view engine', 'ejs');

// statically serve the files (images, javascript, css...) in current directory.
// NOTE: may need to serve files in 'resources' instead, for better security; this requires fixing urls in html files.
app.use(express.static(__dirname));

var view_dir = path.join(__dirname + "/views")

app.set('views', __dirname);
//global variable for session (initialized inside login)
var sess;

// send html files to browser, depending on url request.
app.get('/homepage.ejs', function(req, res){
//     res.sendFile('homepage.html', { root: view_dir } );
	res.render('views/homepage.ejs',{
		my_title:"Home Page",
		success: "true"
	});
});

// app.get('/login.html', function(req, res){
//     res.sendFile('login.html', { root: view_dir } );
// });

// NOTE: storing user password in database is not secure. Might be better to hash password into database.

// verifies login request
app.post('/homepage.ejs/verify',function(req,res){

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
		    		res.render('views/homepage.ejs',{
					my_title: "Home Page",
					success: "false"
				});

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
        	sess = logInEmail;
				// Log them in and maintain their session
				res.redirect('/staff_form.ejs');
            }
        })
        .catch(function(err){
            console.log("SQL query could not be processed", err);
        })
})

// process sign up request
app.post('/homepage.ejs/signup', function(req,res){

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
						res.render('views/homepage.ejs',{
							my_title: "Home Page",
							success: "InvalidRA"
						});
						// "The information that you entered does not correspond to a current Resident Advisor of the University of Colorado: Boulder."
						// "Please check that you entered all of your information correctly. If issues persist, please contact ____"
					}
					else{
						console.log("Invalid Hall Director");
						res.render('views/homepage.ejs',{
							my_title: "Home Page",
							success: "InvalidHallDirector"
						});
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
					res.render('views/homepage.ejs',{
						my_title: "Home Page",
						success: "accountAlreadyExists"
					});
				}
				else{ // Create their account

					console.log("Creating Account");

					// Fill in the profile_information table
					var insert_profile_query = 'INSERT INTO profile_information VALUES (\'' + userID + '\',\'' + password + '\',\'' + email + '\',\'' + firstName + ' ' + lastName + '\',\'' + staffPosition + '\',' + '\'\'' + ',' + '\'\'' + ',' + '\'\'' + ',' + '\'\'' + ');';

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
						res.render('views/homepage.ejs',{
							my_title: "Home Page",
							success: "signUpSuccessful"
						});
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

app.get('/staff_form.ejs', function(req, res){
    		var currentUser = sess;
    //res.sendFile('staff_form.html', { root: view_dir } );
		var query = "SELECT preferred_name, major, gender_identity, bio FROM profile_information WHERE user_email = '" + sess + "';";
		db.any(query)
			.then(function (rows) {
				console.log(rows);
				console.log("preferred_name: " + rows[0].preferred_name);
				res.render('views/staff_form.ejs', {
					email: sess,
					prefname: rows[0].preferred_name,
					mj: rows[0].major,
					gi: rows[0].gender_identity,
					biography: rows[0].bio
				});
			})
			.catch(function (err) {
            // display error message in case an error
            //req.flash('error', err); //if this doesn't work for you replace with console.log
            //console.log('error',err);
						console.log('error', err);
            res.render('views/staff_form', {
                title: 'Staff Form',
                data: '',
                color: '',
                color_msg: ''
            })
        })
});

app.post('/staff_form', function(req, res){
// for each( var thing in req.body){
		console.log("request body: " + Object.keys(req.body));
		console.log("First Name:" + req.body.fname);
		console.log("This is the sesssion: " + sess)
	// }
	var pname = req.body.fname;
	var gi = req.body.gender;
	var major = req.body.major;
	var bio = req.body.bio;
	//var id = req.body.id;
	//String(id);
	//var pic_path = req.body.pic;
	//			MISSING PICTURE
	// var insert = "INSERT INTO profile_information " +
	// "(preferred_name, gender_identity, major, bio) " +
	// "VALUES ('"+pname+"', '"+gi+"', '"+major+"', '"+bio+"') WHERE user_ID = '"+id+"' "; //missing image and NOT WORKING WITH where
	var insert = "UPDATE profile_information SET preferred_name = '" + pname + "', gender_identity = '" + gi +
	"', major = '" + major + "', bio = '" + bio + "' WHERE user_email = '"+ sess +"';"; //user_ID = " + " CAST('" + id + "' AS CHAR(9));";
	console.log(insert);
	//console.log(typeof id);
		db.task('get-everything', task =>{
			return task.batch([
				task.any(insert)
			]);
		})
		.then(info =>{
				res.render('views/staff_form.ejs', {
					email: sess,
					prefname: pname,
					mj: major,
					gi: gi,
					biography: bio
				});
			})

		.catch(function (err) {
				// display error message
				console.log('Could not process SQL query.', err);
		})
// add some sort of condition in query to only add info if person is logged in, maybe that is something that
//should be addressed somwhere else in the code
//try to add picture too!!!!1
//console.log("Name: " + pname + " Gender: " + gi + " ID: " + id);
});

app.get('/staff-page.html', function(req, res){
    res.sendFile('staff-page.html', { root: view_dir } );
});

app.post('/staff-page.html/select_hall', function(req, res){
    var hall_name = req.body.hall;
		var hall_director_query = 'SELECT * FROM hall_directors INNER JOIN profile_information ON hall_directors.staff_ID = profile_information.user_ID WHERE \'' + hall_name + '\'' + ' = ANY (hall_directors.residence_halls) ORDER BY profile_information.preferred_name;';
    var resident_advisor_query = 'SELECT * FROM resident_advisors INNER JOIN profile_information ON resident_advisors.student_ID = profile_information.user_ID WHERE resident_advisors.residence_hall = \'' + hall_name + '\' ORDER BY profile_information.preferred_name;';

		var staff_array = [];

		// obtain results from both of the queries above
		db.multi(hall_director_query + resident_advisor_query)
	   .then(([hall_directors, resident_advisors]) => {
				 var user;

				 // add hall director info to the staff array
				 if (hall_directors.length > 0) {
					 for (i = 0; i < hall_directors.length; i++) {
						 user = hall_directors[i];
						 staff_array.push({picture_link: user.profile_picture, name: user.preferred_name, occupation: user.staff_position, major: user.major, gender: user.gender_identity, description: user.bio});
					 }
				 }

				 // add resident advisor info to thestaff array
				 if (resident_advisors.length > 0) {
					 for (i = 0; i < resident_advisors.length; i++) {
						 user = resident_advisors[i];
						 staff_array.push({picture_link: user.profile_picture, name: user.preferred_name, occupation: user.staff_position, major: user.major, gender: user.gender_identity, description: user.bio});
					 }
			 	 }

				 res.json({
					 staff : staff_array
				 });
	   })
	   .catch(error => {
				 // display error message
				 console.log('Could not process SQL queries.', error);
	   });

});

app.get('/survey.html', function(req,res){
	res.sendFile('survey.html', {root: view_dir});
});
//Post is not working
app.post('/survey.html', function(req, res){

	var s_id = req.body.studentID;
	var urgencyNum = req.body.Urgency;
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var des = req.body.description;
	var classifications = req.body.classifications;

	var class_str = '{';
	for(var i = 0; i < classifications.length; i++)
	{
		if(i == classifications.length-1)
		{
			class_str = class_str + classifications[i].toString();
		}
		else
		{
			class_str += classifications[i].toString() + ', ';
		}
	}
	class_str += '}';


	console.log(class_str);

	var insert_statment = "INSERT INTO feedback(user_ID, urgency, first_name, last_name, description, classifications) Values('"+s_id+"','"+urgencyNum+"','"+fname+"', '"+lname+"','"+des+"','"+class_str+"') ON CONFLICT DO NOTHING;";
	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statment)
		]);
	})
	.then(info => {
		res.redirect('/survey.html');
		console.log("Successfully Inserted into tables");
	})
	.catch(function(err){
		console.log('Could not insert into SQL',err);
	})
});

// create server at port 3000
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
