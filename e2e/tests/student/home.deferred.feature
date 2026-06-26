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

   Rule: Skills Widget

    Background:
      Given the educational skills widget is visible

    @high @skills @dataset-full
    Scenario: Skills widget displays skills and see all button
      Then the skills widget shows at least one skill
      And each skill card shows status badge
      And the see all skills button is visible

    @high @skills @dataset-full
    Scenario: Skill cards are clickable and navigate to skill detail
      And skill cards are displayed
      When the student clicks a skill card
      Then the page navigates to skill detail page
      And the URL contains "/cofolio/student/skill/"

    @medium @skills @dataset-full
    Scenario: See all skills button navigates to skills page
      When the student clicks see all skills button
      Then the page navigates to skills page
      And the URL contains "/cofolio/student/education/skills"

  Rule: Navigation
    
    @medium @navigation @desktop
    Scenario: Header actions are visible on desktop
      Then the mailbox button is visible
      And the notifications button is visible
 