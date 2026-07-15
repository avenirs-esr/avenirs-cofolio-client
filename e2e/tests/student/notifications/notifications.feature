@student @notifications @dataset-full
Feature: Student Notifications

  Background:
    Given the student opens the home page
    When the student opens the notifications popover
    And the student has enabled notifications

  Rule: Activity modified notification content

    @high @activity-modified-notification
    Scenario: Student sees the activity modified notification with a single updated section
      Then the activity modified notification with a single updated section is visible
      And the activity modified notification with a single updated section shows the correct content

    @high @activity-modified-notification
    Scenario: Student sees the activity modified notification with multiple updated sections
      Then the activity modified notification with multiple updated sections is visible
      And the activity modified notification with multiple updated sections shows the correct content

  Rule: Navigate to the modified activity from the notification

    @high @activity-modified-notification
    Scenario: Student can access the modified activity from the notification
      When the student clicks on the activity modified notification with a single updated section
      Then the student is redirected to the modified activity details page
