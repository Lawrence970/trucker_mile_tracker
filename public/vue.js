var app = new Vue({
  el: '#vue-app-wrapper',


  data: {
    isActive: true,

  },

  
  methods: {
    displayForm: function() {
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
    submitForm: function() {

    }

  },


  created: {

  },

  
  computed: {

  }
})