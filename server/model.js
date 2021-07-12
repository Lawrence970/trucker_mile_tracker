// this file is where all the data[types] go
const mongoose = require("mongoose");
const { stringify } = require("querystring");

const routeSchema = mongoose.Schema(
  {
    // this is a schema. it contains all datatypes
    from_location: String,
    to_location: String,
    start_mileage: Number,
    end_mileage: Number,
  },
  { timestamp: true }
);

const userSchema = mongoose.Schema(
  {
    //user_id: ???
    first_name: String,
    last_name: String,
    email: String,
    encrypted_pass: String,
    routes: [routeSchema],
    Category: String,
  },
  { timestamp: true }
);

const Route = mongoose.model("Route", routeSchema);

let store = {};

module.exports = {
  Route,
  store,
};
