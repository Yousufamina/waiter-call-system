const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelsSchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true
        },
        address: {
            type: String
        },
        phone: {
            type: String
        },
        logo:{
            type:String
        },
        menue:{
            type:String
        },
        tables:[
            {
                name:String,
                qrCode: String,
                qrCodeImage:String
            }
            ],
        createdDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            default: "Active",
        },
    },
);

module.exports = Hotels = mongoose.model("hotels", HotelsSchema , 'hotels');
