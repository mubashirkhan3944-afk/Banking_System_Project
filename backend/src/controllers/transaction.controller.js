const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const mongoose = require('mongoose');
const emailservice = require('../services/mail.service');
const userModel = require('../models/user.model');
const {v4} = require('uuid')



/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

//Controller for Creating a Transaction 
async function createTransaction(req,res){
    const {toAccount,amount} = req.body;
    const idempotencyKey = v4();

//step 1: validate request
    if(!toAccount || !req.user._id || !amount || !idempotencyKey){
        return res.status(400).json({
            message:'toAccount, fromAccount ,Amount ,IdempotencyKey is required'
        })
    }


    const fromUser = await userModel.findById(req.user._id)

    const fromUserAccount = await accountModel.findOne({user:fromUser._id})
    const toUserAccount = await accountModel.findOne({_id:toAccount});



    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:'Invalid from and to Account'
        })
    }

    console.log(fromUserAccount._id , toUserAccount._id)
    if(fromUserAccount._id.equals(toUserAccount._id)){
        return res.status(409).json({
            message:'You can not send Money to yourself'
        })
    }
//step 2 : validate idempotency key
        const alreadyTransacted = await transactionModel.findOne({
            idempotencyKey
        })
    
        if(alreadyTransacted){
            if(alreadyTransacted.status === 'COMPLETED'){
                return res.status(200).json({
                    message:'Transaction is already completed successfully'
                })
            }
            if(alreadyTransacted.status === 'PENDING'){
                return res.status(200).json({
                    message:'Transaction is till processing'
                })
            }
            if(alreadyTransacted.status === 'FAILED'){
                return res.status(200).json({
                    message:'Transaction is failed due to an error. Create another transaction'
                })
            }
            if(alreadyTransacted.status === 'REVERSED'){
                return res.status(200).json({
                    message:'Transaction is reversed. Create another transaction'
                })
            }
        }

    
//step3: check account status
    if(fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE'){
        return res.status(400).json({
            message:'Both fromAccount and toAccount must be Active to create a transaction'
        })
    }

//step4: check sufficient balance
    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message:`Insufficient funds. Current Balance is ${balance} and the amount is ${amount}`
        })
    }
//step5: create transaction
    let transaction;
    try{

        const session = await mongoose.startSession();
        session.startTransaction()



        transaction = (await transactionModel.create([{
            fromAccount:fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status:'PENDING'
        }],{session}))[0];

//step6: debit ledger entry
        const debitLedgerEntry = await ledgerModel.create([{
            account:fromUserAccount._id,
            amount,
            transaction:transaction._id,
            type:'DEBIT'
        }],{session});

//step7: credit ledger entry
        const creditLedgerEntry = await ledgerModel.create([{
            account:toAccount,
            amount,
            transaction:transaction._id,
            type:'CREDIT'
        }],{session})

//step8: mark transaction completed
        await transactionModel.findOneAndUpdate(
            {_id:transaction._id},
            {status:'COMPLETED'},
            {session}
        )

//step9: commit mongo session
        await session.commitTransaction();
        session.endSession()

//step10: send email notification
        await emailservice.sendTransactionEmail(fromUserAccount.username,fromUserAccount.email,amount);
        await emailservice.sendDepositEmail(toUserAccount.username,toUserAccount.email,amount);

        return res.status(200).json({
            message:'Funds Transfered Successfully'
        })

    }catch(error){
        console.log(error)
        return res.status(400).json({
            message:'Transaction is pending due to an error. PLease retry after some time.',
            error
        })
    }


}


//Same Controller for Creating Transaction from the System User
async function createInitialFundsTransaction(req,res){

    const {toAccount,amount} = req.body;

    const idempotencyKey = v4();

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:'toAccount amount and idempotency key are required'
        })
    }

    const toUserAccount = await accountModel.findOne({_id:toAccount});

    if(!toUserAccount){
        return res.status(400).json({
            message:'To Account Not Found!'
        })
    }

    const alreadyTransacted = await transactionModel.findOne({
        idempotencyKey
    })

    if(alreadyTransacted){
        if(alreadyTransacted.status === 'COMPLETED'){
            return res.status(200).json({
                message:'Transaction is already completed successfully'
            })
        }
        if(alreadyTransacted.status === 'PENDING'){
            return res.status(200).json({
                message:'Transaction is till processing'
            })
        }
        if(alreadyTransacted.status === 'FAILED'){
            return res.status(200).json({
                message:'Transaction is failed due to an error. Create another transaction'
            })
        }
        if(alreadyTransacted.status === 'REVERSED'){
            return res.status(200).json({
                message:'Transaction is reversed. Create another transaction'
            })
        }
    }

    const fromUserAccount = await accountModel.findOne({user:req.user._id})

    if(!fromUserAccount){
        return res.status(400).json({
            message:'System Account Not Found!'
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:'PENDING'
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: 'DEBIT'
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount,
        transaction:transaction._id,
        type:'CREDIT'
    }],{session})

    transaction.status = 'COMPLETED';

    await transaction.save({session});


    await session.commitTransaction()
    session.endSession();

    return res.status(200).json({
        message:'Initial fund transfer completed successfully'
    })

}


module.exports={
    createTransaction,
    createInitialFundsTransaction
}