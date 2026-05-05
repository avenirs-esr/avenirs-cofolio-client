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

    @high @profile @dataset-full
    Scenario: Student can see profile section with edit profile button
      Then the profile banner is visible
      And the profile picture is visible
      And the student name is visible
      And the student bio is visible
      And edit profile button is displayed

    @high @profile @dataset-empty
    Scenario: Student bio is hidden when no bio available
      Then the profile banner is visible
      And the profile picture is visible
      And the student name is visible
      And the student bio is hidden
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

  Rule: Traces Widget

    Background:
      Given there are traces available

    @high @traces @dataset-full
    Scenario: Traces widget is visible
      Then the last traces widget is visible

    @high @traces @dataset-full
    Scenario: Traces widget displays 3 traces with type, and see all button
      Then 3 trace cards are displayed
      And each trace card shows type (solo/group)
      And the see all traces button is visible

    @high @traces @dataset-full
    Scenario: Trace cards are clickable and navigate to detailed trace page
      When the student clicks a trace card
      Then the page navigates to trace detail page
      And the URL contains "/cofolio/student/trace"

    @medium @traces @dataset-full
    Scenario: See all traces button navigates to traces page
      When the student clicks see all traces button
      Then the page navigates to traces page
      And the URL contains "/cofolio/student/tools/traces"

  Rule: Traces Widget - Empty State

    @high @traces @dataset-empty
    Scenario: Traces widget is hidden when student has no traces
      Then the last traces widget is hidden

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
