const { Schema, model, ObjectId } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    history: [{ type: ObjectId, ref: 'Message' }],
});


module.exports = model('Room', roomSchema);