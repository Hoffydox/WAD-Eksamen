const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypt = require('../config/encrypt');



class transaction {
    // constructor
    constructor(transactionObj) {
        this.transactionId = transactionObj.transactionId;

        this.transactionFirstName = transactionObj.transactionFirstName;
        this.transactionLastName = transactionObj.transactionLastName;

        this.transactionEmail = transactionObj.transactionEmail;
        this.transactionAdresse = transactionObj.transactionAdresse;

        this.transactionCity = transactionObj.transactionCity;
        this.transactionZipCode = transactionObj.transactionZipCode;

        this.transactionMoney = transactionObj.transactionMoney;
        this.transactionTimeSt = transactionObj.transactionTimeSt;

    }

    static validate(transactionObj) {
        const schema = Joi.object({
            transactionId: Joi.number()
                .integer()
                .min(1),
            transactionFirstName: Joi.string()
                .max(255),
            transactionLastName: Joi.string()
                .max(255),
            transactionEmail: Joi.string()
                .email()
                .max(255),
            transactionAdresse: Joi.string()
                .max(255),
            transactionCity: Joi.string()
                .max(255),
            transactionZipCode: Joi.number()
                .integer
                .min(4)
                .max(4),
            transactionMoney: Joi.number()
                .integer
                .min(1),
            transactionTimeSt: Joi.number()
                .integer
                .min(1),
        });
        return schema.validate(transactionObj);
    }
}
module.exports = transaction;

/*  transactionID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    trFirstName NVARCHAR(255) NOT NULL,
    trLastName NVARCHAR(255) NOT NULL,
    trEmail NVARCHAR(255) NOT NULL,
    trAdresse NVARCHAR(255) NOT NULL,
    trCity NVARCHAR(255) NOT NULL,
    trZipCode INT NOT NULL,
    trMoney INT NOT NULL,
    trTimeSt INT NOT NULL,
*/