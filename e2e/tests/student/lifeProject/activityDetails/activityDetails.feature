@activity-details @dataset-full
Feature: Student Project Activity Detail Page

  Background:
    Given the student opens the project activities page
    When the student open activity library tab
    And the student clicks the first library activity card

  Rule: Page Load

    @high @activity-details
    Scenario: Student can load activity detail page
      Then the URL contains "/cofolio/student/project/activities/"

  Rule: Activity Detail

    Background:
      And the project activity details are loaded

    @high @activity-details @activity-title
    Scenario: Student can see the activity detail title
      Then the activity detail title is visible

    @high @activity-details @activity-dropdown
    Scenario: Student can see the activity dropdown
      Then the activity dropdown is visible

    @high @activity-details @activity-period
    Scenario: Student can see the activity start and end dates
      Then the activity start date is visible
      And the activity end date is visible

    @high @activity-details @activity-content
    Scenario: Student can see the activity title and summary
      Then the activity title is visible
      And the activity summary is visible

    @high @activity-details @activity-execution-period
    Scenario: Student can see the activity execution period list
      Then the activity execution period list is visible

    @high @activity-details @activity-status
    Scenario: Student can see the activity status
      Then the activity status is visible