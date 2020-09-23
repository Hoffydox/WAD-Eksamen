const express = require('express');
const User = require('../models/user');
const router = express.Router();
const _ = require('lodash');
// const { user } = require('../config/connection');
const auth = require('../middleware/authenticate');
const admin = require('../middleware/admin');

router.post('/', async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');

    // try:
    // separate password info from the payload
    // validate the user-wannabe object
    // validate the password object
    // check if the user's email is in the db already (call User.readByEmail)
    // save the user in the DB via the user.create(passwordObject)
    // if all good, we send the new user back with the response
    // catch:
    // otherwise respond with statuscode (for now: teapot) and error
    const userWannabe = _.omit(req.body, 'password');
    const passwordWannabe = _.pick(req.body, 'password');
    console.log("line 23");
    try {
        const validateUser = User.validate(userWannabe);
        if (validateUser.error) throw { statusCode: 400, message: validateUser.error };
        console.log("line 27");
        const validatePassword = User.validateLoginInfo(passwordWannabe);
        if (validatePassword.error) throw { statusCode: 400, message: validatePassword.error };

        // here we check with User.readByEmail(userWannabe.userEmail)
        const existingUser = await User.readByEmail(userWannabe.userEmail);
        throw { statusCode: 403, message: 'Cannot save User in DB.' }
    }
    catch (userCheckError) {
        try {
            if (userCheckError.statusCode != 404) throw userCheckError;

            const newUser = await new User(userWannabe).create(passwordWannabe);
            console.log(newUser);
            res.send(JSON.stringify(newUser));
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

// what endpoints do we need?
// who should have access to what?
// if you create a project should be allowed
// is the currently logged in user allowed to see this specific thing

// order of things:
// what do you want from the system?
// endpoints
// delete (flag?)

router.get('/protected', [auth, admin], async (req, res) => { // auth checks token // admin checks for at least admin role status
    // res.setHeader('Content-Type', 'application/json');

    // let's check the req header if the token exists there, that proves the identity of the user

    res.send(JSON.stringify({ welcome: req.user }));
});

router.delete('/:userId', [auth, admin], async (req, res) => {
    // try 
    // validate if userId has the format of an accepted ID
    // check if the userId is the same as the current user's userId --> if it is, we should not let this happen
    // check if user exists in the DB (use User.readById(id)) --> returns the user with id
    // check if the current user should be able to delete the target user
    // delete the user calling user.delete()
    // send response with the deleted user object (due to RESTful convention)
    // catch error
    // send response with error code and error
    try {
        const validateUserId = User.validate(req.params);
        if (validateUserId.error) throw { statusCode: 400, message: validateUserId.error };

        if (req.params.userId == req.user.userId) throw { statusCode: 405, message: 'Cannot delete user.' };

        const userToBeDeleted = await User.readById(req.params.userId);

        if (userToBeDeleted.role.roleName == 'admin') throw { statusCode: 405, message: 'Cannot delete user.' };

        const deletedUser = await userToBeDeleted.delete();

        res.send(JSON.stringify(deletedUser));
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
});

module.exports = router;