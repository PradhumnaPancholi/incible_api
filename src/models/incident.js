const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const incidentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  createdOn: { type: Date, required: false },
  modifiedOn: { type: Date, required: false, default: null },
  creator: { type: ObjectId, ref: "User" },
});

module.exports = mongoose.model("Incident", incidentSchema);
