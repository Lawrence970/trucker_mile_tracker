var url = "http://localhost:8080";

// LOG IN A USER
function verifyUserAccountOnServer(user) {
  return fetch(`${url}/session`, {
    method: "POST",
    body: JSON.stringify(user),
    // credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// GETTING THE USER THAT IS LOGGED IN
function getUser() {
  return fetch(`${url}/session`, {
    credentials: "same-origin",
  });
}

//GETTING ALL THE DRIVERS FOR AN ADMIN (COMPANY)
function getDriversFromServer() {
  return fetch(`${url}/drivers`, {
    credentials: "same-origin",
  });
}

var app = new Vue({
  el: "#vue-app-wrapper",

  data: {
    page: "landingContainer",
    isActive: true,
    type_role: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
    confirm_password: "",
    // Creating a new company account
    new_company_name: "",
    new_company_email: "",
    new_company_password: "",
    new_company_confirm_password: "",
    //validation for signing up company
    signUpCompanyErrors: [],

    //validation for signing up user
    signUpUserErrors: [],

    // LOGIN A USER
    logInEmail: "",
    logInPassword: "",
    // LOGIN USER VALIDATION
    logInUserErrors: [],

    // LOGGED IN USER
    currentUser: {},

    //users: [],

    // DRIVERS OF A COMPANY
    drivers: [],

    routes: [
      {
        from_location: "",
        to_location: "",
        start_mileage: "",
        end_mileage: "",
      },
    ],

    new_from_location: "",
    new_start_mileage: "",
    new_to_location: "",
    new_end_mileage: "",
  },

  components: {},

  methods: {
    changePageDisplay: function (e) {
      e.preventDefault;
      this.page = e;
    },
    submitForm: function () {},

    //Untested.

    addNewUser: function (e) {
      e.preventDefault();
      console.log("type_role is ", this.type_role);
      if (this.type_role === "company") {
        if (this.new_company_password != this.new_company_confirm_password) {
          alert("Passwords don't match");

          return;
        }

        // MAKING SURE ALL THE FIELDS ARE FILLED OUT
        var valid = this.validateNewCompanyInputs;

        if (!valid) {
          console.log("This is the errors array", this.signUpCompanyErrors);
          return;
        }

        var request_body = {
          companyName: this.new_company_name,
          companyEmail: this.new_company_email,
          companyPlainPassword: this.new_company_password,
        };
        console.log("This is the request body", request_body);
      } else if (this.type_role === "user") {
        if (this.password != this.confirm_password) {
          alert("Passwords don't match");
          return;
        }
        //MAKING SURE ALL THE USER FIELDS ARE FILLED OUT
        var valid = this.validateNewUserInputs;

        if (!valid) {
          console.log(
            "This is the errors array for users",
            this.signUpUserErrors
          );
          return;
        }
        var request_body = {
          firstName: this.first_name,
          lastName: this.last_name,
          email: this.email,
          plainPassword: this.password,
        };
        console.log("This is the request body", request_body);
      }

      fetch(`${url}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_body),
      }).then(function (response) {
        response.json().then(function (user) {
          console.log("This is the response of the creating a company", user);
          if (user.error && response.status == 422) {
            alert("Email already registered");
          } else if (response.status == 201) {
            app.currentUser = user;
            app.page = "adminLanding";
          }
        });
      });
    },

    logInUser: function (e) {
      e.preventDefault();
      var valid = this.validateLogInInputs;
      if (!valid) {
        console.log(this.logInUserErrors);
        return;
      }
      var user = {
        email: this.logInEmail,
        plainPassword: this.logInPassword,
      };

      verifyUserAccountOnServer(user).then((response) => {
        console.log("This is the logIn status code: ", response.status);
        if (response.status == 201) {
          this.checkGetUser();
        } else {
          console.log("Error login in");
          this.logInUserErrors.push("Error Login In");
        }
      });
    },

    getRoutes: function () {
      fetch(`${url}/routes`).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          app.routes = data;
        });
      });
    },

    deleteRoutes: function (route) {
      fetch(`${url}/route/` + route, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        app.getRoutes();
      });
    },

    getUsers: function () {
      fetch(`${url}/users`).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          app.users = data;
        });
      });
    },

    deleteUser: function (user) {
      fetch(`${url}/user/` + user, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        app.getUsers();
      });
    },

    addNewRoute: function () {
      var request_body = {
        from_location: this.new_from_location,
        start_mileage: this.new_start_mileage,
        to_location: this.new_start_location,
        end_mileage: this.new_end_location,
      };
      fetch(`${url}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_body),
      }).then(function (response) {
        console.log(request_body);
        if (response.status == 400) {
          response.json().then(function (data) {
            alert(data.msg);
          });
        } else if (response.status == 201) {
          (app.new_from_location = ""),
            (app.new_start_mileage = ""),
            (app.new_to_location = ""),
            (app.new_end_mileage = "");
          app.getRoutes();
        }
      });
    },
    checkGetUser: function () {
      getUser().then((response) => {
        if (response.status == 401) {
          console.log("Not Authorized");
          return;
        }
        response.json().then((user) => {
          console.log("THis is the user who just logged in", user);
          if (user) {
            if (user.role == "admin") {
              this.currentUser = user;
              this.page = "adminLanding";
            } else if (user.role == "driver") {
              this.currentUser = user;
              this.page = "driverLanding";
            }
            console.log("This is the current User: ", this.currentUser);
            return true;
          } else {
            return false;
          }
        });
      });
    },
    // GET ALL DRIVERS METHODS
    goToDisplayAllDrivers: function () {
      this.page = "allDrivers";
      this.loadDrivers();
    },
    loadDrivers: function () {
      getDriversFromServer().then((response) => {
        response.json().then((data) => {
          console.log("This is the data from drivers: ", data);
          this.drivers = data;
        });
      });
    },
    // specific driver clicked
    goToDriver: function (driver) {
      console.log("This is the specific driver clicked: ", driver);
    },
  },
  computed: {
    validateNewCompanyInputs: function () {
      this.signUpCompanyErrors = [];
      if (this.new_company_name.length == 0) {
        this.signUpCompanyErrors.push("Please Enter Company Name");
      }
      if (this.new_company_email.length == 0) {
        this.signUpCompanyErrors.push("Please Enter Company Email");
      }
      if (this.new_company_password.length == 0) {
        this.signUpCompanyErrors.push("Please Enter Company Password");
      }
      if (this.new_company_confirm_password.length == 0) {
        this.signUpCompanyErrors.push("Please Enter Company Confirm Password");
      }
      return this.signUpCompanyErrors == 0;
    },

    validateNewUserInputs: function () {
      this.signUpUserErrors = [];
      if (this.first_name.length == 0) {
        this.signUpUserErrors.push("Please Enter User First Name");
      }
      if (this.last_name.length == 0) {
        this.signUpUserErrors.push("Please Enter User Last Name");
      }
      if (this.email.length == 0) {
        this.signUpUserErrors.push("Please Enter User Email");
      }
      if (this.password.length == 0) {
        this.signUpUserErrors.push("Please Enter User Password");
      }
      if (this.confirm_password.length == 0) {
        this.signUpUserErrors.push("Please Enter User Confirm Password");
      }
      return this.signUpUserErrors == 0;
    },

    validateLogInInputs: function () {
      this.logInUserErrors = [];
      if (this.logInEmail.length == 0) {
        this.logInUserErrors.push("Please Enter an Email");
      }
      if (this.logInPassword == 0) {
        this.logInUserErrors.push("Please Enter a Password");
      }
      return this.logInUserErrors == 0;
    },
  },
  created: function () {
    this.checkGetUser();
  },
});
