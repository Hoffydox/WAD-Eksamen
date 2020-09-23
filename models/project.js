const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
// const bcrypt = require('bcryptjs');
// const crypt = require('../config/encrypt');



class Project {
    // constructor
    constructor(projectObj) {
        this.projectId = projectObj.projectId;
        this.projectName = projectObj.projectName;
        this.projectDescription = projectObj.projectDescription;
        this.projectGoal = projectObj.projectGoal;
        this.projectPicture = projectObj.projectPicture;
        this.projectTimeLimit = projectObj.projectTimeLimit;
    }

    static validate(projectObj) {
        console.log("her");
        const schema = Joi.object({
            projectId: Joi.number()
                .integer()
                .min(1),
            projectName: Joi.string()
                .max(50),
            projectDescription: Joi.string()
                .max(255),
            projectGoal: Joi.number()
                .integer
                .min(1),
            projectPicture: Joi.string()
                .max(255),
            projectTimeLimit: Joi.number()
                .integer
                .min(1)
        });
        console.log("her 2");
        return schema.validate(projectObj);

    }



    // create(projectOptionsObj) :: projectOptionsObj {password: '13212j3k2j1', ...}
    // const user = new User(userData);
    // user.create(projectOptionsObj);
    create(projectOptionsObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                //// this will be handled on route-handler level:
                //// check if the user already exists in the DB (static readByEmail)
                ////      --> if exists, then terminate create method, may not add the same user again
                ////      --> if doesnt exist then carry on

                // make hashPassword from projectOptionsObj.password
                // connect to the DB
                // make a query to insert user into userLogin table
                //      insert the hashedPassword into the password table with the user's key :: SCOPE_IDENTITY()
                //      read out the newly created user :: SCOPE_IDENTITY()
                // check the result
                //      --> if it exists and there is no more than 1 result, we are good to continue
                //      --> else throw error
                // create a user object and validate it
                // if all good, resolve with the new user object
                // if error, reject with error
                // CLOSE THE CONNECTION TO DB
                try {



                    const pool = await sql.connect(con);
                    const result1 = await pool.request()
                        .input('projectName', sql.NVarChar(50), this.projectName)
                        .input('projectDescription', sql.NVarChar(255), this.projectDescription)
                        .input('projectGoal', sql.INT(), this.projectGoal) // sql.INT or sql.number????? Gery?
                        .input('projectPicture', sql.NVarChar(255), this.projectPicture)
                        .input('projectTimeLimit', sql.INT(), this.projectTimeLimit)

                      /* semi kolon for enden???*/  .query(`INSERT INTO project (projectName, projectDescription, projectGoal, projectPicture, projectTimeLimit) 
                                VALUES (@projectName, @projectDescription, @projectGoal, @projectPicture, @projectTimeLimit)`);
                    console.log(result1);
                    if (result1.recordset.length != 1) throw { statusCode: 500, message: 'Database is corrupt.' };
                    /*
                    const result2 = await pool.request()
                        .input('userID', sql.Int, result1.recordset[0].userID)
                        .query(`INSERT INTO userLoginRole (FK_userID, FK_roleID)
                                VALUES (@userID, 2);
                                SELECT * FROM userLoginRole INNER JOIN userRole
                                ON userLoginRole.FK_roleID = userRole.roleID
                                WHERE userLoginRole.FK_userID = @userID`);
                    
                    console.log(result2);
                    if (result2.recordset.length != 1) throw { statusCode: 500, message: 'Database is corrupt.' }; 
                    */
                    const record = {
                        projectId: result1.recordset[0].projectID,
                        projectName: result1.recordset[0].projectName,
                        projectDescription: result1.recordset[0].projectDescription,
                        projectPicture: result1.recordset[0].projectPicture,
                        projectTimeLimit: result1.recordset[0].projectTimeLimit
                        /*
                             role: {
                             roleId: result2.recordset[0].roleID,
                             roleName: result2.recordset[0].roleName
                         }
                         */
                    }

                    const { error } = Project.validate(record);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new Project(record));
                }
                catch (err) {
                    console.log(err);
                    let errorMessage;
                    if (!err.statusCode) {
                        errorMessage = {
                            statusCode: 500,
                            message: err
                        }
                    } else {
                        errorMessage = err;
                    }
                    reject(errorMessage);
                }
                sql.close();
            })();
        });
    }

    static readByName(name) {
        return new Promise((resolve, reject) => {
            (async () => {
                // connect to DB
                // query: select * from userLogin where userEmail = email
                // check the result, we should have either 1 or no result
                //  --> if no result: user is not found
                //  --> if more results: corrupt DB
                // create a new projectWannabe object and validate (can it be a user?)
                // if all good, resolve with new user based on projectWannabe
                // if error, reject with error
                // CLOSE THE CONNECTION TO DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('projectName', sql.NVarChar(50), name)

                        .query('SELECT * FROM project WHERE projectName = @projectName');
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'Project not found.' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    const projectWannabe = {
                        projectId: result.recordset[0].projectID,
                        projectName: result.recordset[0].projectName,
                        projectDescription: result.recordset[0].projectDescription,
                        projectPicture: result.recordset[0].projectPicture,
                        projectTimeLimit: result.recordset[0].projectTimeLimit
                    }

                    const { error } = Project.validate(projectWannabe);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new Project(projectWannabe));
                }
                catch (err) {
                    console.log(err);
                    let errorMessage;
                    if (!err.statusCode) {
                        errorMessage = {
                            statusCode: 500,
                            message: err
                        }
                    } else {
                        errorMessage = err;
                    }
                    reject(errorMessage);
                }
                sql.close();
            })();
        });
    }


}
module.exports = Project;

/*
projectID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    projectName NVARCHAR(255) NOT NULL,
    projectDescription NVARCHAR(255) NOT NULL,
    projectGoal INT NOT NULL,
    projectPicture NVARCHAR(255) NOT NULL,
    projectTimeLimit INT NOT NULL,
FK_projectID INT NOT NULL */