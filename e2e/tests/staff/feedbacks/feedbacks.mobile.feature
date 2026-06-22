@staff @feedbacks @dataset-full @mobile
Feature: Staff Feedbacks Page - Mobile

  Background:
    Given the staff opens the feedbacks page
    And the page is displayed on mobile viewport

  Rule: Mobile Display

    @medium @responsive
    Scenario: Staff can see the feedbacks page on mobile
      Then the page title is visible
      And the feedback status picker is visible and contains 4 elements
      