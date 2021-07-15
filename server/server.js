// this file contains all connections to server
// res.setHeader("Content-Type","application/json"); converts info to json

const express = require("express");
const { Model } = require("mongoose"); //??????
const { routeSchema, Route } = require("./model");
const { userSchema, User } = require("./model");
const { companySchema, Company } = require("./model");
const cors = require("cors");
const constants = require("./constants");

//HELPER FUNCTIONS
// MODULE EXPORTS HELPER FUNCTION TO CALCULATE AND SET TOTAL MILEAGE
const { setTotalMileageOfRoutes } = require("./server-helper-functions");

// initialize your app/server
const app = express();

app.use(cors());
app.use(express.static("static"));

// tell our app to use json
app.use(express.json({}));

// PASSPORT IMPORTS AND USE
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");


// PASSPORT MIDDLEWARES
app.use(session({
  secret: 'fljadskjvn123bf',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


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

// METHODS
//Get - gets all of the Routes based on role
app.get("/route", (req, res, next) => {

  if (!req.user){
    res.sendStatus(401);
    return;
  }

  console.log("This is the user: ", req.user);

  res.setHeader("Content-Type", "application/json");
  role = "driver"; //THIS LINE IS FOR TESTING PURPOSES AND CAN BE DELETED WHEN CONNECTED TO AUTHORIZATION
  let findQuery = {};

  //Check role if role == admin look at all Queries, don't add filter

  // THIS NEEDS WORK
  if (req.body.role === constants.UserRoles.admin) {
    findQuery = {};
  }

  //if role == driver add that user's id to the filter
  // IF THE USER IS A DRIVER, HE CAN SEE JUST HIS ROUTES
  else if (req.user.role === constants.UserRoles.driver) {
    findQuery = {
      user: req.user._id
    };
  }

  console.log("getting all the routes");
  Route.find(findQuery, function (err, routes) {
    if (err) {
      res.status(500).json({ message: `unable to list routes`, error: err });
      return;
    }
    var calculatedRoutes = setTotalMileageOfRoutes(routes);
    res.status(200).json(calculatedRoutes);
    console.log("Getting Routes Successful");
  });
});

//Gets specific route based on id
app.get("/route/:id", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  role = "driver"; //THIS LINE IS FOR TESTING PURPOSES AND CAN BE DELETED WHEN CONNECTED TO AUTHORIZATION

  console.log("getting specific route:", req.params.id);
  Route.findById(req.params.id, (err, route) => {
    if (err) {
      console.log("there was an error finding route with id");
      res.status(500).json({ message: `unable to find route`, error: err });
    } else if (route === null) {
      res.status(404).json({
        error: `Returns Null`,
        error: err,
      });
      return;
    }
    var total = route.end_mileage - route.start_mileage;

    route = {
      _id: route._id,
      from_location: route.from_location,
      to_location: route.to_location,
      start_mileage: route.start_mileage,
      end_mileage: route.end_mileage,
      total_miles: total,
    };
    res.status(200).json(route);
    console.log("Getting Routes Successful");
  });
});

//post - Creates new route
app.post("/route", function (req, res) {

  // CHECKING IF THEY ARE LOGGED IN
  if (!req.user){
    res.sendStatus(401);
    return;
  }

  res.setHeader("Content-Type", "application/json");
  console.log("Creating a new route");

  let creatingRoute = {
    from_location: req.body.from_location,
    to_location: req.body.to_location || "",
    start_mileage: req.body.start_mileage || 0,
    end_mileage: req.body.end_mileage || 0,
    user: req.user
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

app.delete("/route/:id", (req, res) => {
  res.setHeader("Content-TypeError", "application/json");
  console.log("deleting route with id:", req.params._id);
  Route.findByIdAndDelete(req.params.id, (err, route) => {
    if (err) {
      res.status(500).json({
        message: "unable to find and delete route",
        error: err,
      });
    } else if (route === null) {
      res.status(404).json({
        error: `Returns Null`,
        error: err,
      });
      return;
    }
    res.status(201).json(route);
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
  // ---------CREATING AN ACCOUNT FOR A COMPANY
  if (req.body.companyName){
    console.log("creating an account for a company");
    User.findOne({email: req.body.companyEmail}).then(function(user){
      if (user){
        res.status(422).json({
          error: "Email already registered"
        });
      }
      else{
        var newCompany = new Company({
          company_name: req.body.companyName,
          company_email: req.body.companyEmail
        })
        var companyPlainPassword = req.body.companyPlainPassword;
        // CHECK WITH JAZE
        newCompany.setEncryptedPassword(companyPlainPassword, function(){
          newCompany.save().then(function(companyCreated){
            var user = new User({
              email: companyCreated.company_email,
              encrypted_password: companyCreated.encrypted_password,
              role: "admin",
              company: companyCreated
            })
            user.save().then(function(){
              res.status(201).json(user);
            }).catch(function(err){
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
            })
          })
        })
      }
    })
  }
  else{
    // -------CREATING AN ACCOUNT FOR AN EMPLOYEE DRIVER---------------
    // CHECKING IF THE COMPANY IS LOGGED IN
    if (!req.user && !req.user.role == "admin"){
      res.sendStatus(401);
      return;
    }

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
          role: "driver",
          company: req.user.company
        });
        // storing the plain password
        var plainPassword = req.body.plainPassword;
        user.setEncryptedPassword(plainPassword, function () {
          user.save().then(function () {
              res.status(201).json(user);
            }).catch(function (err) {
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
  }
});



//PASSPORT

// 1. Local Strategy
passport.use(
  new passportLocal.Strategy(
    {
      //some configs
      usernameField: "email",
      passwordField: "plainPassword",
    },
    function (email, plainPassword, done) {
      console.log("local got hit");
      User.findOne({ email: email })
        .then(function (user) {
          console.log("this is the user: ", user);
          if (!user) {
            done(null, false, { message: "No user with that email" });
            return;
          }
          // verify that the user exists
          user.verifyPassword(plainPassword, function (result) {
            if (result) {
              done(null, user);
            } else {
              done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch(function (err) {
          done(err);
        });
    }
  )
);
// 2. SERIALIZED USER TO SESSION
passport.serializeUser(function (user, done) {
  done(null, user._id);
});


//3. DESERIALIZED USER FROM SESSION
passport.deserializeUser(function (userId, done) {
  User.findOne({ _id: userId })
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

// 4. Authenticate endpoint
app.post("/session", passport.authenticate("local"), function (req, res) {
  // this function is called if authentication succeeds.
  console.log("session got hit");
  res.sendStatus(201);
});

// 5. ME ENDPOINT
app.get("/session", function (req, res) {
  if (req.user) {
    // send user details
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
});

module.exports = app; // export app variables
