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
}