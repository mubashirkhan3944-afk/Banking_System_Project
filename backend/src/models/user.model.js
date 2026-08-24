const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is required to create an account'],
        trim:true,
        lowercase:true,
        match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
        unique:[true,'Email already exists!']
    },
    username:{
        type:String,
        required:[true,'Name is required to create account']
    },
    password:{
        type:String,
        required:[true,'Password is required to create account'],
        minlength:[6,'Min 6 chars long password'],
        maxlength:[20,'max 20 chars long password'],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timestamps:true
})



userSchema.pre('save',async function () {
    if(!this.isModified('password')){
        return 
    }

    const hash = await bcrypt.hash(this.password,10);
    this.password=hash;

    return 

})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare (password,this.password);
}



const userModel = mongoose.model('user',userSchema);


module.exports = userModel;