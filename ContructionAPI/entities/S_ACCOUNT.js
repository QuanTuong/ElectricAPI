const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    account_name: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    fullname:{
        type:String,
        required: true
    },
    email:{
        type: String
    },
    mobile:{
        type: String
    }, 
    employee_id:{
        type: String    //Remember get references
    },
    org_code:{
        type: String,
        required:true
    },
    status:{
        type: Number,
        default: 0
    },
    role:{
        type: Number, 
        default:2
    },
    created_by:{
        type:String,
        required: true
    },
    modified_by:{
        type:String,
        required: true
    }
},{
    timestamps:true
})

const S_ACCOUNT = mongoose.model('s_accounts',AccountSchema);
module.exports= S_ACCOUNT;
