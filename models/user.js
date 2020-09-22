const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypt = require('../config/encrypt');



class User {
    // constructor
    constructor(userObj) {
        this.userId = userObj.userId;
        this.userEmail = userObj.userEmail;
        this.userFirstName = userObj.userFirstName;
        this.userLastName = userObj.userLastName;
        // add info about the user's role --> role object
        if (userObj.role) {
            this.role = {}
            this.role.roleId = userObj.role.roleId;
            this.role.roleName = userObj.role.roleName;
        }
    }

    // static validate (for User object)
    static validate(userObj) {
        const schema = Joi.object({
            userId: Joi.number()
                .integer()
                .min(1),
            userEmail: Joi.string()
                .email()
                .max(255),
            userFirstName: Joi.string()
                .max(50),
            userLastName: Joi.string()
                .max(50),
            // add info about the user's role --> role object     
            role: Joi.object({
                roleId: Joi.number()
                    .integer()
                    .min(1),
                roleName: Joi.string()
                    .max(255)
            })
        });

        return schema.validate(userObj);
    }

    // static validateLoginInfo
    static validateLoginInfo(loginInfoObj) {
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .max(255),
            password: Joi.string()
                .min(3)
                .max(255)
        });

        return schema.validate(loginInfoObj);
    }

    // static matchUserEmailAndPassword
    static matchUserEmailAndPassword(loginInfoObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                // we try to:
                // connect to the DB
                // query the userLogin INNER JOIN userPassword (ON the userID) table for all the rows where
                //      userEmail == loginInfoObj.email
                //  
                //  check if i have found one and only user by that email
                //  --> if none found: throw 404 user not found
                //  --> if more than one found: throw 500 database is corrupt
                //
                //  check if the provided password is valid (based on the hashedPassword)
                //  --> if not: throw 404 user not found 
                //
                // check if there is a valid result (valid means one and ONLY one result)
                // create a user object for validation
                // validate the user object
                // if all good, resolve with user object
                // if error, reject with error
                // CLOSE THE DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userEmail', sql.NVarChar(255), loginInfoObj.email)
                        .query(`SELECT * FROM userLogin
                                    INNER JOIN userPassword
                                        ON userLogin.userID = userPassword.FK_userID
                                    INNER JOIN userLoginRole
                                        ON userLogin.userID = userLoginRole.FK_userID
                                    INNER JOIN userRole
                                        ON userLoginRole.FK_roleID = userRole.roleID
                                    WHERE userLogin.userEmail = @userEmail`);

                    console.log(result);
                    if (!result.recordset[0]) throw { statusCode: 404, message: 'User not found' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'DB is corrupt' };

                    const match = await bcrypt.compare(loginInfoObj.password, result.recordset[0].hashedPassword);
                    if (!match) throw { statusCode: 404, message: 'User not found' };

                    const record = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName, // userFirstName userLastName
                        userLastName: result.recordset[0].userLastName, //  userLastName: result.userLastName ???
                        role: {
                            roleId: result.recordset[0].roleID,
                            roleName: result.recordset[0].roleName
                        }
                    }

                    const { error } = User.validate(record);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(record));
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
                sql.close()
            })();
        });
    }

    // static readByEmail(email)
    static readByEmail(email) {
        return new Promise((resolve, reject) => {
            (async () => {
                // connect to DB
                // query: select * from userLogin where userEmail = email
                // check the result, we should have either 1 or no result
                //  --> if no result: user is not found
                //  --> if more results: corrupt DB
                // create a new userWannabe object and validate (can it be a user?)
                // if all good, resolve with new user based on userWannabe
                // if error, reject with error
                // CLOSE THE CONNECTION TO DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userEmail', sql.NVarChar(255), email)

                        .query('SELECT * FROM userLogin WHERE userEmail = @userEmail');
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'User not found.' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    const userWannabe = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName,
                        userLastName: result.recordset[0].userLastName
                    }

                    const { error } = User.validate(userWannabe);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(userWannabe));
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

    // create(optionsObj) :: optionsObj {password: '13212j3k2j1', ...}
    // const user = new User(userData);
    // user.create(optionsObj);
    create(optionsObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                //// this will be handled on route-handler level:
                //// check if the user already exists in the DB (static readByEmail)
                ////      --> if exists, then terminate create method, may not add the same user again
                ////      --> if doesnt exist then carry on

                // make hashPassword from optionsObj.password
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
                    const hashedPassword = await bcrypt.hash(optionsObj.password, crypt.saltRounds);

                    const pool = await sql.connect(con);
                    const result1 = await pool.request()
                        .input('userEmail', sql.NVarChar(255), this.userEmail)

                        .input('userFirstName', sql.NVarChar(50), this.userFirstName)
                        .input('userLastName', sql.NVarChar(50), this.userLastName)

                        .input('rawPassword', sql.NVarChar(255), optionsObj.password)
                        .input('hashedPassword', sql.NVarChar(255), hashedPassword)
                        .query(`INSERT INTO userLogin (userEmail, userFirstName, userLastName, userPassword) VALUES (@userEmail, @userFirstName, @userLastName, @rawPassword);
                                SELECT userID, userEmail FROM userLogin WHERE userID = SCOPE_IDENTITY();
                                INSERT INTO userPassword (FK_userID, hashedPassword) VALUES (SCOPE_IDENTITY(), @hashedPassword)`);
                    console.log(result1);
                    if (result1.recordset.length != 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    // changed the default role to admin roleId = 1 for easier testing purposes for now
                    const result2 = await pool.request()
                        .input('userID', sql.Int, result1.recordset[0].userID)
                        .query(`INSERT INTO userLoginRole (FK_userID, FK_roleID)
                                VALUES (@userID, 2);
                                SELECT * FROM userLoginRole INNER JOIN userRole
                                ON userLoginRole.FK_roleID = userRole.roleID
                                WHERE userLoginRole.FK_userID = @userID`);
                    console.log(result2);
                    if (result2.recordset.length != 1) throw { statusCode: 500, message: 'Database is corrupt.' };

                    const record = {
                        userId: result1.recordset[0].userID,
                        userEmail: result1.recordset[0].userEmail,
                        userFirstName: result1.recordset[0].userFirstName,
                        userLastName: result1.recordset[0].userLastName,
                        role: {
                            roleId: result2.recordset[0].roleID,
                            roleName: result2.recordset[0].roleName
                        }
                    }

                    const { error } = User.validate(record);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(record));
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

    // wad-login-workshop-api-v5-delete

    // static readById(id)
    static readById(id) {
        return new Promise((resolve, reject) => {
            (async () => {
                // try
                // connect to DB (pool)
                // query the DB via the pool (SELECT * FROM userLogin INNER JOIN userLoginRole ...)
                // check if the user was found (and only one was found)
                // format the query result into a userWannabe object
                // validate the userWannabe object
                // resolve with new User based on userWannabe
                // catch error
                // check if error.statusCode exists
                //  -> if not, reformat the error to have a .statusCode property
                // reject with error
                // CLOSE THE CONNECTION TO THE DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userID', sql.Int, id)
                        .query(`SELECT * FROM userLogin
                            INNER JOIN userLoginRole
                            ON userLogin.userID = userLoginRole.FK_userID
                            INNER JOIN userRole
                            ON userLoginRole.FK_roleID = userRole.roleID
                            WHERE userLogin.userID = @userID`);
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'User not found.' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Multiple users found with same ID. DB is corrupt.' };

                    const userWannabe = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName, // userFirstName userLastName
                        userLastName: result.recordset[0].userLastName,
                        role: {
                            roleId: result.recordset[0].roleID,
                            roleName: result.recordset[0].roleName
                        }
                    }

                    const { error } = User.validate(userWannabe);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(userWannabe));
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

    // delete()
    // DELETE as removing from the DB! as if it never existed!!!!
    delete() {
        return new Promise((resolve, reject) => {
            (async () => {
                // try
                // connect to the DB
                // three DELETE queries to the three tables: userLoginRole, userPassword, userLogin
                //  --> BUT we need the information that was (or to be) deleted
                //  --> we need to SELECT first (may need joined tables for this select) and then DELETE (from the respective tables only)
                // check the results if they exist (in THIS example, there should be exactly one result in both queries: userLoginRole and userLogin)
                // create the userWannabe with the corresponding information from the results
                // validate userWannabe
                // resolve with new User based on userWannabe
                // catch error
                // if there is no statusCode, make one
                // reject with error
                // CLOSE THE CONNECTION TO THE DB
                try {
                    const pool = await sql.connect(con);
                    const result = await pool.request()
                        .input('userID', sql.Int, this.userId)
                        .query(`SELECT * FROM userLogin
                                INNER JOIN userLoginRole
                                ON userLogin.userID = userLoginRole.FK_userID
                                INNER JOIN userRole
                                ON userLoginRole.FK_roleID = userRole.roleID
                                WHERE userLogin.userID = @userID;

                                DELETE FROM userLoginRole
                                WHERE FK_userID = @userID;

                                DELETE FROM userPassword
                                WHERE FK_userID = @userID;

                                DELETE FROM userLogin
                                WHERE userID = @userID
                        `);
                    console.log(result);
                    if (result.recordset.length == 0) throw { statusCode: 404, message: 'User not found.' };
                    if (result.recordset.length > 1) throw { statusCode: 500, message: 'Multiple users found with same ID. DB is corrupt.' };

                    const userWannabe = {
                        userId: result.recordset[0].userID,
                        userEmail: result.recordset[0].userEmail,
                        userFirstName: result.recordset[0].userFirstName,
                        userLastName: result.recordset[0].userLastName,
                        role: {
                            roleId: result.recordset[0].roleID,
                            roleName: result.recordset[0].roleName
                        }
                    }

                    const { error } = User.validate(userWannabe);
                    if (error) throw { statusCode: 409, message: error };

                    resolve(new User(userWannabe));
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
                sql.close()
            })();
        });
    }
}


module.exports = User;