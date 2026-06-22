@staff @feedbacks @feedbacks @dataset-full
Feature: Staff Feedbacks Page

  Background:
    Given the staff opens the feedbacks page

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load feedbacks page successfully
      Then the staff feedbacks page is displayed
      And the URL contains "/student-feedbacks"

    @high
    Scenario: The page title is visible
      Then the page title is visible

    @high
    Scenario: The feedback status picker is visible and contains 4 elements
      Then the feedback status picker is visible and contains 4 elements

    @high
    Scenario: The feedbacks table is visible and contains at least 2 rows
      Then the feedbacks table is visible and contains at least 2 rows
      