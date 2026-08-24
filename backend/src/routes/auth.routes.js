const express=require('express')
const router = express.Router();
const authcontroller = require('../controllers/auth.controllers');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register',authcontroller.registerUser);
router.post('/login',authcontroller.loginUser);
router.get('/logout',authcontroller.logoutUser);


module.exports=router;