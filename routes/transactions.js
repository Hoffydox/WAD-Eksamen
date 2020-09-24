const express = require('express');
const Transaction = require('../models/transaction');
const router = express.Router();
const _ = require('lodash');
// const { transaction } = require('../config/connection');
const auth = require('../middleware/authenticate');
// const admin = require('../middleware/admin');




// Create a new transaction
router.post('/', [auth], async (req, res) => {

    // try:
  
    // validate the transaction-wannabe object
    // validate the password object
    // check if the transaction's Name is in the db already (call transaction.readByName) (if the transactions transaction is in the db)
    // save the transaction in the DB via the transaction.create(passwordObject)
    // if all good, we send the new transaction back with the response
    // catch:
    // otherwise respond with statuscode (for now: teapot) and error
    console.log(req.body);
    
    const transactionWannabe = req.body; // payload 
    
    try {
        const validateTransaction = Transaction.validate(transactionWannabe);
        if (validateTransaction.error) throw { statusCode: 400, message: validateTransaction.error };
        
        // here we check with transaction.readByName(transactionWannabe.transactionName)
        const existingTransaction = await Transaction.readByName(transactionWannabe.transactionName); // somewhere in here 404
        throw { statusCode: 403, message: 'Cannot save transaction in DB.' }
    }
    catch (transactionCheckError) {
        try {
            if (transactionCheckError.statusCode != 404) throw transactionCheckError;
            console.log("A")
            transactionWannabe.projectReceiver = {};
            transactionWannabe.projectReceiver.receiverID = req.user.projectId;
            transactionWannabe.userGiver = {};
            transactionWannabe.userGiver.giverID = req.user.userId;
            console.log("B")
            const newTransaction = await new Transaction(transactionWannabe).create(transactionWannabe); // hvad skal der være her?
            console.log(newTransaction);
            res.send(JSON.stringify(newTransaction));
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