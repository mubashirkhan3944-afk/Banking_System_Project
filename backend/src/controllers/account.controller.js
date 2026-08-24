const userModel=require('../models/user.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');


// Controller for creating bank account
/**  * -POST /api/account/create-account  */
async function createAccount(req,res){
        const user = req.user

        const alreadyAccount = await accountModel.findOne({user:user._id});

        if(alreadyAccount){
            return res.status(409).json({
                message:'Already had an account'
            })
        }

        const account = await accountModel.create({
            user:user._id
        });

        res.status(201).json({
            message:'Account created successfully' ,
            account       
        })
}

// Controller for getting user details
/**  * -GET /api/account/  */
async function getUserAccount(req,res){

    const user = await userModel.findOne({_id:req.user._id}).select('+systemUser')

    if(!user){
        return res.status(404).json({
            message:'User not found'
        })
    }
    const account = await accountModel.findOne({user:req.user._id})

    if(!account){
        return res.status(404).json({
            message:'Account not found'
        })
    }

    const balance = await account.getBalance();
    
    return res.status(200).json({
        account,
        user,
        balance
    })
}

// Controller for fetching user details by system User
/**  * -GET /api/account/get-user/:accountId  */
async function getAccountDetails(req,res){
    const { accountId } = req.params;

    const account = await accountModel.findById({
        _id:accountId,
        user:req.user._id
    })

    if(!account){
        return res.status(404).json({
            message:'Account Not Found'
        })
    }

    const user = await userModel.findOne({_id:account.user})

    const balance = await account.getBalance();

    return res.status(200).json({
        user : user.username,
        email: user.email,
        account : account._id,
        balance : balance,
        createdAt:user.createdAt,
})
}

// Controller for getting user transaction history
/**  * -GET /api/account/transactions  */
async function getTransactionHistory(req,res){
    const account = await accountModel.findOne({
        user:req.user._id
    });

    if(!account){
        return res.status(404).json({
            message:'Account Not Found'
        })
    }

    
    const transactions = await ledgerModel.find({
        account : account._id
    })


    return res.status(200).json({
        transactions
    })
}

module.exports= {
    createAccount,
    getUserAccount,
    getAccountDetails,
    getTransactionHistory
}