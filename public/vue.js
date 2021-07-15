var app = new Vue({
  el: "#vue-app-wrapper",

  data: {
    page: "landingContainer",

    routes: [],
    new_from_location: "",
    new_start_mileage: "",
    new_to_location: "",
    new_end_mileage: "",
  },

  methods: {
    changePageDisplay: function(e) {
      this.page = e;
      
    },
    submitForm: function() {

    },

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
  },

  created: {},

  computed: {},
});
