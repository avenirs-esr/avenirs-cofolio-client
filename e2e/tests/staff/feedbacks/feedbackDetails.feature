@staff @feedbacks @feedback-details @dataset-full
Feature: Staff Activity Feedback Details Page

  Background:
    Given the staff opens the feedbacks page
    When the staff clicks the access feedback button for an activity with associated elements

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load activity feedback details page successfully
      Then the staff activity feedback details page is displayed
      And the URL contains "/activity-feedbacks"

    @high
    Scenario: The page title is visible
      Then the page title is visible

  Rule: Student selector

    @high
    Scenario: The student feedback select is visible
      Then the student feedback select is visible

  Rule: Student perspective section

    @high
    Scenario: The student perspective card is visible
      Then the student perspective card is visible

    @high
    Scenario: The student perspective card is expanded by default
      Then the student perspective card is expanded by default

  Rule: Associated elements section

    @high
    Scenario: The feedback associated elements card is visible
      Then the feedback associated elements card is visible

    @high
    Scenario: The feedback associated elements card is expanded by default
      Then the feedback associated elements card is expanded by default

    @high
    Scenario: The feedback associated elements card contains at least one element
      Then the feedback associated elements card contains at least one element   
  
  Rule: Write feedback floating panel

    @high
    Scenario: Staff can see the write feedback floating panel
      Then the writing feedback floating panel is visible

    @high
    Scenario: Staff can exmpand the write feedback floating panel to see the write feedback form
      When the staff expands the writing feedback floating panel
      Then the writing feedback floating panel is expanded
      Then the writing feedback tab is visible in the expanded floating panel

    @medium
    Scenario: Staff can collapse the panel by cancelling the form
      When the staff expands the writing feedback floating panel
      Then the writing feedback floating panel is expanded
      Then the writing feedback tab is visible in the expanded floating panel
      When the staff cancels writing feedback in the floating panel
      Then the writing feedback floating panel is collapsed