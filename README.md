# Residence Hall Staff Portal

 	Currently Resident Advisors and Hall Directors utilize many different resources and websites to do their jobs. Due to the vast amount of specific applications for each task it can often be frustrating when an RA is trying to locate the URL for each application. It can also be confusing when an RA can not remember what each application is used for. With the Residence Hall Staff Portal, RAs and Hall Directors will have a streamlined location that contains all the information they need to understand the purpose of each website and how to access each resource. In addition to a page for the various resources that staff members use, the Residence Hall Staff Portal also gives users the ability to customize their own profile, view their fellow coworkers, and submit a survey to give feedback on differnent areas of their work.  
	The Residence Hall Staff Portal contains a launching page that both describes the features of the website and allows users to log in, or sign up if they have not yet created an account. After signing in, the user will be logged in to their own unique session. Using a navbar located at the top of each page, the user can toggle between the different features of the website. The first feature available is the profile page, which is specific to the current user, where they can view and edit their personal information. The user can then change to the staff page, which can be used to filter through each dorm and view the staff members of each hall. The remaining two pages are the resources page and the survey page. The resources page contains links and descriptions of each website the RAs will need throughout their time on staff. Hall Directors will have the ability to add resources to this page as needed. The survey page is a form that gives users the opportunity to provide feedback regarding several areas of their work.

Describe repo organization/structure.	
	This repository is organized into folders according to the

  This product is currently supported through deployment on the local host of a user's machine. In order to successfully run the application, one must follow the steps below:
  Installation and Set Up:
  	1. Download the entire SoftDev_ProjectCode repository.
  	2. Install PostgreSQL (if not already installed) for database use.
	   	On Linux: sudo apt-get install postgresql postgresql-contrib
	3. Install node.js.
		On Linux:  sudo apt-get install -y nodejs

  Starting the server and running it on your local host:
  	1. Start the database server
		On Linux: sudo -u postgres service postgresql start OR service postgresql start
  	2. Start PostgreSQL session
		On Linux: sudo -u postgres psql
  	3. Initialize your database using the file fullDataBase.pgqsl. You can either import the file or simply copy the contents and 	            paste them into your PostgreSQL session.
  	3. Change the database name and database password in lines 12 and 13 of the file server.js to match the password and name of                your local PostgreSQL database.
  	4. Using your terminal, change to the directory where you downloaded the SoftDev_ProjectCode repository, and enter the                      HTML_Skeleton folder.
  	6. Start the node.js server with the command: node server.js
	7. Open a web browser and go to the following website: http://localhost:3000/homepage.ejs
	
  Creating an account with a sample staff member and logging in:
  	1. Look over the rows of the resident_advisors and hall_directors tables in your database and shoose a row to use.
	2. Click on the sign up button and enter the information corresponding to the staff member you chose.
	3. After setting a password and creating an account for a sample staff member you can log in to the website.
	
  Testing Features:
  	1. Now that you have created an account with a sample staff member, you may test the various features of our website and edit 	 	    your personal database as you see fit.
