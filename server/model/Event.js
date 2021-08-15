var mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    address: String,
    owner: String,
    choices: [String]
});

const events = mongoose.model('event', eventSchema, 'Events');
module.exports = events;