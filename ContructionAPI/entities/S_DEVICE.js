const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
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
    //Indentify code 
    org_code:{
        type: String,
        require: true
    },
    active:{
        type: Number,
        require: true, 
        default:0
    },
    created_by:{
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

const S_DEVICE = mongoose.model('S_DEVICE',DeviceSchema);
module.exports= S_DEVICE;
