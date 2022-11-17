const { Schema, model } = require('mongoose');

// Pole „_id” (które ma modelować userId) dodawane jest domyślnie, dlatego pomijamy je w deklaracji
const userSchema = new Schema({
    login: String,
    email: String,
    registrationDate: Date,
});

module.exports = model('User', userSchema);
