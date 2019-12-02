var path = require('path');
var express = require('express');
var app = express();

const bodyParser = require('body-parser');          // Add the body-parser tool has been added
app.use(bodyParser.json());                         // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const pgp = require('pg-promise')();

// IMPORTANT! Change these to reflect your system.
const database_name = 'university'; //'postgres';
const database_password = 'jojo345'; //'csci';

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
app.post('/login.html/verify', function(req, res){
  console.log("Login requested.");

  var email = req.body.loginEmail;
  var password = req.body.loginPassword;

  var query = "SELECT user_password FROM profile_information WHERE user_email = \'" + email + "\';";
  db.any(query)
    .then(function (rows) {
        if (password == rows[0].user_password) {
          console.log("User has been verified for log in.");
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
        } else {
          console.log("User is not verified for log in.");
        }
      })
      .catch(function (err) {
          // display error message
          console.log('Could not process SQL query.', err);
      })
});

// process sign up request
app.post('/login.html/signup', function(req, res){
  console.log("Signup requested.");

	var staff_position = req.body.staffPositions;
	var first_name = req.body.firstName;
	var last_name = req.body.lastName;
  var email = req.body.userEmail;
	var user_id = req.body.studentID;
  var password = req.body.loginPassword;

	var table = '';
	var table_key = '';

	var isResidentAdvisor = (staff_position == 'Resident Advisor');

	// variables used to change the query depending on user's position.
	if (isResidentAdvisor) {
		table = 'residentAdvisors';
		table_key = 'student_ID';
		table_email = 'student_email';
	} else {
		table = 'hallDirectors';
		table_key = 'staff_ID';
		table_email = 'staff_email';
	}

	var query = "SELECT first_name, last_name, " + table_email + " FROM " + table + " WHERE " + table_key + " = \'" + user_id + "\';";

  db.any(query)
    .then(function (rows) {
				var isSuccessful = true;

				// check if name matches record
        if (rows[0].first_name != first_name || rows[0].last_name != last_name) {
					isSuccessful = false;
				}

				// check if email matches record
				if (isResidentAdvisor) {
					if (rows[0].student_email != email) {
						isSuccessful = false;
					}
				} else {
					if (rows[0].staff_email != email) {
						isSuccessful = false;
					}
				}

				// TO DO: add user to profile_information database, or send alert message if sign up failde.
				if (isSuccessful) {
					console.log("Sign up info verified.");
				} else {
					console.log("Sign up failed!");
				}

      })
      .catch(function (err) {
          // display error message
          console.log('Could not process SQL query.', err);
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

app.get('/survey.html', function(req, res){
    res.sendFile('survey.html', { root: view_dir } );
});

// create server at port 3000
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
