@staff @activities @edit-national-activity @dataset-full
Feature: Staff Edit National Activity Page

  Background:
    Given the staff opens the activities page
    And the staff navigates to the first activity edit page

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load edit national activity page successfully
      Then the edit national activity page is displayed
      And the URL contains "/cofolio/staff/activities"
      And the URL contains "/edit"

    @high
    Scenario: The edit activity page is displayed
      Then the edit national activity page is displayed
      And the URL contains "/cofolio/staff/activities"
      And the URL contains "/edit"

    @high @tab-navigation
    Scenario: The content tab is active by default
      Then the content tab is active by default

    @high @side-navigation
    Scenario: The side navigation is visible and expanded by default
      Then the side navigation menu is visible
      And the side navigation menu is expanded by default
      And the side navigation menu has content header
      And the side navigation menu has "TITLE" content section
      And the side navigation menu has "THEMATIC" content section
      And the side navigation menu has "INSTRUCTIONS" content section
      And the side navigation menu has "CONTEXT" content section
      And the side navigation menu has "DOCUMENTS" content section
      And the side navigation menu has "SCHEDULE" content section
      And the side navigation menu has "MODALITIES" content section

  Rule: Navigation to the publication tab

    @high @tab-navigation
    Scenario: The staff can switch to the publication tab
      When the staff navigates to the publication tab
      Then the publication tab is active

    @high @side-navigation
    Scenario: The side navigation updates when switching to the publication tab
      When the staff navigates to the publication tab
      Then the side navigation menu has publication header
      And the side navigation menu has "ACTIVITY_TITLE" publication section
      And the side navigation menu has "TARGET_GROUPS" publication section
      And the side navigation menu has "IMAGE" publication section
      And the side navigation menu has "SUMMARY_CONTEXT" publication section

  Rule: Side navigation sub-section interaction

    @high @side-navigation
    Scenario: Clicking a content sub-section highlights it in the side navigation
      When the staff clicks on the content "TITLE" section in the side navigation menu
      Then the content "TITLE" section is active in the side navigation menu

    @high @side-navigation
    Scenario: Clicking a content sub-section updates the URL anchor
      When the staff clicks on the content "TITLE" section in the side navigation menu
      Then the URL contains "#TITLE"

    @high @side-navigation
    Scenario: Clicking another content sub-section updates the active state in the side navigation
      When the staff clicks on the content "TITLE" section in the side navigation menu
      And the staff clicks on the content "THEMATIC" section in the side navigation menu
      Then the content "THEMATIC" section is active in the side navigation menu
      And the content "TITLE" section is not active in the side navigation menu

    @high @side-navigation
    Scenario: Clicking a publication sub-section highlights it in the side navigation
      When the staff navigates to the publication tab
      And the staff clicks on the publication "SUMMARY_CONTEXT" section in the side navigation menu
      Then the publication "SUMMARY_CONTEXT" section is active in the side navigation menu

    @high @side-navigation
    Scenario: Clicking a publication sub-section updates the URL anchor
      When the staff navigates to the publication tab
      And the staff clicks on the publication "SUMMARY_CONTEXT" section in the side navigation menu
      Then the URL contains "#SUMMARY_CONTEXT"

    @high @side-navigation
    Scenario: Clicking another publication sub-section updates the active state in the side navigation
      When the staff navigates to the publication tab
      And the staff clicks on the publication "ACTIVITY_TITLE" section in the side navigation menu
      And the staff clicks on the publication "IMAGE" section in the side navigation menu
      Then the publication "IMAGE" section is active in the side navigation menu
      And the publication "ACTIVITY_TITLE" section is not active in the side navigation menu

  Rule: Side navigation collapse

    @high @side-navigation
    Scenario: The staff can collapse the side navigation
      When the staff collapses the side navigation menu
      Then the side navigation menu is collapsed

  Rule: Content tab elements
  
    @high
    Scenario: The reflection parameter is visible in the content tab
      Then the reflection parameter is visible
      
    @high
    Scenario: The trace association parameter is visible in the content tab
      Then the trace association parameter is visible
      
    @high
    Scenario: the consign section is collapsed by default in the content tab
      Then the consign section is collapsed by default
    