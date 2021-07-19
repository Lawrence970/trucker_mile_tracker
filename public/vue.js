var url = "http://localhost:8080";

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
    // Creating a new company account
    new_company_name: "",
    new_company_email: "",
    new_company_password: "",
    new_company_confirm_password: "",

    users: [],

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

  methods: {
    changePageDisplay: function (e) {
      this.page = e;
    },
    submitForm: function () {},

    //Untested.

    addNewUser: function (e) {
      e.preventDefault();
      console.log("This is the type role:", this.type_role);
      if (this.new_company_password != this.new_company_confirm_password) {
        alert("Passwords don't match");

        return;
      } else if ((this.type_role = "company")) {
        console.log("Ready to send the request body");
        var request_body = {
          companyName: this.new_company_name,
          companyEmail: this.new_company_email,
          companyPlainPassword: this.new_company_password,
        };
        console.log("This is the request body", request_body);
      }
      /*
     else if ((this.type_role = "user")) {
        console.log(type_role);
      } else if ((this.type_role = "user")) {
        var request_body = {
          first_name: this.new_first_name,
          last_name: this.new_last_name,
          email: this.new_email,
          role: "driver",
        };
      }*/

      fetch(`${url}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_body),
      }).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          if (data.error && response.status == 422) {
            alert("Email already registered");
          } else if (response.status == 201) {
            //alert("Congratulations, you're signed up!");
          }
        });
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
  },
});
