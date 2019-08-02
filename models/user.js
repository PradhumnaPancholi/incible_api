 const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, require: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    joinedOn: {type: Date, required: true},
    accountType: {type: String, required: true, default: "STANDARD_USER"}, // ONE of STANDARD_USER, ADMIN
    accountStatus: {type: String, required: true}, // ONE of ACTIVE, DELETED, TERMINATED
    lastLoggedIn: {type: Date, required: true}
});

module.exports = mongoose.model('User', userSchema)