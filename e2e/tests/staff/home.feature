@staff @home
Feature: Staff Home Page

  Background:
    Given the staff opens the home page

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load home page successfully
      Then the staff home page is displayed
      And the URL contains "/cofolio/staff"
      And the page title is "Cofolio"
      
  Rule: Footer

    @high @footer
    Scenario: Staff can see the footer
      Then the footer is visible
      
  Rule: Profile Section

    Background:
      Given the staff profile overview widget is visible

    @high @profile
    Scenario: Staff can see profile section
      Then the staff profile banner is visible
      And the staff profile picture is visible
      And the staff name is visible

  Rule: Navigation

    @high @navigation @desktop
    Scenario: Main navigation is fully visible on desktop
      Then the staff main navigation menu is visible
      And the staff HOME link is visible
      And the staff ACTIVITIES link is visible

    @high @navigation @desktop
    Scenario: Staff can navigate to activities pages
      When the user click on the ACTIVITIES link
      Then the page navigates to activities page

  Rule: Logout

    @high @logout
    Scenario: Staff can see logout action
      When the staff opens the profile dropdown
      Then the staff logout action have correct label

    @high @logout
    Scenario: Staff sees logout confirmation modal
      When the staff opens the profile dropdown
      And the staff clicks on the logout action
      Then the staff logout confirmation modal is visible