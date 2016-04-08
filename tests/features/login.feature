Feature: Logging In

  Scenario: Successful Login
    Given I visit the login page
    When I set the email to 'aggi@durc'
    When I set the password to 'password'
    Then I should see 'Admin' on the manage content page

  Scenario: UnSuccessful Login
    Given I visit the login page
    When I set the email to 'dontthinnk@thisllwork'
    When I set the password to 'summit'
    Then I should see 'Authentication Failed.' on the login page
