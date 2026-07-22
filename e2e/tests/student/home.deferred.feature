@home
Feature: Student Home Page - out of MVP features

  Background:
    Given the student opens the home page

  Rule: Profile Section

    Background:
      Given the profile overview widget is visible
      
    @high @profile
    Scenario: Student can see profile section with all buttons
      Then profile action buttons are displayed

  Rule: Navigation
    
    @medium @navigation @desktop
    Scenario: Header actions are visible on desktop
      Then the mailbox button is visible
      And the notifications button is visible
 