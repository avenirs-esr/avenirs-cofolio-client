@home @mobile
Feature: Student Home Page (Mobile)

  Background:
    Given the student opens the home page

  Rule: Navigation

    @high @navigation
    Scenario: Mobile menu button is visible on mobile viewport
      Then the mobile menu button is visible

    @high @navigation
    Scenario: Navigation accessible via mobile menu
      Given the mobile menu button is visible
      When the student clicks mobile menu button
      Then the navigation drawer opens
      And all navigation items are visible in drawer

  Rule: Responsive Behavior

    Background:
      Given the page is displayed on mobile viewport

    @medium @responsive
    Scenario: Layout adapts to mobile single-column format
      Then all visible widgets span full width
      And widgets are stacked vertically
      And no horizontal scrolling is required

    @medium @scrolling
    Scenario: Mobile scrolling works smoothly
      When the student scrolls down through the page
      Then all widgets load and display correctly
      And content remains readable during scroll
      And no horizontal scrolling is required
