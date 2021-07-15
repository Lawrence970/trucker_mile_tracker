var app = new Vue({
  el: "#vue-app-wrapper",

  data: {},

  methods: {
    getRoutes: function () {
      fetch(`${url}/routes`).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          app.todos = data;
        });
      });
    },
  },

  created: {},

  computed: {},
});
