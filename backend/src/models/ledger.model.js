const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,'Account is required for creating ledger entry'],
        index: true,
        immutable : true
    },
    amount:{
        type:Number,
        required: [true,'Amount required to create a ledger entry'],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:['CREDIT','DEBIT'],
            message:'Type can be either credit or debit'
        },
        required:true,
        immutable:true        
    }
})


function preventLedgerModifications(){
    throw new  Error('Ledger entries are immutable and can not be deleted or modified ')
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModifications);
ledgerSchema.pre('updateOne',preventLedgerModifications);
ledgerSchema.pre('deleteOne',preventLedgerModifications);
ledgerSchema.pre('remove',preventLedgerModifications);
ledgerSchema.pre('deleteMany',preventLedgerModifications);
ledgerSchema.pre('updateMany',preventLedgerModifications);
ledgerSchema.pre('findOneAndDelete',preventLedgerModifications);
ledgerSchema.pre('findOneAndReplace',preventLedgerModifications);


const ledgerModel = mongoose.model('ledger',ledgerSchema);


module.exports = ledgerModel;