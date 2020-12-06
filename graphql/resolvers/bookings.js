const Booking = require('../../models/booking');
const Event = require('../../models/event');
const User = require('../../models/user');

const {transformBooking, transformEvent} = require('./helpers');

module.exports = {
    bookings: async (args, req) => {
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        }catch(err){
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}
            const user = await User.findById(req.userId);
            if(!user) {throw new Error("User not found", err)}
            const fetchedEvent = await Event.findById(args.eventId)
            const booking = new Booking({
                user: user,
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        }catch(err){
            console.log(err);
            throw err;
        }
    },
    cancelBooking: async (args, req) => {
        try{
            if(!req.isAuth) {throw new Error("Not Authenticated");}
            const booking = await Booking.findById(args.bookingId);
            if(!booking) {throw new Error("No such booking")};
            const event = booking.event;

            await Booking.deleteOne({_id: args.bookingId});
            return transformEvent(event);
        }catch(err){
            throw err;
        }
    }
}