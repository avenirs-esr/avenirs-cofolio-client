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

  Scenario: The national activity catalog content tab selector is visible
    Then the national activity catalog content tab selector is visible

  Scenario: The national activity catalog preview tab selector is visible
    Then the national activity catalog preview tab selector is visible

  Scenario: The national activity catalog key figures tab selector is visible
    Then the national activity catalog key figures tab selector is visible

  Scenario: The national activity catalog key figures tab selector is labelled
    Then the national activity catalog key figures tab selector is labelled with the key figures title

  Scenario: The activity dashboard section is not rendered before the key figures tab is opened
    Then the activity dashboard section is not visible

  Rule: Catalog preview tab

    Background:
      When the user clicks on the national activity catalog preview tab

    Scenario: The preview tab is displayed
      Then the national activity catalog preview tab is displayed

    Scenario: The activity title is visible in the preview tab
      Then the activity title is visible in the preview tab

    Scenario: The activity banner is visible in the preview tab
      Then the activity banner is visible in the preview tab

    Scenario: The activity thematic is visible in the preview tab
      Then the activity thematic is visible in the preview tab

    Scenario: The activity summary is visible in the preview tab
      Then the activity summary is visible in the preview tab

    Scenario: The recommended completion contexts are visible in the preview tab
      Then the recommended completion contexts are visible in the preview tab

  Rule: Key figures tab

    Background:
      When the user clicks on the national activity catalog key figures tab

    @high @key-figures
    Scenario: The key figures tab becomes the selected tab
      Then the national activity catalog key figures tab is selected

    @high @key-figures
    Scenario: Opening the key figures tab reflects the tab in the URL
      Then the URL contains "tab=KEY_FIGURES"

    @high @key-figures
    Scenario: The activity dashboard section is displayed in the key figures tab
      Then the activity dashboard section is visible

    @high @key-figures
    Scenario: The activity dashboard displays the unique student views card
      Then the unique student views dashboard card is displayed

    @high @key-figures
    Scenario: The activity dashboard displays the enrolled students card
      Then the enrolled students dashboard card is displayed

    @high @key-figures
    Scenario: The activity dashboard displays the unsubscriptions of the last 30 days card
      Then the unsubscriptions of the last 30 days dashboard card is displayed

  Rule: Key figures tab deep link

    Background:
      When the staff reloads the national activity catalog page on the key figures tab

    @medium @key-figures
    Scenario: The key figures tab is restored from the URL
      Then the national activity catalog key figures tab is selected
      And the activity dashboard section is visible


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