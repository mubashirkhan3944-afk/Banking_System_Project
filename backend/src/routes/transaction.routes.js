const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();



router.post('/',authMiddleware.authMiddleware,transactionController.createTransaction);
router.post('/system/initial-fund',authMiddleware.systemUserMiddleware,transactionController.createInitialFundsTransaction);


module.exports = router;
