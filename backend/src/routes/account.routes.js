const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');


const router = express.Router();


router.post('/create-account',authMiddleware.authMiddleware,accountController.createAccount);
router.get('/',authMiddleware.authMiddleware,accountController.getUserAccount);
router.get('/get-user/:accountId',authMiddleware.systemUserMiddleware,accountController.getAccountDetails);
router.get('/transactions',authMiddleware.authMiddleware,accountController.getTransactionHistory);




module.exports = router;