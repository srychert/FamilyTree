const { Schema, model } = require('mongoose');
// const Message = require('./Message');

const messageSchema = new Schema({
    msg: String,
    timeStamp: Date,
});

const roomSchema = new Schema({
    history: [messageSchema],
});


module.exports = model('Room', roomSchema);