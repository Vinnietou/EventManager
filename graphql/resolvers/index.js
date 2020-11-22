const userResolver = require('./users');
const bookingResolver = require('./bookings');
const eventResolver = require('./events');
const authResolver = require('./auth');

const rootResolver = {
    ...userResolver,
    ...bookingResolver,
    ...eventResolver,
    ...authResolver
};

module.exports = rootResolver;