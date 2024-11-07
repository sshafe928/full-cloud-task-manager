const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    imageURL: {
        type: String,
        default: ''
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}, {collection:'full-cloud-tasks'})

module.exports = mongoose.model('Task', taskSchema);