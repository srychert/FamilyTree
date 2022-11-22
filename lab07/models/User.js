const { Schema, model } = require('mongoose');

// Pole „_id” (które ma modelować userId) dodawane jest domyślnie, dlatego pomijamy je w deklaracji
const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
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
    registrationDate: Date,
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'USER']
    }
});

module.exports = model('User', userSchema);
