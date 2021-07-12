// this file contains all connections to server
// res.setHeader("Content-Type","application/json"); converts info to json

const express = require("express");
const { Model } = require("mongoose"); //??????
const { trackerSchema, Tracker } = require("./model");
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

module.exports = app; // export app variables
