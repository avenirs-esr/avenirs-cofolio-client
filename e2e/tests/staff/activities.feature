@staff @activities
Feature: Staff Activities Page

  Background:
    Given the staff opens the activities page

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load activities page successfully
      Then the staff activities page is displayed
      And the URL contains "/cofolio/staff/activities"

  Rule: Display activities table

    @high @dataset-full @activities-table
    Scenario: Staff can see the activities table
      Then the my workspace table is visible and contains data

  Rule: Activity creation

    Background:
    Given the create activity button is visible
    
    @high @creation
    Scenario: Staff can open and close the activity draft creation modal
      When the user clicks on the create activity button
      Then the activity draft creation modal is visible
      When the user clicks on the activity draft creation modal cancel button
      Then the activity draft creation modal is hidden

    @high @creation
    Scenario: Staff can see the title form field
      When the user clicks on the create activity button
      Then the activity draft creation modal is visible
      And the title form field is visible