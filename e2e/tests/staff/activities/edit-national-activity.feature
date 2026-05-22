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
      And the side navigation has "TITLE" content section
      And the side navigation has "INSTRUCTIONS" content section
      And the side navigation has "CONTEXT" content section
      And the side navigation has "DOCUMENTS" content section
      And the side navigation has "SCHEDULE" content section
      And the side navigation has "MODALITIES" content section
      And the side navigation has "THEMATIC" content section

    @high @side-navigation
    Scenario: Staff can navigate to TITLE section via side navigation
      When the user clicks on the side navigation "TITLE" content item
      Then the URL contains "#TITLE"

    @high @side-navigation
    Scenario: Staff can navigate to INSTRUCTIONS section via side navigation
      When the user clicks on the side navigation "INSTRUCTIONS" content item
      Then the URL contains "#INSTRUCTIONS"

    @high @side-navigation
    Scenario: Staff can navigate to CONTEXT section via side navigation
      When the user clicks on the side navigation "CONTEXT" content item
      Then the URL contains "#CONTEXT"

    @high @side-navigation
    Scenario: Staff can navigate to DOCUMENTS section via side navigation
      When the user clicks on the side navigation "DOCUMENTS" content item
      Then the URL contains "#DOCUMENTS"

    @high @side-navigation
    Scenario: Staff can navigate to SCHEDULE section via side navigation
      When the user clicks on the side navigation "SCHEDULE" content item
      Then the URL contains "#SCHEDULE"

    @high @side-navigation
    Scenario: Staff can navigate to MODALITIES section via side navigation
      When the user clicks on the side navigation "MODALITIES" content item
      Then the URL contains "#MODALITIES"

    @high @side-navigation
    Scenario: Staff can navigate to THEMATIC section via side navigation
      When the user clicks on the side navigation "THEMATIC" content item
      Then the URL contains "#THEMATIC"

  Rule: Side Navigation - Publication tab

    Background:
      Given the staff navigates to the publication tab

    @high @side-navigation
    Scenario: Staff can see the side navigation menu with publication sections
      Then the side navigation has "ACTIVITY_TITLE" publication section
      And the side navigation has "TARGET_GROUPS" publication section
      And the side navigation has "IMAGE" publication section
      And the side navigation has "SUMMARY_CONTEXT" publication section


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
    Scenario: Staff can navigate to SUMMARY_CONTEXT section via side navigation
      When the user clicks on the side navigation "SUMMARY_CONTEXT" publication item
      Then the URL contains "#SUMMARY_CONTEXT"

  Rule: Side Navigation - Content tab sections visibility

    @high @side-navigation
    Scenario: Staff can see the title form field after clicking TITLE content section
      When the user clicks on the side navigation "TITLE" content item
      Then the URL contains "#TITLE"
      And the activity title form field is visible
      