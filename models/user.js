const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, require: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  joinedOn: { type: Date, required: true },
  accountType: { type: String, required: true },
  accountStatus: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
