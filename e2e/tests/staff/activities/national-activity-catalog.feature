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