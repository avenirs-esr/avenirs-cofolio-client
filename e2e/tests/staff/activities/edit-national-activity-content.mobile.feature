@staff @activities @edit-national-activity-content @dataset-full @mobile
Feature: Staff Edit National Activity Content Page - Mobile

  Background:
    Given the staff opens the activities page
    And the staff creates a test national activity
    And the page is displayed on mobile viewport

  Rule: Side Navigation

    @medium @responsive @side-navigation
    Scenario: Staff cannot see the side navigation on mobile
      Then the side navigation menu is not visible