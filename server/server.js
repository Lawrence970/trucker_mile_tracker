// this file contains all connections to server
// res.setHeader("Content-Type","application/json"); converts info to json

const express = require("express");
const { Model } = require("mongoose"); //??????
const { routeSchema, Route } = require("./model");
const cors = require("cors");

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

//Get - gets all of the Routes
app.get("/route", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let findQuery = {};
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

module.exports = app; // export app variables
