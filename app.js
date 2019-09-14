/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const keys = require("./src/config/keys");
const userRoutes = require("./src/routes/userRoutes");
const incidentRoutes = require("./src/routes/incidentRoutes");
// for documentation//
const swaggerDocs = require("./docs/swagger.json");

// app config//
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

/* Routes */
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/status", (req, response) => {
  response.send({ status: "Running" });
});

app.use("/user/", userRoutes);
app.use("/incident/", incidentRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
