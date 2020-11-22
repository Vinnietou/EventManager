const {transformEvent} = require('./helpers');

const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args, req) => {             
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}

            const user = await User.findById(req.userId);
            if(!user) {throw new Error("User not found", err)}

            const {title, description, price, date } = args.eventInput;
            const event = new Event({
                title, description, price, date: new Date(date),
                creator: user
            });
            const createdEvent = await event
                .save();
            user.createdEvents.push(createdEvent);
            await user
                .save();
            return transformEvent(createdEvent);            
        }catch (err) {
            console.log(err);
            if(err.message === "User not found" || err.message === "Not Authenticated"){
                throw err;
            }else{
                throw new Error("Event not created", err)
            };
        }
    }
}