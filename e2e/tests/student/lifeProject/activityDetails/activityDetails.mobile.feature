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
      And the activity summary is visible
      And the activity execution period list is visible

    @medium @responsive @activity-details @associate-traces-modal @dataset-full
    Scenario: Student can open associate traces modal on mobile
      When the student open activity library tab
      And the student clicks a library activity card with in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      And the student opens associated elements tab
      And the student opens the associate elements dropdown
      And the student clicks the associate traces dropdown item
      Then the associate traces modal is visible