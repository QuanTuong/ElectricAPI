const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const S_ACCOUNT_DEVICE = new Schema({
    account_id: {
        type: Schema.Types.ObjectId,
        ref: 'S_ACCOUNT'
    },
    device_id:{
        type: Schema.Types.ObjectId,
        ref: 'S_DEVICE'
    },
    org_code:{
        type: String,
        required:true
    },
    active:{
        type: String,
        require: true
    },
    create_by:{
        type: String,
        require:true
    },
    modified_by:{
        type:String,
        required: true
    }
},{
    timestamps:true
})

const S_ACCOUNT_DEVICE = mongoose.model('S_ACCOUNT_DEVICE',S_ACCOUNT_DEVICE);
module.exports= S_ACCOUNT_DEVICE  ;
