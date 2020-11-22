const {transformEvent} = require('./helpers');

const Event = require('../../models/event');

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
    createEvent: async args => {             
        try{
            const {title, description, price, date } = args.eventInput;
            const event = new Event({
                title, description, price, date: new Date(date),
                creator: "5fa5a51d7f9fd7093a1bee74"
            });
            const createdEvent = await event
                .save();
            const user = await User.findById("5fa5a51d7f9fd7093a1bee74");
            if(!user) {throw new Error("User not found", err)}
            user.createdEvents.push(createdEvent);
            await user.save();
            return transformEvent(createdEvent);            
        }catch (err) {
            console.log(err);
            if(err.message = "User not found"){
                throw err;
            }else{
                throw new Error("Event not created", err)
            };
        }
    }
}