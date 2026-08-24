const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailservice = require('../services/mail.service');
const tokenBlackListModel = require('../models/blacklist.model');

/**  * -POST /api/auth/register  */
async function registerUser(req,res){

    const {email,password,username} = req.body;

    const isexists = await userModel.findOne({email});

    if(isexists){
        return res.status(422).json({
            message: "User already exist"
        })
    }

    const user = await userModel.create({email,password,username})
    const token = jwt.sign({
        id:user._id
    },process.env.JWT_TOKEN,
    {
    expiresIn : '3d'
});

    res.cookie('token',token);

    res.status(201).json({
        message:'User Created Successfully',
        user:{
            username:user.username,
            email:user.email,
            id:user._id
        },
        token
    })

    await emailservice.sendRegistrationEmail(user.username,user.email);

}

/**  * -POST /api/auth/login  */
async function loginUser(req,res){
    const {username,email,password}=req.body;

    const userExists = await userModel.findOne({email}).select('+password');

    if(!userExists){
        return res.status(409).json({
            message:'Account not found'
        })
    }

    if(username != userExists.username){
        return res.status(409).json({
            message:'username is incorrect'
        })
    }

    const corrPassword = await userExists.comparePassword(password);

    if(!corrPassword){
        return res.status(401).json({
            message:'email or password is incorrect'
        })
    }

    const token = jwt.sign({
        id:userExists._id
    },process.env.JWT_TOKEN,{expiresIn: '3d' })



    res.cookie('token',token,{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        maxAge:24*60*60*1000,
        path:'/'
    });

    
    res.status(200).json({
        message:'Login successful',
        user:{
            id:userExists._id,
            email:userExists.email,
            name:userExists.name
        },
        token
    });
    
    await emailservice.sendLoginEmail(username,email)
}

/**  * -POST /api/auth/logout  */
async function logoutUser(req,res){
    const token = req.cookies.token || req.headers.authorization?.(' ')[1];

    console.log(req);

    if(!token){
        return res.status(200).json({
            message:'User Already logged out'
        })
    }

    const decoded = jwt.verify(token,process.env.JWT_TOKEN);

    const userExists = await userModel.findById(decoded.id)

     await tokenBlackListModel.create({
        token:token
     })

    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        path:'/'
    });

     res.status(200).json({
        message:'User Logged Out successfully'
     })

     await emailservice.sendLogoutEmail(userExists.username,userExists.email);

}

module.exports={
    registerUser,
    loginUser,
    logoutUser
}