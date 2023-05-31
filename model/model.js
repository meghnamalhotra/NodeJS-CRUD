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
    }
});

module.exports = mongoose.model('Data', dataSchema);