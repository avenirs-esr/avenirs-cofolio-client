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

  Rule: My workspace tab - Delete activity

    Background:
      When the user clicks on the my workspace tab
      And the user clicks on the first activity draft more actions button

    @high @dataset-full @delete-draft-activity
    Scenario: Staff can see the delete option from the more actions dropdown
      Then the delete option is visible

    @high @dataset-full @delete-draft-activity
    Scenario: Staff can open the delete confirmation modal from activities list
      When the user clicks on the delete option
      Then the delete draft activity confirmation modal is visible
      And the delete confirmation modal cancel button is visible
      And the delete confirmation modal confirm button is visible

    @high @dataset-full @delete-draft-activity
    Scenario: Staff can close the delete confirmation modal from activities list
      When the user clicks on the delete option
      And the user clicks on the delete confirmation modal cancel button
      Then the delete draft activity confirmation modal is hidden
      
  Rule: My workspace tab - Unpublish activity
  
    Background:
      When the user clicks on the my workspace tab
      And the user clicks on the more actions button for a published activity
  
    @high @dataset-full @unpublish-activity
    Scenario: Staff can see the unpublish option from the more actions dropdown
      Then the unpublish option is visible
  
    @high @dataset-full @unpublish-activity
    Scenario: Staff can open the unpublish confirmation modal from activities list
      When the user clicks on the unpublish option
      Then the unpublish activity confirmation modal is visible
  
    @high @dataset-full @unpublish-activity
    Scenario: Staff can close the unpublish confirmation modal from activities list
      When the user clicks on the unpublish option
      And the user clicks on the unpublish confirmation modal cancel button
      Then the unpublish activity confirmation modal is hidden
  
    @high @dataset-full @unpublish-activity
    Scenario: Staff can unpublish a published activity
      When the user clicks on the unpublish option
      And the user clicks on the unpublish confirmation modal confirm button
      Then the unpublish activity confirmation modal is hidden
      And the activity is unpublished

  Rule: All published activities tab

    Background:
      When the user clicks on the all published activities tab

    @high @dataset-full
    Scenario: Staff can see the all published activities tab content
      Then the all published activities title is visible
      And the all published activities table is visible and contains data
