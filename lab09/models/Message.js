const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    msg: String,
    timeStamp: Date,
});


module.exports = model('Message', messageSchema);