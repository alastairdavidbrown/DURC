var Page = require('moonraker').Page;

module.exports = new Page({

  form: { get: function () { return this.element("h3"); } }

});
