const userResolver = require('./users');
const bookingResolver = require('./bookings');
const eventResolver = require('./events');

const rootResolver = {
    ...userResolver,
    ...bookingResolver,
    ...eventResolver
};

module.exports = rootResolver;