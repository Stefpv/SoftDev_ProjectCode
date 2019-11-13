/*
    Ideally there will a data base run by the univiveristy that is filled during the RA / Hall Director application and acceptance process. 
    We do no currently know how this is implemented or how their data base is structured, but we are giving a general idea of how the staff information is stored by 
    CU, and then how it is connected to the information from our website.

    When someone attempts to create an account for our website:
        1. They will be tasked with filling out a "sign up" form, in which they will enter their first name, last name, student ID, email, and password.
        2. When they have filled all of the fields, the submit button will be enabled.
        3. Upon clicking the submit button, their information will be used to run a query in the university data base. The query will search through the table of 
           staff members to find a row that has the same email, first name, last name, and student ID as what the user input.
                3a. If there is a matching row, the user's account is created, and the website proceeds to the RA portal.
                3b. If there is no mathcing row, the user will be shown an alert, telling them that they were not found in the system. Then a few tips will be presented
                    for why it may not have worked, and contact info will be given if they have any questions or issues.
        4. After the user has created their account, they will be sent to our website.
*/

/********** UNIVERSITY DATA BASE **********/

/* Contains the information about Residence Advisors */
CREATE TABLE IF NOT EXISTS residentAdvisors(
    student_ID CHAR(9) PRIMARY KEY, /* unique identifier for each reisdent advisor */
    first_name VARCHAR(20) NOT NULL, /* first name */
    last_name VARCHAR(20) NOT NULL, /* last name */
    student_email VARCHAR(60) NOT NULL, /* student email */
    residence_hall VARCHAR(30) NOT NULL, /* residence hall */
    floor_number SMALLINT NOT NULL, /* floor number in given residence hall */
    has_staff_portal_account BOOLEAN NOT NULL /* indicates whether or not a staff member has created an account for our website
); 

/* Contains the information on Hall Directors */
CREATE TABLE IF NOT EXISTS hallDirectors(
    staff_ID CHAR(9) PRIMARY KEY, /* unique identifier */
    first_name VARCHAR(20) NOT NULL, /* unique identifier */
    last_name VARCHAR(20) NOT NULL, /* unique identifier */
    staff_email VARCHAR(60) NOT NULL, /*  */
    residence_halls VARCHAR(30) ARRAY NOT NULL, /* lists the residence halls that the hall director oversees */
    has_staff_portal_account BOOLEAN NOT NULL /* indicates if hall director has account for our website */
);


/********** WEBSITE DATABASE **********/

/* Contains the feedback survey information */
CREATE TABLE IF NOT EXISTS feedback(
    user_ID CHAR(9) NOT NULL, /* either staff_ID or student_ID - we are assuming they are the same length */
    urgency SMALLINT NOT NULL, /* number from 1-6 that represents teh urgency of the report (6 is highest) */
    first_name VARCHAR(20) NOT NULL, /* filer's first name */
    last_name VARCHAR(20) NOT NULL, /* filer's last name */
    description TEXT, /* text that contains the description of a user's feedback */
    classifications VARCHAR(20) ARRAY, /* dynamic array that contains the different categories of each given report */
);

/* profile information */
CREATE TABLE IF NOT EXISTS profile_information(
    user_ID CHAR(9) NOT NULL, /* either staff_ID or student_ID - we are assuming they are the same length */ 
    user_password VARCHAR(25) NOT NULL, /* password */
    user_email VARCHAR(60) NOT NULL,
    preferred_name TEXT, /* the preferred first name of the given staff member */
    staff_position VARCHAR(20) NOT NULL, /* (senior) RA or Hall Director */
    major VARCHAR(30), /* staff's major at CU */
    gender_identity TEXT, /* gender identity of given staff member */
    bio TEXT, /* description or bio */
    profile_picture TEXT /* contains the file path to the given profile picture --> ideally a different implementation will be used in the future */
);

/* Resource Links */
CREATE TABLE IF NOT EXISTS resource_links(
    website_name VARCHAR(30),
    page_link TEXT,
    image_link TEXT,
    description TEXT
)

/* INSERTING DATA INTO TABLES */

/* Insert 3 existing Resident Advisors */
INSERT INTO residentAdvisors VALUES ('100123456','Ellsworth','Boothe','ellsworth.boothe@colorado.edu','Smith',1,FALSE);
INSERT INTO residentAdvisors VALUES ('100987654','Alec','Raines','alec.raines@colorado.edu','Baker',2,FALSE);
INSERT INTO residentAdvisors VALUES ('106543219','Ayako','Spinks','ayako.spinks@colorado.edu','Darley North',7,FALSE);

/* Insert 3 existing Hall Directors */ 
INSERT INTO hallDirectors VALUES ('102030405','Donn','Gable','donn.gable@colorado.edu',{'Aden','Brackett','Cockerell','Crosman'},FALSE);
INSERT INTO hallDirectors VALUES ('106663029','Joey','Wofford','joey.wofford@colorado.edu',{'Willard'},FALSE);
INSERT INTO hallDirectors VALUES ('105033214','Eve','Faust','eve.faust@colorado.edu',{'Sewall'},FALSE);

/* Insert the default links for the resoures page */
INSERT INTO resource_links VALUES ('StarRez','https://hdsapps.colorado.edu/starrezweb','https://pbs.twimg.com/media/D7OHWHmWsAAuTW6.jpg','StarRes contains student information. Use it to look up students when writing Incident Reports.');
INSERT INTO resource_links VALUES ('Internal Incident Report','https://rareport.wufoo.com/forms/qoxs6r0pdko5i/','https://www.stetson.edu/law/conferences/highered/home/media/maxient%20logo%202.jpg','Incident Reports are where you document policy violations or medical emergancies that happen in the resident halls. This internal link should not be shared outside of this page.');
INSERT INTO resource_links VALUES ('Duty Rounds','https://rareport.wufoo.com/forms/qoxs6r0pdko5i/','"https://static-assets.technologyevaluation.com/SoftwareImages/0/20/20EF04D66A6A29D3C6F4EC7A2AC18B8B1704BE87/logo.png','On the Duty Rounds form log with your duty partner what happened during each duty night. This form varies by dorm.');
INSERT INTO resource_links VALUES ('Roompact','https://roompact.com/users/login','https://i0.wp.com/blog.roompact.com/wp-content/uploads/2019/07/397b5-roompact-highrez.png?resize=1024%2C213','Roompact is used for Roommate Agreements and for notifying your Hall Director on roommate conflicts.');
INSERT INTO resource_links VALUES ('BuffChats','https://apps.powerapps.com/play/3aed8dcf-4a6f-4393-928e-d8aff57873e3?source=portal&screenColor=rgba(81%2C%2092%2C%20107%2C%201)','https://www.appliedis.com/wp-content/uploads/2019/04/microsoftpowerapps-300x150.png','The BuffChats app provided through powerapps allows for the input and tracking of each resident BuffChat.');
INSERT INTO resource_links VALUES ('My CU Living','https://living.colorado.edu/','https://www.colorado.edu/umc/sites/default/files/block/cds_center.jpg','The My CU Living site is a hub for room and meal plan management. It is also used by the resident to check in overnight guests.');
INSERT INTO resource_links VALUES ('When to Work','https://whentowork.com/','https://img.over-blog-kiwi.com/2/41/57/84/20170618/ob_bb666d_whentowork-logo-blue.png','When to work is the site used to organize the desk. Use this site to post your available hours, ask for trades, and communicate with your coworkers.');
INSERT INTO resource_links VALUES ('Community Center Site','https://communitycenter.colorado.edu/','../resources/img/cu_600_300.png','The Community Center Site is used at the community center desk for the tracking of temporary keys and logging desk shifts.');

/* QUERIES 
        Sign Up
            1. Fetch all columns from the university table on the given row that matches the staff member who is creating their account.
            
        Log In
            1. Fetch the email and password column from the staff_profile table to verify that account exists.

*/

/* LIVE DEMO 
    1. Show how to create an account given that the person is an RA or Hall Director in the university's data base.
    2. Log in with the account that was just created.
    3. Demonstrate the other features
*/