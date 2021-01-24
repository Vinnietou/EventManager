const {transformUser} = require('./helpers');

const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const Event = require('../../models/event');

module.exports = {
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return transformUser(user);
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
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
            const deletedUserId = args.userId;
            const deletedUser = await User.findById(deletedUserId);
            if(!deletedUser) {throw new Error("No such user")};
            
            //get all user events and their IDs in one array
            const userEvents = await Event.find({creator: deletedUserId});
            let userEventsId = [];

            userEvents.forEach((event) => {
                userEventsId.push(event._id);
            });

            //Delete bookings on user made events
            await Booking.deleteMany({ event: { $in: userEventsId}})

            await Booking.deleteMany({user: deletedUserId});
            
            //delete all user events
            await Event.deleteMany({creator: deletedUserId})
            //delete user
            await User.deleteOne({_id: deletedUserId});

            return deletedUser;
        }catch(err){
            throw err;
        }
    }
}