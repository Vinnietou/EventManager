const { dateToString } = require('../../helpers/date');

const transformBooking = booking => {
    return{
        ...booking._doc,
        createdAt: dateToString(booking._doc.createdAt).bind(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt).bind(booking._doc.updatedAt)
    }
}

const transformEvent = event => {
    return{
        ...event._doc,
        date: dateToString(event._doc.date).bind(event._doc.date)
    }
}

const transformUser = user => {
    return{
        ...user._doc,
        password: null
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
exports.transformUser = transformUser;