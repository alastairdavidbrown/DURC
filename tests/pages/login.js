var Page = require('moonraker').Page;

module.exports = new Page({

  url: {
    value: '/login'
  },

  txtEmail: {
    get: function() {
      return this.element("input[id='email']");
    }
  },
  txtPassword: {
    get: function() {
      return this.element("input[id='password']");
    }
  },
  btnSearch: {
    get: function() {
      return this.element(".btn-primary");
    }
  },

  searchFor: {
    value: function(query) {
      this.txtEmail.sendKeys(query);
      this.btnSearch.click();
    }
  },

  form: {
    get: function() {
      return this.element(".alert-danger");
    }
  }

});
