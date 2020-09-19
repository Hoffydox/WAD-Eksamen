USE "1074171"


/* ------------------------- START OF DROPPING TABLES ---------------------- */

-- Dropper constraint hvis den existere
-- Table: userPassword
-- Constraint: FK_Password_User
ALTER TABLE dbo.userPassword
DROP CONSTRAINT IF EXISTS FK_Password_User
GO

-- Dropper constraint hvis den existere
-- Table: userLogin
-- Constraint: FK_Role_User
ALTER TABLE dbo.userLogin
DROP CONSTRAINT IF EXISTS FK_Role_User
GO

-- Dropper constraint hvis den existere
-- Table: userLogin
-- Constraint: FK_Role_User
ALTER TABLE dbo.project
DROP CONSTRAINT IF EXISTS FK_User_Project
GO

-- Dropper constraint hvis den existere
-- Table: userLogin
-- Constraint: FK_Role_User
ALTER TABLE dbo.transactionTable
DROP CONSTRAINT IF EXISTS FK_User_Transaction, FK_Project_Transaction
GO


-- Dropper table hvis den existere
-- Table: userPassword
DROP TABLE IF EXISTS dbo.userPassword
GO

-- Dropper table hvis den existere
-- Table: userRole
DROP TABLE IF EXISTS dbo.userRole
GO
-- Dropper table hvis den existere
-- Table: userLogin
DROP TABLE if EXISTS dbo.userLogin
GO

-- Dropper table hvis den existere
-- Table: project
DROP TABLE if EXISTS dbo.project
GO

-- Dropper table hvis den existere
-- Table: transactionTable
DROP TABLE if EXISTS dbo.transactionTable
GO


/* --------------------------- Laver TABLES --------------------------- */


-- CREATING USERS ROLE TABLE ("dbo.userRole") --
CREATE TABLE dbo.userRole
(
    roleID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    roleName NVARCHAR(255) NOT NULL,
    roleDescription NVARCHAR(MAX) NOT NULL
    -- This is only shown in the DB itself and is not used in any other way (unless you make a view of it)
);
        GO
--//
-- CREATING USER TABLE ("dbo.userLogin") --
CREATE TABLE dbo.userLogin
(
    userID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    userEmail NVARCHAR(255) NOT NULL,
    userFirstName NVARCHAR(50) NOT NULL,
    userLastName NVARCHAR(50) NOT NULL,
    FK_roleID INT NOT NULL,

    CONSTRAINT FK_Role_User FOREIGN KEY (FK_roleID) REFERENCES dbo.userRole (roleID)
);
        GO

-- CREATING THIRD CONJUNCTION TABLE ("dbo.userLoginRole")
/* many to many relationship mellem userRole og userLogin
        CREATE TABLE dbo.userLoginRole
        (
            FK_userID INT NOT NULL,
            FK_roleID INT NOT NULL,

            CONSTRAINT FK_UserRole_User FOREIGN KEY (FK_userID) REFERENCES dbo.userLogin (userID),
            CONSTRAINT FK_UserRole_Role FOREIGN KEY (FK_roleID) REFERENCES dbo.userRole (roleID)
        );
        */

-- CREATING USERS PASSWORD TABLE ("dbo.userPassword") --
CREATE TABLE dbo.userPassword
(
    FK_userID INT NOT NULL,
    userHashedPassword NVARCHAR(255) NOT NULL,

    CONSTRAINT FK_Password_User FOREIGN KEY (FK_userID) REFERENCES dbo.userLogin (userID)
);
        GO

--//

-- CREATING WEAK ENTITY > THIRD CONJUNCTION TABLE  --
/* 
            To represent the many-to-many relationship between ("dbo.Table1") and ("dbo.Table2"), 
            we must create a third table, often called a junction table, 
            that breaks down the many-to-many relationship into two one-to-many relationships. 
            We must refer to the PRIMARY KEY from each of the two tables into the third table ("dbo.Table1Table2"),
            therefore we create two attributes and use them as FOREIGN KEY constraints which refer to the PRIMARY KEYS FROM THE OTHER TWO TABLES.
        */

-- project table
CREATE TABLE dbo.project
(            
    projectID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    projectName NVARCHAR(255) NOT NULL,
    projectDescription NVARCHAR(255) NOT NULL,
    projectGoal INT NOT NULL, 
    projectPicture NVARCHAR(255) NOT NULL, 
    projectTimeLimit INT NOT NULL,
    FK_userID INT NOT NULL
    --projectComments 
    -- projectBenefits 

    CONSTRAINT FK_User_Project FOREIGN KEY (FK_userID) REFERENCES dbo.userLogin (userID)
);
        GO

-- transaction table
CREATE TABLE dbo.transactionTable
(
    transactionID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    trFirstName NVARCHAR(255) NOT NULL, --NOT NULL * det skal udfyldes
    trLastName NVARCHAR(255) NOT NULL,
    trEmail NVARCHAR(255) NOT NULL,
    trAdresse NVARCHAR(255) NOT NULL,
    trCity NVARCHAR(255) NOT NULL,
    trZipCode INT NOT NULL, -- INT does not work from all countries NVARCHAR burde virke //vi anvender INT(fokuser på DK)
    -- NO creditcard
    trMoney INT NOT NULL,
    trTimeSt INT NOT NULL, -- skal det være noget andet end INT? BIGINT (date time) (sql.BIGINT as datatype in the query)
    FK_userID INT NOT NULL,
    FK_projectID INT NOT NULL,


    CONSTRAINT FK_User_Transaction FOREIGN KEY (FK_userID) REFERENCES dbo.userLogin (userID),
    CONSTRAINT FK_Project_Transaction FOREIGN KEY (FK_projectID) REFERENCES dbo.project (projectID)
);
        GO



    
    


--//
/* ------------------------- END OF CREATING TABLES ---------------------- */

/* --------------------------- START OF POPULATING TABLES WITH DATA --------------------------- */

-- INSERTING DATA IN THE USER ROLES TABLE ("dbo.userRole")
INSERT INTO dbo.userRole
    (roleName, roleDescription)
VALUES
    ('Super Administrator', 'This role has the most privileges; as super admin you can have access to the entire website and network administration features, you may add or delete websites within the network and perfo network-wide operations.'),
    ('Administrator', 'The Administrator is regarded as the most powerful of the five default users - This role is defined when the Administrator, (known as Admin) user role is created during the installation. - The Admin is the only user with peission to create new users, and modify and delete existing ones. As an Admin, you have access to all administration features such as adding, deleting and editing infoation from all other users and have complete control over site content. The Admin is the only user with peission to create new users, and modify and delete existing ones. As an Admin, you have access to all administration features such as adding, deleting and editing infoation from all other users and have complete control over site content. An Admin may add, delete and modify themes, plugins and core settings at any time.'),
    ('Editor', 'As you’d expect from an editor, the Editor role holds the highest position in overseeing a websites content. The only role higher than the Editor regarding privileges is the Admin, who can perfo site management tasks as well as manage and delete content as per this role. Users assigned the Editor role have total control over website content, their rights mean they can manage posts such as write, edit and publish and have the power to delete their own posts and pages, this includes those written by anyone else. The Editor can also view comments and moderate, alter, and delete them as they see fit. - An Editors rights go beyond content management. They may also manage categories add or delete tags and even upload files. Aside from having open access to all content related aspects of your site, the Editor wont have access to your sites settings, plugins or users.'),
    ('Author', 'Users with the Author role have complete control over their content, they may add, edit, publish and delete their own posts and upload images. They can also edit and delete their profile. Authors have no access to content produced by other users. They are also blocked from creating categories or doing anything to the pages on a site. - This role isnt used much in practice since Authors can delete their published posts and images, and edit their own published articles, which could cause problems for site owners. If you plan a website with multiple Authors, you might want to consider the Contributor role.'),
    ('Contributor', 'The Contributor role is a restricted version of the author role. A user with this role can write new posts and edit existing posts but cant publish or delete them once they are published. A Contributor submits their work for review by an Editor or an Admin before its published. Its worth noting that Contributors cant access the media library which means they cant upload images to their posts without assistance. - This role is a good choice when you want to allow other people to write for your website since they can’t access any of the features of the admin user role such as altering your site’s design, uploading or removing plugins or creating new categories. They can, however, use existing categories to add tags to their posts. A Contributor may view comments, even those which are in moderation but, they can’t modify, approve or delete them.'),
    ('Subscriber', 'The Subscriber is the default role for new site users, and it has the fewest peissions. If this role stays with the default capabilities, it is the most limited of all the user roles. A Subscriber can create a profile on a website, read its content and post comments. They have no access to any site settings and cant create or amend any content.')
        GO
--//

INSERT INTO dbo.userLogin
    (userEmail, userFirstName, userLastName, FK_roleID)
VALUES
    ('admin@db.dk', 'Andreas', 'Hoffmann', 1),
    ('miniadmin@db.dk', 'Gunther', 'Gnyt', 2),
    ('Editor@db.dk', 'Gimli', 'Gammel', 3),
    ('author@db.dk', 'Legolas', 'Jensen', 4),
    ('contributor@db.dk', 'Gustav', 'Augusta', 5),
    ('member@db.dk', 'Gammel', 'Far', 6)
        GO

INSERT INTO dbo.userLogin
    (userEmail, userFirstName, userLastName, FK_roleID)
VALUES
    ('1234@hotmail.com', 'Random', 'Dude', 6)
        GO

INSERT INTO dbo.userPassword
    (FK_userID, userHashedPassword)
VALUES
    (1, 'adminPassword'),
    (2, 'GuntherPassword'),
    (3, 'GimliPassword'),
    (4, 'LegolasPassword'),
    (5, 'GustavPassword'),
    (6, 'GammelFarPassword'),
    (7, 'RandomPassword')
        GO

INSERT INTO dbo.project
    (projectName, projectDescription, projectGoal,  projectPicture,  projectTimeLimit, FK_userID)
VALUES
    -- ( trFirstName, trLastName, trEmail, trAdresse, trCity, trZipCode, trCardInfo, trAmount, trTimeSt, FK_userID, FK_projectID),
    ('Cats', 'Et projekt om katte', 20000, 'billede', 5, 1),
    ('cars', 'Et projekt om biler', 50000, 'billede', 7, 3),
    ('Lamper', 'Et projekt om lamper', 22000, 'billede', 4, 2),
    ('Kræftens bekæmpelse', 'Et projekt om støtte til kræftens bekæmpelse', 1000000,'billede', 8, 3),
    ('Hunde', 'Et projekt om hunde', 51000, 'billede', 3, 4)

     GO

INSERT INTO dbo.transactionTable
    ( trFirstName, trLastName, trEmail, trAdresse, trCity, trZipCode, trCardInfo, trAmount, trTimeSt, FK_userID, FK_projectID)
VALUES
    -- ( trFirstName, trLastName, trEmail, trAdresse, trCity, trZipCode, trCardInfo, trAmount, trTimeSt, FK_userID, FK_projectID),
    ('Jens', 'Jens', 'Jens@ucn.dk', 'Gadevej 2', 'Aalborg', 9000, 1234543221, 100, 20102010, 1, 1),
    ('Hans', 'Christian', 'Andersen@ucn.dk', 'Odensevej 99', 'Odense', 4000, 123456789, 100, 10102010, 5, 3)
   
     GO
 
/* --------------------------- END OF POPULATING TABLES WITH DATA  --------------------------- */

/* --------------------- START SELECTING DATA FROM THE DATABASE --------------------------- */

    /*
        Here are the different types of the JOINs in SQL:
        - (INNER) JOIN: Returns records that have matching values in both tables;
        - LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table;
        - RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table;
        - FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table;
    */

	/*
    SELECT * FROM dbo.userLogin 
        INNER JOIN dbo.userLoginRole 
            ON userID = FK_userID
	*/


--/* --------------------------- END OF SELECTING DATA FROM THE DATABASE ---------------------------- */


-- INSERT INTO userLogin (userEmail) VALUES (@email); INSERT INTO userPassword (FK_userID, userPassword) VALUES (SCOPE_IDENTITY(), @userPassword); SELECT * FROM userLogin INNER JOIN userLoginRole ON userLogin.userID = userLoginRole.FK_userID WHERE userLogin.userEmail = @email')


--/* --------------------------- START UPDATE A USERROLE ---------------------------- */

-- UPDATE to change the user, but lack the history of the user

/*
		UPDATE userLoginRole
		SET FK_roleID = 2
		WHERE FK_userID = 15

		SELECT * FROM dbo.userRole
		INNER JOIN dbo.userLoginRole
		ON userRole.roleID = userLoginRole.FK_roleID 
		ORDER BY userLoginRole.FK_roleID ASC
*/

--/* --------------------------- END UPDATE A USERROLE ---------------------------- */

--/* --------------------------- START INSERT A USERROLE ---------------------------- */

-- INSERT to keep the "history" of the users (with no time dimension) BUT this will also create a problem!

/*
		INSERT INTO dbo.userLoginRole 
			(FK_userID, FK_roleID) 
		VALUES 
		(15, 2)


		SELECT * FROM dbo.userRole
		INNER JOIN dbo.userLoginRole
		ON userRole.roleID = userLoginRole.FK_roleID
		ORDER BY userLoginRole.FK_userID ASC
*/

--/* --------------------------- END INSERT A USERROLE ---------------------------- */

--/* --------------------------- START DELETE A USERROLE ---------------------------- */

-- The problem is that we have two user 15, who now got 2 roles? What could we do about that? 

/*
		DELETE FROM userLoginRole
		WHERE FK_userID = 15 AND FK_roleID = 6


		SELECT * FROM dbo.userRole
		INNER JOIN dbo.userLoginRole
		ON userRole.roleID = userLoginRole.FK_roleID
		ORDER BY userLoginRole.FK_userID ASC
*/

-- But not we lost the history of the user? Create a new table to keep the user infoation (and a time dimension table too)

--/* --------------------------- END INSERT A USERROLE ---------------------------- */