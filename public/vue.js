var app = new Vue({
  el: '#vue-app-wrapper',


  data: {
    page: "landingContainer",

  },

  
  methods: {
    changePageDisplay: function(e) {
      this.page = e;
      
    },
    

  }
})