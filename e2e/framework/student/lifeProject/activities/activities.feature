@activities
Feature: Student Project Activities Page

  Background:
    Given the student opens the project activities page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load project activities page successfully
      Then the student project activities page is displayed
      And the URL contains "/cofolio/student/project/activities"

  Rule: Page Title

    Background:
      Given the page title is visible

    @high @page-title
    Scenario: Student can see the page title
      Then the page title is correct
      And the show breadcrumb button is hidden
      And the breadcrumb items are visible
      And the breadcrumb is correct
      And the back button is correct
      And the all activities tab new activities paginator card is correct
      And the all activities tab all activities section is correct

    @high @page-title
    Scenario: Student can interact with the page title back button
      When the user clicks the back button
      Then the page navigates to home page

    @high @page-title
    Scenario: Student can interact with the page title first breadcrumb link
      When the user clicks the first breadcrumb link
      Then the page navigates to home page

  Rule: All activities tab

    Background:
      Given the all activities tab is visible

    @high @all-activities-tab
    Scenario: Student can see the header card
      Then the all activities tab header description is correct
      And the all activities tab see all button is correct