const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformBooking, transformEvent} = require('./helpers');

module.exports = {
    bookings: async () => {
        try{
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        }catch(err){
            throw err;
        }
    },
    bookEvent: async args => {
        try{
            const fetchedEvent = await Event.findById(args.eventId)
            const booking = new Booking({
                user: "5fa5a51d7f9fd7093a1bee74",
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        }catch(err){
            throw err;
        }
    },
    cancelBooking: async args => {
        try{
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