const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            autopopulate: true
        }
    ]
});

userSchema.plugin(autopopulate);

module.exports = mongoose.model('User', userSchema);