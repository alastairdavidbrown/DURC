var loginPage = require('../pages/login');
var manageContent = require('../pages/manage-content');

exports.define = function (steps) {

  steps.given("I visit the login page", function () {
    loginPage.visit();
  });

  steps.when("I set the email to '$query'", function (query) {
    loginPage.txtEmail.sendKeys(query);
  });

  steps.when("I set the password to '$query'", function (query) {
    loginPage.txtPassword.sendKeys(query);
    loginPage.btnSearch.click();
  });

  steps.then("I should see '$heading' on the manage content page", function (heading) {
    manageContent.form.getText().then(function (text) {
      text.should.equal(heading);
    });
  });

  steps.then("I should see '$heading' on the login page", function (heading) {
    loginPage.form.getText().then(function (text) {
      text.should.equal(heading);
    });
  });


};
