// this file is where all the data[types] go
const mongoose = require("mongoose");

const trackerSchema = mongoose.Schema({
  // this is a schema. it contains all datatypes
});

const Tracker = mongoose.model("Tracker", trackerSchema);

let store = {};

module.exports = {
  Tracker,
  store,
};
