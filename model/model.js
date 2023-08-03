const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String

    },
    age: {
        required: true,
        type: String

    },
    gender: { 
        type: String, 
        default: null 
    },
    email: { type: String, unique: true },
    password: { type: String},
    token: { type: String },
    passwordDec: { type: String},
});

module.exports = mongoose.model('Data', dataSchema);