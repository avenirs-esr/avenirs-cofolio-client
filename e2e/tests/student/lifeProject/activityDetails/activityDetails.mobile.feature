@activity-details @mobile @dataset-full
Feature: Student Project Activity Detail Page (Mobile)

  Background:
    Given the student opens the project activities page
    Given the page is displayed on mobile viewport
    When the student open activity library tab
    And the student clicks the first library activity card

  Rule: Activity Detail - Responsive behavior

    @medium @responsive @activity-details
    Scenario: No horizontal scrolling on activity detail page
      Then no horizontal scrolling is required

    @medium @responsive @activity-details @activity-content
    Scenario: Student can see activity detail content on mobile
      Then the activity detail title is visible
      And the activity title is visible
      And the activity description is visible
      And the activity execution period list is visible