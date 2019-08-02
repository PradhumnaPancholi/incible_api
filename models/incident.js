const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const incidentSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true},
    createdOn: {type: Date, required: false},
    modifiedOn: {type: Date, required: false, default: null},
    priority: {type: Number, required: false, default: 1},
    creator: {type: ObjectId, ref: 'User'},
    narrative: {type: Array, default: null}
})

module.exports = mongoose.model('Incident', incidentSchema)