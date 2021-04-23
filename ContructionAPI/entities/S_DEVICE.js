const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const S_DEVICE = new Schema({
    device_name:{
        type: String,
        require:true
    },
    imei:{
        type: String,
        require: true
    },
    seri_sim:{
        type: String,
        require: true
    },
    org_code:{
        type: String,
        require: true
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

const S_DEVICE = mongoose.model('S_DEVICE',S_DEVICE);
module.exports= S_DEVICE;
