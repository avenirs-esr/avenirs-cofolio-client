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
    
  Rule: Next events Widget

    Background:
      Given the next events widget is visible

    @high @events @dataset-full
    Scenario: Next events widget displays 3 events
      Then the events widget shows 3 events
      And the see all events button is visible

    @medium @events @dataset-full
    Scenario: See all events button navigates to events page
      When the student clicks see all events button
      Then the page navigates to events page
      And the URL contains "/cofolio/student/events"

  Rule: Resumes Widget

    Background:
      Given the resumes widget is visible

    @high @resumes @dataset-full
    Scenario: Resumes widget displays when resumes exist
      Then the resumes widget shows 3 resumes
      And each resume shows last update date
      And the see all resumes button is visible

    @medium @resumes @dataset-full
    Scenario: See all resumes button navigates to resumes page
      When the student clicks see all resumes button
      Then the page navigates to resumes page
      And the URL contains "/cofolio/student/tools/resumes"

  Rule: Free Pages Widget

    Background:
      Given the free pages widget is visible

    @high @pages @dataset-full
    Scenario: Free pages widget displays 3 pages with last update date and see all button
      Then the pages widget shows 3 pages
      And each page shows last update date
      And the see all pages button is visible

    @medium @pages @dataset-full
    Scenario: See all pages button navigates to pages page
      When the student clicks see all pages button
      Then the page navigates to pages page
      And the URL contains "/cofolio/student/tools/pages"

  Rule: Deliverables Widget

    Background:
      Given the next deliverables widget is visible

    @medium @deliverables @dataset-full
    Scenario: Deliverables widget displays 3 future deliverables with see all button
      Then the deliverables widget shows 3 deliverables
      And the see all deliverables button is visible

    @medium @deliverables @dataset-full
    Scenario: See all deliverables button navigates to deliverables page
      When the student clicks see all deliverables button
      Then the page navigates to deliverables page
      And the URL contains "/cofolio/student/deliverables"

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
 