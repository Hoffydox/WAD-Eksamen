const con = require('../config/connection');
const sql = require('mssql');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypt = require('../config/encrypt');



class project {
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
                .min(10),
                projectPicture: Joi.string()
                .max(255),
                projectTimeLimit: Joi.number()
                .integer
                .min(1)
        });

        return schema.validate(projectObj);
    }
}
module.exports = project;

/*
projectID INT NOT NULL IDENTITY (1,1) PRIMARY KEY,
    projectName NVARCHAR(255) NOT NULL,
    projectDescription NVARCHAR(255) NOT NULL,
    projectGoal INT NOT NULL,
    projectPicture NVARCHAR(255) NOT NULL,
    projectTimeLimit INT NOT NULL,
FK_projectID INT NOT NULL */