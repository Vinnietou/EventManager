const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    login: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user) { throw new Error("User does not exist"); }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) { throw new Error("Password is incorrect"); }

        const token = jwt.sign({userId: user.id, email: user.email}, process.env.SECRET, {
            expiresIn: "1h"
        });
        return { 
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };

    }
}