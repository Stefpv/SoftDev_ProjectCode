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

app.post('/login.html/verify', function(req, res){
  var email = req.body.loginEmail;
  var password = req.body.loginPassword;
});

app.get('/resourcepage.html', function(req, res){
    res.sendFile('resourcepage.html', { root: view_dir } );
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
});

app.get('/survey.html', function(req, res){
    res.sendFile('survey.html', { root: view_dir } );
});

// create server at port 3000
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
