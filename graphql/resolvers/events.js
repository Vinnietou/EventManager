const {transformEvent} = require('./helpers');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

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
    },
    updateEvent: async(args, req) => {
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}

            const user = await User.findById(req.userId);
            if(!user) {throw new Error("User not found", err)}

            //checking only that the request has an user
            //not adding server side validation for eligible user as this will be validated on the front-end.
            //don't want to mess it up for admins

            const updatedEvent = await Event.findByIdAndUpdate(args.eventId,
                {
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: args.eventInput.date
                }, function(err, updatedUser){
                    if(err){
                        throw err
                    }
                }
            );
            return updatedEvent;
        }catch(err){
            console.log(err);
        }   
    },
    deleteEvent: async(args, req) => {
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}
            const event = await Event.findById(args.eventId);
            if(!event) {throw new Error("No such event")};

            //remove the event from User createdList
            const user = await User.findById(req.userId);
            const updatedEventList = user.createdEvents.filter(createdEvent => createdEvent._id != args.eventId);
            console.log(updatedEventList);
            user.createdEvents = updatedEventList;            
            await user.save();

            //delete all bookings for an event
            await Booking.deleteMany({event: args.eventId});
            //delete event
            await Event.deleteOne({_id: args.eventId});
            
            return transformEvent(event);
        }catch(err){
            throw err;
        }
    }
}