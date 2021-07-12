// this file contains all connections to server
// res.setHeader("Content-Type","application/json"); converts info to json

const express = require("express");
const { Model } = require("mongoose"); //??????
const { routeSchema, Route } = require("./model");
const { userSchema, User } = require("./model");
const cors = require("cors");
const constants = require("./constants");

// initialize your app/server
const app = express();

app.use(cors());
app.use(express.static("static"));

// tell our app to use json
app.use(express.json({}));

app.use((req, res, next) => {
  console.log(
    "Time",
    Date.now(),
    "- Method",
    req.method,
    "- Path",
    req.originalUrl,
    "- Body",
    req.body
  );
  next();
});

//Get - gets all of the Routes based on role
app.get("/route", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  role = "admin"; //THIS LINE IS FOR TESTING PURPOSES AND CAN BE DELETED WHEN CONNECTED TO AUTHORIZATION
  let findQuery = {};

  //Check role if role == admin look at all Queries, don't add filter
  if (role === constants.UserRoles.admin) {
    findQuery = {};
  }
  //if role == driver add that user's id to the filter
  else if (role === constants.UserRoles.driver) {
    findQuery = {
      user_id,
    };
  }

  console.log("getting all the routes");
  Route.find(findQuery, function (err, routes) {
    if (err) {
      res.status(500).json({ message: `unable to list routes`, error: err });
      return;
    }
    res.status(200).json(routes);
    console.log("Getting Routes Successful");
  });
});

//Get - gets all routes with the given user

module.exports = app; // export app variables
