var app = new Vue({
  el: "#vue-app-wrapper",

  data: {
    isActive: true,

    routes: [],
    new_from_location: "",
    new_start_mileage: "",
    new_to_location: "",
    new_end_mileage: "",
  },

  methods: {
    displayForm: function () {
      // on load of the DOM :
      // set loginForm block to isActive: false,
      // set landingContainer to isActive: true,
      // set createAccountForm to isActive: false,
      // on click of sign in button :
      // set loginForm block to isActive: true,
      // set landingContainer to isActive: false,
      // set createAccountForm to isActive: false,
      // onclick of sign UP button :
      // set loginForm block to isActive: false,
      // set landingContainer to isActive: false,
      // set createAccountForm to isActive: true,
    },
    submitForm: function () {},

    //Untested.
    getRoutes: function () {
      fetch(`${url}/routes`).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          app.todos = data;
        });
      });
    },
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

  created: {},

  computed: {},
});
