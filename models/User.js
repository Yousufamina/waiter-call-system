const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new mongoose.Schema({

        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        type:{
            type: Schema.Types.ObjectId,
            ref: "type",
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
            type: String,
            default: "Active",
        },
    },
);

module.exports = Users = mongoose.model("users", UsersSchema , 'users');
