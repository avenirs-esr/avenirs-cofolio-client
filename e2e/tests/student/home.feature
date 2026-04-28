@home
Feature: Student Home Page

  Background:
    Given the student opens the home page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load home page successfully
      Then the student home page is displayed
      And the URL contains "/cofolio/student"
      And the page title is "Cofolio"
      
  Rule: Profile Section

    Background:
      Given the profile overview widget is visible

    @high @profile
    Scenario: Student can see profile section with edit profile button
      Then the profile banner is visible
      And the profile picture is visible
      And the student name is visible
      And the student bio is visible
      And edit profile button is displayed
      
    @high @profile
    Scenario: Edit profile button opens drawer
      When the student clicks the edit profile button
      Then the update profile drawer is opened

    @medium @profile
    Scenario: Student can close edit profile drawer
      When the student clicks the edit profile button
      And the student closes the drawer
      Then the update profile drawer is closed
      And the profile overview widget is still visible

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

    @high @navigation @desktop
    Scenario: Main navigation is fully visible on desktop
      Then the main navigation menu is visible
      And the HOME link is visible
      And the SUCCESSFUL EDUCATION menu is visible
      And the BUILDING MY LIFE PROJECT menu is visible
      And the MY TOOLS menu is visible

    @high @navigation @desktop
    Scenario: User can navigate to project my activities page
      When the user clicks on the BUILDING MY LIFE PROJECT menu
      Then the PROJECT MY ACTIVITIES link is visible
      When the user click on the PROJECT MY ACTIVITIES link
      Then the page navigates to project my activities page

    @medium @navigation @desktop
    Scenario: Header actions are visible on desktop
      Then the profile button is visible
      And the language switcher is visible
