const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypt = require('../config/encrypt');

const router = express.Router();

router.post('/', async (req, res) => {
    // res.setHeader('Content-Type', 'application/json');

    // validate the payload if email and password are in the correct format
    //  --> if validation fails send error (400 bad request)
    // check the DB for a mathing userLogin
    //  --> send back the userLogin (w/o the password!!!!) as the response
    //  --> send error back (404 not found)

    try {
        const { error } = User.validateLoginInfo(req.body);
        if (error) throw { statusCode: 400, message: error };

        const loggedInUser = await User.matchUserEmailAndPassword(req.body);

        const token = await jwt.sign(JSON.stringify(loggedInUser), crypt.jwtPrivateKey);

        loggedInUser.token = token;

        res.send(JSON.stringify(loggedInUser));
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