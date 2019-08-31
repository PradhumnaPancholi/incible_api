if (process.env.NODE_ENV === "production") {
  module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_KEY: process.env.JWT_KEY,
  };
} else {
  module.exports = {
    MONGO_URI: "mongodb://pradhumna:incible777@ds251877.mlab.com:51877/incible",
    JWT_KEY: "frnijwbrchubgxbzyebxuhbv",
  };
}
