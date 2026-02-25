@activities
Feature: Student Project Activities Catalog Page

  Background:
    Given the student opens the project activities catalog page

  Rule: Activities Navigation - Mobile

    Background:
      Given the student project activities catalog page is displayed on mobile viewport

    @high @navigation @responsive
    Scenario: Student can see the activities select navigation
      Then the activities select navigation is visible
      And activities select navigation has thematics

    @high @navigation @responsive
    Scenario: Student can navigate by selecting an activity from select navigation
      When the user selects the second activity from select navigation
      Then the URL contains the selected activity and thematic