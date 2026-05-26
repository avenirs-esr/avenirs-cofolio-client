@staff @activities
Feature: Staff Activities Page

  Background:
    Given the staff opens the activities page

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load activities page successfully
      Then the staff activities page is displayed
      And the URL contains "/cofolio/staff/activities"

    @high @dataset-full
    Scenario: Staff can see the two tabs
      Then the my workspace tab is visible
      And the all published activities tab is visible

  Rule: My workspace tab

    Background:
      When the user clicks on the my workspace tab

    @high @dataset-full
    Scenario: Staff can see the my workspace table
      Then the my workspace table is visible and contains data
    
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
  
  Rule: All published activities tab

    Background:
      When the user clicks on the all published activities tab

    @high @dataset-full
    Scenario: Staff can see the all published activities tab content
      Then the all published activities title is visible
      And the all published activities table is visible and contains data
      