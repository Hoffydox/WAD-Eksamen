USE "1074171" /* Database name */

/* ------------------------- START OF DROPPING TABLES ---------------------- */

-- Drop constraint if it already exists
-- Table: userPassword
-- Constraint: FK_Password_User
ALTER TABLE dbo.userPassword
DROP CONSTRAINT IF EXISTS FK_Password_User
GO

-- Drop constraint if it already exists
-- Table: userLogin
-- Constraint: FK_Role_User
ALTER TABLE dbo.userLogin
DROP CONSTRAINT IF EXISTS FK_Role_User
GO
-- Drop the table if it already exists
-- Table: userPassword
DROP TABLE IF EXISTS dbo.userPassword
GO

-- Drop the table if it already exists
-- Table: userRole
DROP TABLE IF EXISTS dbo.userRole
GO
-- Drop the table if it already exists
-- Table: userLogin
DROP TABLE if EXISTS dbo.userLogin
GO

/* --------------------------- START OF CREATING TABLES --------------------------- */

 
    -- CREATING USERS ROLE TABLE ("dbo.userRole") --
        CREATE TABLE dbo.userRole
        (
            roleID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
            roleName NVARCHAR(255) NOT NULL,
			roleDescription NVARCHAR(MAX) NOT NULL -- This is only shown in the DB itself and is not used in any other way (unless you make a view of it)
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
    --//
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
    --//

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
     
    --//
/* ------------------------- END OF CREATING TABLES ---------------------- */

/* --------------------------- START OF POPULATING TABLES WITH DATA --------------------------- */

    -- INSERTING DATA IN THE USER TABLE("dbo.userLogin") --
 /*
        INSERT INTO dbo.userLogin
            (userEmail)
        VALUES
            ('superadmin@ucn.dk'),
            ('admin@ucn.com'),
            ('User1@ucn.com'),
			('User2@ucn.com'),
			('User3@ucn.com'),
			('User4@ucn.com'),
			('User5@ucn.com'),
			('User6@ucn.com'),
			('User7@ucn.com'),
			('User8@ucn.com'),
			('User9@ucn.com'),
			('User10@ucn.com'),
			('User11@ucn.com'),
			('User12@ucn.com'),
			('User13@ucn.com'),
			('User14@ucn.com'),
			('User15@ucn.com')
			
        GO

        */
    --//

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

    -- INSERTING VALUES IN THE THIRD JUNCTION TABLE ("dbo.userLoginRole")
    /* DETTE ER KUN FOR MANY TO MANY RELATIONSHIP*/
/*
        INSERT INTO dbo.userLoginRole
            (FK_userID, FK_roleID)
        VALUES
            (1, 1),
            (2, 2),
            (3, 2),
			(4, 3),
			(5, 3),
			(6, 3),
			(7, 4),
			(8, 5),
			(9, 5),
			(10, 6),
			(11, 6),
			(12, 6),
			(13, 6),
			(14, 6),
			(15, 6),
			(16, 6),
			(17, 6)
        GO */

    --//
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