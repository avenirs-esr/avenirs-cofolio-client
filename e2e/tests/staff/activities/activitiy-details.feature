@staff @activity-details
Feature: Staff Activity Details Page

  Background:
    Given the staff opens the activities page

  Rule: Published activity details

    Background:
      When the user clicks on the all published activities tab

    @high @dataset-full @edit-published-activity
    Scenario: Staff can open a published activity details from the activities table
      When the user clicks on the first published activity title with enrolled students
      Then the staff published activity details page is displayed

    @high @dataset-full @edit-published-activity
    Scenario: Staff can see the edit button on a published activity details page
      When the user clicks on the first published activity title with enrolled students
      Then the staff published activity details page is displayed
      And the edit published activity button is visible

  Rule: Published activity with file and link

    Background:
      When the user clicks on the all published activities tab
      And the user clicks on the first published activity title with file and link
      Then the staff published activity details page is displayed
      And the national activity content tab is visible

    @high @dataset-full @activity-details @file
    Scenario: Staff can see the activity resource cards for files
      Then the staff sees at least one resource card for a file

    @high @dataset-full @activity-details @link
    Scenario: Staff can see the activity resource cards for links
      Then the staff sees at least one resource card for a link