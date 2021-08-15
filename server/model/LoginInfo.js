var mongoose = require('mongoose');

const loginInfoSchema = new mongoose.Schema({
    address: String,
    pwHash: String
});

const loginInfo = mongoose.model('loginInfo', loginInfoSchema, 'LoginInfo');
module.exports = loginInfo;