@staff @feedbacks @activity-feedbacks @dataset-full
Feature: Staff Activity Feedbacks Page

  Background:
    Given the staff opens the activities page
    When the user clicks on the my workspace tab
    And the user clicks on the more actions button for activity that has feedbacks
    And the user clicks on the navigate to feedbacks option

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load activity feedbacks page successfully
      Then the staff activity feedbacks page is displayed
      And the URL contains "/feedbacks"

  Rule: Status Picker

    @high
    Scenario: The activity feedbacks status picker is visible and contains 4 elements
      Then the activity feedbacks status picker is visible and contains 4 elements

  Rule: Feedbacks Table

    @high
    Scenario: The activity feedbacks table is visible and contains data
      Then the activity feedbacks table is visible and contains at least 1 row

    @high
    Scenario: The activity feedbacks table shows student name received date and iteration columns
      Then the activity feedbacks table shows the student name column
      And the activity feedbacks table shows the received date column
      And the activity feedbacks table shows the iteration column

  Rule: Feedbacks Dashboard

    @high @feedbacks-dashboard
    Scenario: The feedbacks dashboard is visible
      Then the feedbacks dashboard section is visible

    @high @feedbacks-dashboard
    Scenario: The feedbacks dashboard displays new pending and processed cards
      Then the new feedbacks dashboard card is displayed
      And the pending feedbacks dashboard card is displayed
      And the processed feedbacks dashboard card is displayed