const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    message: String,
    timeStamp: Date,
});


module.exports = model('Message', messageSchema);