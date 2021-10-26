const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WaitersSchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        age: {
            type: Number
        },
        hotelId: {
            type: Schema.Types.ObjectId,
            ref: "hotels",
            required: true
        },
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

module.exports = Waiters = mongoose.model("waiters", WaitersSchema , 'waiters');
