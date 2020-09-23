USE "1074171"
--USE "1081536"


/* ------------------------- START OF DROPPING TABLES ---------------------- */

-- Drop constraint if it already exists
-- Table: userLoginRole
-- Constraint: FK_UserRole_User, FK_UserRole_Role
ALTER TABLE dbo.userLoginRole
DROP CONSTRAINT IF EXISTS FK_UserRole_User
GO
ALTER TABLE dbo.userLoginRole
DROP CONSTRAINT IF EXISTS FK_UserRole_Role
GO

-- Dropper constraint hvis den existere
-- Table: userLogin
-- Constraint: FK_Role_User
/*ALTER TABLE dbo.userLogin
DROP CONSTRAINT IF EXISTS FK_Role_User
GO
*/

-- Dropper constraint hvis den existere
-- Table: userPassword
-- Constraint: FK_Password_User
ALTER TABLE dbo.userPassword
DROP CONSTRAINT IF EXISTS FK_Password_User
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

-- Drop the table if it already exists
-- Table: userLoginRole
DROP TABLE if EXISTS dbo.userLoginRole
GO

/* --------------------------- Laver TABLES --------------------------- */


CREATE TABLE userLogin
(
    userID INT IDENTITY (1,1) NOT NULL,
    userEmail NVARCHAR (255) NOT NULL,
    userFirstName NVARCHAR (50) NOT NULL,
    userLastName NVARCHAR (50) NOT NULL,
    userPassword NVARCHAR (255) NOT NULL,

    PRIMARY KEY (userID)
);
        GO

-- CREATING USERS ROLE TABLE ("dbo.userRole") --
CREATE TABLE userRole
(
    roleID INT IDENTITY (1,1) NOT NULL,
    roleName NVARCHAR (255) NOT NULL,
    roleDescription NVARCHAR(MAX) NOT NULL,
    -- This is only shown in the DB itself and is not used in any other way (unless you make a view of it)
    PRIMARY KEY (roleID)

);
        GO
--//
-- CREATING USER TABLE ("dbo.userLogin") --


CREATE TABLE userLoginRole
(
    FK_userID INT NOT NULL,
    FK_roleID INT NOT NULL,

    CONSTRAINT FK_UserRole_User FOREIGN KEY (FK_userID) REFERENCES userLogin(userID),
    CONSTRAINT FK_UserRole_Role FOREIGN KEY (FK_roleID) REFERENCES userRole(roleID)
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
CREATE TABLE userPassword
(
    FK_userID INT NOT NULL,
    hashedPassword NVARCHAR (255) NOT NULL,

    CONSTRAINT FK_Password_User FOREIGN KEY (FK_userID) REFERENCES userLogin(userID)
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
CREATE TABLE project
(
    projectID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    projectName NVARCHAR(50) NOT NULL,
    projectDescription NVARCHAR(255) NOT NULL,
    projectGoal INT NOT NULL,
    projectPicture NVARCHAR(255) NOT NULL,
    projectTimeLimit INT NOT NULL,
    FK_userID INT NOT NULL
        --projectComments 
        -- projectBenefits 

        CONSTRAINT FK_User_Project FOREIGN KEY (FK_userID) REFERENCES userLogin(userID)
);
        GO

-- transaction table
CREATE TABLE transactionTable
(
    transactionID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    trFirstName NVARCHAR(255) NOT NULL,
    --NOT NULL * det skal udfyldes
    trLastName NVARCHAR(255) NOT NULL,
    trEmail NVARCHAR(255) NOT NULL,
    trAdresse NVARCHAR(255) NOT NULL,
    trCity NVARCHAR(255) NOT NULL,
    trZipCode INT NOT NULL,
    -- INT does not work from all countries NVARCHAR burde virke //vi anvender INT(fokuser på DK)
    -- NO creditcard
    trMoney INT NOT NULL,
    trTimeSt INT NOT NULL,
    -- skal det være noget andet end INT? BIGINT (date time) (sql.BIGINT as datatype in the query)
    FK_userID INT NOT NULL,
    FK_projectID INT NOT NULL,


    CONSTRAINT FK_User_Transaction FOREIGN KEY (FK_userID) REFERENCES userLogin(userID),
    CONSTRAINT FK_Project_Transaction FOREIGN KEY (FK_projectID) REFERENCES project(projectID)
);
        GO







--//
/* ------------------------- END OF CREATING TABLES ---------------------- */

/* --------------------------- START OF POPULATING TABLES WITH DATA --------------------------- */

-- INSERTING DATA IN THE USER ROLES TABLE ("dbo.userRole")
INSERT INTO userRole
    (roleName, roleDescription)
VALUES
    ('Super Administrator', 'The super Admin has absolute control over the site.'),
    ('Administrator', 'Admins have full power over the site, except when it comes to banning or deleting other admins or the super admin'),
    ('Editor', 'Editors are for maintaining the website. Editors can edit comments, and projects. (And possibly flag users.)'),
    ('Creator', 'Users who have made 1 or more projects are Creators.'),
    ('Member', 'Members are userser who is logged in and is registered in the database.'),
    ('Visitor', 'Visitors, is users who has not created a login or is not logged in')
        GO
--//

INSERT INTO userLogin
    (userEmail, userFirstName, userLastName, userPassword)
VALUES
    ('admin@db.dk', 'Andreas', 'Hoffmann', 'password1'),
    ('miniadmin@db.dk', 'Gunther', 'Gnyt', 'password2'),
    ('Editor@db.dk', 'Gimli', 'Gammel', 'password3'),
    ('author@db.dk', 'Legolas', 'Jensen', 'password4'),
    ('contributor@db.dk', 'Gustav', 'Augusta', 'password5'),
    ('member@db.dk', 'Gammel', 'Far', 'password6'),
    ('1234@hotmail.com', 'Random', 'Dude', 'password7')
        GO

INSERT INTO userLoginRole
    (FK_userID, FK_roleID)
VALUES
    (1, 1),-- Admin
    (2, 6),
    (3, 6),
    (4, 6),
    (5, 6),
    (6, 6),
    (7, 6) 
GO

 


INSERT INTO userPassword
    (FK_userID, hashedPassword)
VALUES
    (1, 'adminPassword'),
    (2, 'GuntherPassword'),
    (3, 'GimliPassword'),
    (4, 'LegolasPassword'),
    (5, 'GustavPassword'),
    (6, 'GammelFarPassword'),
    (7, 'RandomPassword')
        GO




INSERT INTO project
    (projectName, projectDescription, projectGoal, projectPicture, projectTimeLimit, FK_userID)
VALUES
    -- ( trFirstName, trLastName, trEmail, trAdresse, trCity, trZipCode, trCardInfo, trAmount, trTimeSt, FK_userID, FK_projectID),
    ('Cats', 'Et projekt om katte', 20000, 'billede', 5, 1),
    ('cars', 'Et projekt om biler', 50000, 'billede', 7, 3),
    ('Lamper', 'Et projekt om lamper', 22000, 'billede', 4, 2),
    ('Kræftens bekæmpelse', 'Et projekt om støtte til kræftens bekæmpelse', 1000000, 'billede', 8, 3),
    ('Hunde', 'Et projekt om hunde', 51000, 'billede', 3, 4)

     GO

INSERT INTO transactionTable
    (trFirstName, trLastName, trEmail, trAdresse, trCity, trZipCode, trMoney, trTimeSt, FK_userID, FK_projectID)
VALUES
    -- ( trFirstName, trLastName, trEmail, trAdresse, trCity, trZipCode, trCardInfo, trAmount, trTimeSt, FK_userID, FK_projectID),
    ('Jens', 'Jens', 'Jens@ucn.dk', 'Gadevej 2', 'Aalborg', 9000, 100, 20102010, 1, 1),
    ('Hans', 'Christian', 'Andersen@ucn.dk', 'Odensevej 99', 'Odense', 4000, 100, 10102010, 5, 3)
   
     GO
 

 SELECT *
    FROM userLogin
    INNER JOIN userLoginRole
    ON userID = FK_userID
    GO

    SELECT *
    FROM userLogin
    LEFT JOIN userPassword
    ON userID = FK_userID
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