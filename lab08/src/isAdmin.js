const User = require("../models/User");

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user.role === "ADMIN") {
        next();
    } else {
        return res.redirect('/login');
    }
};

module.exports = isAdmin;