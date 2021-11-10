const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CallServiceSchema = new mongoose.Schema({

        tableId: {
            type: String,
            required: true
        },
        tableName: {
            type: String,
            required: true
        },
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: "hotels"
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String
        },
    },
);

module.exports = CallService = mongoose.model("callService", CallServiceSchema , 'callService');
