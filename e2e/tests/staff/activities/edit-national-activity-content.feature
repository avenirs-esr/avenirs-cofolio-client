@staff @activities @edit-national-activity-content @dataset-full
Feature: Staff Edit National Activity Content Page

  Background:
    Given the staff opens the activities page
    And the staff creates a test national activity

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load edit national activity content page successfully
      Then the edit national activity content page is displayed
      And the URL contains "/cofolio/staff/activities"
      And the URL contains "/edit"

  Rule: Page Title and Navigation

    Background:
      Given the page title is visible

    @high @page-title
    Scenario: Staff can see the page title for edit mode
      Then the page title is correct for edit national activity content
      And the breadcrumb items are visible
      And the back button is correct

    @high @page-title @navigation
    Scenario: Staff can interact with the page title back button
      When the user clicks the back button
      Then the page navigates to activities page

    @high @page-title @navigation
    Scenario: Staff can interact with the first breadcrumb link
      When the user clicks the first breadcrumb link
      Then the page navigates to staff home page

  Rule: Activity Content Form Elements

    Background:
      Given the activity content form is visible

    @high @form-elements
    Scenario: Staff can see the title form field
      Then the activity title form field is visible
      And the activity title form field has a label

    @high @form-elements
    Scenario: Staff can see the consign form field
      Then the activity consign form field is visible
      And the activity consign form field has a label

    @high @form-elements
    Scenario: Staff can see the next step button
      Then the next step button is visible
      And the next step button has correct label

  Rule: Side Navigation

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
