@activities
Feature: Student Project Activities Page

  Background:
    Given the student opens the project activities page

  Rule: Page Title - Responsive behavior

    Background:
      Given the student project activities page is displayed on mobile viewport

    @medium @responsive
    Scenario: Student can see the show breadcrumb button 
      Then the show breadcrumb button is visible
      And the breadcrumb items are hidden

    @medium @responsive
    Scenario: Student can interact with the show breadcrumb button 
      When the user clicks the show breadcrumb button
      Then the show breadcrumb button is hidden
      And the breadcrumb items are visible