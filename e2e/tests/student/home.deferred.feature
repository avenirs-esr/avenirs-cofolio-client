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
  
  Rule: Navigation
    
    @medium @navigation @desktop
    Scenario: Header actions are visible on desktop
      Then the mailbox button is visible
      And the notifications button is visible
 