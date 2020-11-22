const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try{
            const {email} = args.userInput;
            const passwordHash = await bcrypt.hash(args.userInput.password,12);
            const existingUser = await User.findOne({email});
            
            if(existingUser) {throw new Error("User already exists")}

            const user = new User({
                email: email,
                password: passwordHash
            });
            
            const result = await user
                .save();
                result.password = null;
                return result;
        }catch(err){
            console.log(err)
            throw err;
        }
    }
}