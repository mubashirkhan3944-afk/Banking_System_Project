 const mongoose = require('mongoose');

 const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:String,
        ref:'account',
        required:true,
        index:true
    },
    toAccount:{
        type:String,
        required:true,
        ref:'account',
        index:true
    },
    status:{
        type:String,
        enum:{
            values:['PENDING','COMPLETED','FAILED','REVERSED'],
            message:'status can either be pending completed failed or reversed'
        },
        default:'PENDING'
    },
    amount:{
        type:Number,
        required:[true,'Amount is required to create transaction'],
        min:[0,'Amount cant be negative']
    },
    idempotencyKey:{
        type:String,
        required:[true,'idempotency key is required to create payment'],
        index:true,
        unique:true 
    }
 },{
    timestamps:true
 })


 const transactionModel = mongoose.model('transaction',transactionSchema);


 module.exports= transactionModel;