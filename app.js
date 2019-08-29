/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./routes/routes");
const keys = require("./config/keys");

// app config//
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);


// db connection//
mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.log(error);
});
db.once("open", () => {
  // eslint-disable-next-line no-console
  console.log("Connected to the Databse");
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("Server runnning");
});


module.exports = app;
