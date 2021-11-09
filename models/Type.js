const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TypeSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        createdDate: {
            type: Date,
            default: Date.now,
        },
    },
);

module.exports = Type = mongoose.model("type", TypeSchema , 'type');

