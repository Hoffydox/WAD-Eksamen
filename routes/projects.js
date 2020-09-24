const express = require('express');
const Project = require('../models/project');
const router = express.Router();
const _ = require('lodash');
// const { project } = require('../config/connection');
const auth = require('../middleware/authenticate');
// const admin = require('../middleware/admin');




// Create a new PROJECT
router.post('/', [auth], async (req, res) => {

    // try:
  
    // validate the project-wannabe object
    // validate the password object
    // check if the project's Name is in the db already (call project.readByName) (if the projects project is in the db)
    // save the project in the DB via the project.create(passwordObject)
    // if all good, we send the new project back with the response
    // catch:
    // otherwise respond with statuscode (for now: teapot) and error
    console.log(req.body);
    
    const projectWannabe = req.body; // payload 
    
    try {
        console.log("line 28");
        const validateProject = Project.validate(projectWannabe);
        if (validateProject.error) throw { statusCode: 400, message: validateProject.error };
        console.log("line 32");

        // here we check with project.readByName(projectWannabe.projectName)
        const existingProject = await Project.readByName(projectWannabe.projectName); // somewhere in here 404
        throw { statusCode: 403, message: 'Cannot save project in DB.' }
    }
    catch (projectCheckError) {
        try {
            if (projectCheckError.statusCode != 404) throw projectCheckError;
            projectWannabe.projectOwner = {};
            projectWannabe.projectOwner.ownerID = req.user.userId;
            const newProject = await new Project(projectWannabe).create(projectWannabe); // hvad skal der være her?
            console.log(newProject);
            res.send(JSON.stringify(newProject));
            
        }
        catch (err) {
            let errorMessage;
            if (!err.statusCode) {
                errorMessage = {
                    statusCode: 500,
                    message: err
                }
            } else {
                errorMessage = err;
            }
            res.status(errorMessage.statusCode).send(JSON.stringify(errorMessage));
        }
    }
});

module.exports = router;