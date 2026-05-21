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

  Rule: Side Navigation - Content tab

    @high @side-navigation
    Scenario: Staff can see the side navigation menu with content sections
      Then the side navigation menu is visible
      And the side navigation has TITLE section
      And the side navigation has INSTRUCTIONS section
      And the side navigation has CONTEXT section
      And the side navigation has DOCUMENTS section
      And the side navigation has SCHEDULE section
      And the side navigation has MODALITIES section
      And the side navigation has THEMATIC section

    @high @side-navigation
    Scenario: Staff can navigate to TITLE section via side navigation
      When the user clicks on the side navigation "TITLE" item
      Then the URL contains "#TITLE"

    @high @side-navigation
    Scenario: Staff can navigate to INSTRUCTIONS section via side navigation
      When the user clicks on the side navigation "INSTRUCTIONS" item
      Then the URL contains "#INSTRUCTIONS"

    @high @side-navigation
    Scenario: Staff can navigate to CONTEXT section via side navigation
      When the user clicks on the side navigation "CONTEXT" item
      Then the URL contains "#CONTEXT"

    @high @side-navigation
    Scenario: Staff can navigate to DOCUMENTS section via side navigation
      When the user clicks on the side navigation "DOCUMENTS" item
      Then the URL contains "#DOCUMENTS"

    @high @side-navigation
    Scenario: Staff can navigate to SCHEDULE section via side navigation
      When the user clicks on the side navigation "SCHEDULE" item
      Then the URL contains "#SCHEDULE"

    @high @side-navigation
    Scenario: Staff can navigate to MODALITIES section via side navigation
      When the user clicks on the side navigation "MODALITIES" item
      Then the URL contains "#MODALITIES"

    @high @side-navigation
    Scenario: Staff can navigate to THEMATIC section via side navigation
      When the user clicks on the side navigation "THEMATIC" item
      Then the URL contains "#THEMATIC"

  Rule: Side Navigation - Publication tab

    Background:
      Given the staff navigates to the publication tab

    @high @side-navigation
    Scenario: Staff can see the side navigation menu with publication sections
      Then the side navigation has "ACTIVITY_TITLE" publication section
      And the side navigation has "TARGET_GROUPS" publication section
      And the side navigation has "IMAGE" publication section
      And the side navigation has "SUMMARY" publication section
      And the side navigation has "CONTEXT" publication section

    @high @side-navigation
    Scenario: Staff can navigate to ACTIVITY_TITLE section via side navigation
      When the user clicks on the side navigation "ACTIVITY_TITLE" publication item
      Then the URL contains "#ACTIVITY_TITLE"

    @high @side-navigation
    Scenario: Staff can navigate to TARGET_GROUPS section via side navigation
      When the user clicks on the side navigation "TARGET_GROUPS" publication item
      Then the URL contains "#TARGET_GROUPS"

    @high @side-navigation
    Scenario: Staff can navigate to IMAGE section via side navigation
      When the user clicks on the side navigation "IMAGE" publication item
      Then the URL contains "#IMAGE"

    @high @side-navigation
    Scenario: Staff can navigate to SUMMARY section via side navigation
      When the user clicks on the side navigation "SUMMARY" publication item
      Then the URL contains "#SUMMARY"

    @high @side-navigation
    Scenario: Staff can navigate to CONTEXT section via side navigation
      When the user clicks on the side navigation "CONTEXT" publication item
      Then the URL contains "#CONTEXT"