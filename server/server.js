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
  role = "driver"; //THIS LINE IS FOR TESTING PURPOSES AND CAN BE DELETED WHEN CONNECTED TO AUTHORIZATION
  let findQuery = {};

  //Check role if role == admin look at all Queries, don't add filter
  if (req.body.role === constants.UserRoles.admin) {
    findQuery = {};
  }
  //if role == driver add that user's id to the filter
  else if (req.body.role === constants.UserRoles.driver) {
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
    console.log("These are the routes: ", routes);
    for (route in routes) {
      console.log("These are the routes", routes[route]);
      var total = routes[route].end_mileage - routes[route].start_mileage;
      routes[route] = {
        _id: routes[route]._id,
        from_location: routes[route].from_location,
        to_location: routes[route].to_location,
        start_mileage: routes[route].start_mileage,
        end_mileage: routes[route].end_mileage,
        total_miles: total,
      };
    }
    res.status(200).json(routes);
    console.log("Getting Routes Successful");
  });
});
/*
//Gets specific route based on id
app.get("/route/:id/", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  role = "driver"; //THIS LINE IS FOR TESTING PURPOSES AND CAN BE DELETED WHEN CONNECTED TO AUTHORIZATION
  let findQuery = {};

  //Check role if role == admin look at all Queries, don't add filter
  if (req.body.role === constants.UserRoles.admin) {
    findQuery = {};
  }
  //if role == driver add that user's id to the filter
  else if (req.body.role === constants.UserRoles.driver) {
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
});*/

//post - Creates new route
app.post("/route", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log("Creating a new route");

  let creatingRoute = {
    from_location: req.body.from_location,
    to_location: req.body.to_location || "",
    start_mileage: req.body.start_mileage || 0,
    end_mileage: req.body.end_mileage || 0,
    //???user id?
  };
  Route.create(creatingRoute, (err, route) => {
    if (err) {
      console.log("unable to create todo");
      res.status(500).json({
        message: "unable to create route",
        error: err,
      });
      return;
    }

    res.status(201).json(route);
    console.log("successfully created route");
  });
});

app.patch("/route/:id", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(
    `Patching route with updates from:${req.params.id} with body`,
    req.body
  );
  let updateRoute = {};
  if (req.body.from_location != null && req.body.from_location != undefined) {
    updateRoute.from_location = req.body.from_location;
  }
  if (req.body.to_location != null && req.body.to_location != undefined) {
    updateRoute.to_location = req.body.to_location;
  }
  if (req.body.start_mileage != null && req.body.start_mileage != undefined) {
    updateRoute.start_mileage = req.body.start_mileage;
  }
  if (req.body.end_mileage != null && req.body.end_mileage != undefined) {
    updateRoute.end_mileage = req.body.end_mileage;
  }

  Route.updateOne(
    { _id: req.params.id },
    { $set: updateRoute },
    function (err, updateResult) {
      if (err) {
        console.log("unable to patch", err);
        res.status(500).json({
          message: "unable to patch todo",
          error: err,
        });
      } else if (updateResult.n === 0) {
        console.log("");
        res.status(404).json({
          error: "Returns Null",
          error: err,
        });
        return;
      }
      res.status(200).json(updateRoute);
    }
  );
});

// AUTHENTICATION

// CREATING NEW USERS
app.post("/user", function (req, res) {
  // CHECKING IF THE EMAIL IS UNIQUE
  User.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      res.status(422).json({
        error: "Email Already registered",
      });
    } else {
      // CREATING THE NEW USER MODEL
      var user = new User({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
      });
      // storing the plain password
      var plainPassword = req.body.plainPassword;
      user.setEncryptedPassword(plainPassword, function () {
        user
          .save()
          .then(function () {
            res.status(201).json(user);
          })
          .catch(function (err) {
            if (err.errors) {
              // MONGOOSE VALIDATION FAILURE
              var messages = {};
              for (var e in err.errors) {
                messages[e] = err.errors[e].message;
              }
              res.status(422).json(messages);
            } else {
              // worse failure
              res.sendStatus(500);
            }
          });
      });
    }
  });
});

module.exports = app; // export app variables
