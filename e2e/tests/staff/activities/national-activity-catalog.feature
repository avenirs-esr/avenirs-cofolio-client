@staff @activities @dataset-full
Feature: Staff National Activity Catalog

  Background:
    Given the staff opens the activities page
    And the staff navigates to the first national activity catalog page

  Scenario: The national activity catalog page is displayed
    Then the national activity catalog page is displayed

  Scenario: The national activity content tab is visible
    Then the national activity content tab is visible

  Scenario: The national activity title is visible
    Then the national activity title is visible

  Scenario: The national activity thematic badge is visible
    Then the national activity thematic badge is visible

  Scenario: The national activity consign section is visible
    Then the national activity consign section is visible

  Scenario: The national activity context section is visible
    Then the national activity context section is visible

  Scenario: The edit draft button is visible
    Then the edit draft button is visible

  Scenario: The delete draft button is visible
    Then the delete draft button is visible


  Rule: Edit draft activity

    Scenario: Staff can navigate to edit page from catalog page
      When the user clicks on the edit draft button
      Then the staff is redirected to the edit national activity page

  Rule: Delete draft activity
    
    Background:
      When the user clicks on the delete draft button

    @high @dataset-full @delete-draft-activity
    Scenario: Staff can open the delete confirmation modal from catalog page
      Then the delete draft activity confirmation modal is visible
      And the delete confirmation modal cancel button is visible
      And the delete confirmation modal confirm button is visible

    @high @dataset-full @delete-draft-activity
    Scenario: Staff can close the delete confirmation modal from catalog page
      And the user clicks on the delete confirmation modal cancel button
      Then the delete draft activity confirmation modal is hidden