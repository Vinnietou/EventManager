const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: {select: 'email'}
    }
});
eventSchema.plugin(autopopulate);

module.exports = mongoose.model("Event", eventSchema);