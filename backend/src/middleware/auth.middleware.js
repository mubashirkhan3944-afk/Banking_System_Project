const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model')



async function authMiddleware(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized Access, token is missing"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token});

    if(isBlackListed){
        return res.status(401).json({
            message:'Unauthorized Access! token is invalid'
        })
    }


    try{
        const decoded = jwt.verify(token,process.env.JWT_TOKEN);


        const user = await userModel.findById(decoded.id);

        req.user = user;
        return next();


    }catch(error){
        return res.status(401).json({
            message:'Invalid token',
            error
        })
    }
}

async function systemUserMiddleware(req,res,next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access! Token not available"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({token});

    if(isBlackListed){
        return res.status(401).json({
            message:'Unauthorized Access! Token is invalid'
        })
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_TOKEN);

        const user = await userModel.findById({
            _id:decoded.id
        }).select('+systemUser')

        if(!user.systemUser){
            return res.status(403).json({
                message : 'Forbidden Access! Not a system user' 
            })
        }

        req.user = user;

        return next();

    }catch(error){
        return res.status(401).json({
            message:'Unauthorized access! token is invalid'
        })
    }
}


module.exports = {
    authMiddleware,
    systemUserMiddleware
}