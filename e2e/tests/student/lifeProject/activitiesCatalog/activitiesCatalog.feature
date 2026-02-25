@activities
Feature: Student Project Activities Catalog Page

  Background:
    Given the student opens the project activities catalog page
    
  Rule: Activities Navigation - Desktop

    @high @navigation
    Scenario: Student can see the activities side navigation
      Then the activities side navigation is visible
      And activities side navigation has thematics

    @high @navigation
    Scenario: Student can navigate by selecting an activity from side navigation
      When the user selects the second activity of the first thematic from side navigation
      Then the URL contains the selected activity and thematic