const mongoose = require('mongoose');


async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB');
    }catch(error){
        console.log(error);
        process.exit(1);
    }

}

module.exports=connectDB;