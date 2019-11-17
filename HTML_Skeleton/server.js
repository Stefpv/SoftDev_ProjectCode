var path = require('path');
var express = require('express');
var app = express();

const bodyParser = require('body-parser');          // Add the body-parser tool has been added
app.use(bodyParser.json());                         // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

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
    console.log(req.body.hall);
    res.json({
      staff : [
        {username: "jack", name: "Jack", occupation: "Hall Director", description: "From Boston. Like swimming and international affairs."}
      ]
    });
});

app.get('/survey.html', function(req, res){
    res.sendFile('survey.html', { root: view_dir } );
});

// create server at port 3000
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
