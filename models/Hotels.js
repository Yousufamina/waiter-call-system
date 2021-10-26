const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HotelsSchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        address: {
            type: String
        },
        tables:[
            {
                qrCode: String,
                waiterId: {
                    type: Schema.Types.ObjectId,
                    ref: "waiters",
                }
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
