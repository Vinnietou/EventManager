const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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
    },
    deleteUser: async(args, req) => {
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}
            const user = await User.findById(args.userId);
            if(!user) {throw new Error("No such user")};

            //delete all user bookings
            await Booking.deleteMany({user: args.userId});
            //capture all user events
            const userEvents = await Event.find({creator: args.userId});
            //delete all bookings for the user events
            await userEvents.forEach((item => {
                Booking.deleteMany({event: item._id})
            }))
            //delete all user events
            await Event.deleteMany({creator: args.userId})
            //delete user
            await User.deleteOne({_id: args.userId});

            return user;
        }catch(err){
            throw err;
        }
    }
}