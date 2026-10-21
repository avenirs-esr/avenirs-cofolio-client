@activity-details @mobile @dataset-full
Feature: Student Project Activity Page (Mobile)

  Background:
    Given the student opens the project activities page
    Given the page is displayed on mobile viewport
    When the student open activity library tab
    And the student clicks the first library activity card

  Rule: Activity - Responsive behavior

    @medium @responsive @activity-details
    Scenario: No horizontal scrolling on activity page
      Then no horizontal scrolling is required

    @medium @responsive @activity-details @activity-content
    Scenario: Student can see activity content on mobile
      Then the activity detail title is visible
      And the activity title is visible
      And the activity details description is visible
      And the activity details recommended completion contexts list is visible
