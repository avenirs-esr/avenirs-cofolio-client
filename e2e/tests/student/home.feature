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
    Scenario: Student can see profile section
      Then the profile banner is visible
      And the profile picture is visible
      And the student name is visible
      And the student bio is visible
      And profile action buttons are displayed

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

  Rule: Next events Widget

    Background:
      Given the next events widget is visible

    @high @events @skip-review @dataset-full
    Scenario: Next events widget displays 3 events
      Then the events widget shows 3 events
      And the see all events button is visible

    @medium @events @skip-review @dataset-full
    Scenario: See all events button navigates to events page
      When the student clicks see all events button
      Then the page navigates to events page
      And the URL contains "/cofolio/student/events"

  Rule: Resumes Widget

    Background:
      Given the resumes widget is visible

    @high @resumes @skip-review @dataset-full
    Scenario: Resumes widget displays when resumes exist
      Then the resumes widget shows 3 resumes
      And each resume shows last update date
      And the see all resumes button is visible

    @medium @resumes @skip-review @dataset-full
    Scenario: See all resumes button navigates to resumes page
      When the student clicks see all resumes button
      Then the page navigates to resumes page
      And the URL contains "/cofolio/student/tools/resumes"

  Rule: Free Pages Widget

    Background:
      Given the free pages widget is visible

    @high @pages @skip-review @dataset-full
    Scenario: Free pages widget displays 3 pages with last update date and see all button
      Then the pages widget shows 3 pages
      And each page shows last update date
      And the see all pages button is visible

    @medium @pages @skip-review @dataset-full
    Scenario: See all pages button navigates to pages page
      When the student clicks see all pages button
      Then the page navigates to pages page
      And the URL contains "/cofolio/student/tools/pages"

  Rule: Skills Widget

    Background:
      Given the educational skills widget is visible

    @high @skills @dataset-full
    Scenario: Skills widget displays 6 skills with 2 courses and see all button
      #Activate it when seeder is fixed -> Then the skills widget shows 2 courses
      Then the skills widget shows 6 skills
      And each skill card shows status badge
      And each skill card shows trace count
      And each skill card shows AMS count
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

  Rule: Deliverables Widget

    Background:
      Given the next deliverables widget is visible

    @medium @deliverables @skip-review @dataset-full
    Scenario: Deliverables widget displays 3 future deliverables with see all button
      Then the deliverables widget shows 3 deliverables
      And the see all deliverables button is visible

    @medium @deliverables @skip-review @dataset-full
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
    Scenario: Traces widget displays 3 traces with skill count, AMS count, type, and see all button
      Then 3 trace cards are displayed
      And each trace card shows skill count
      And each trace card shows AMS count
      And each trace card shows type (solo/group)
      And the see all traces button is visible

    @high @traces @dataset-full
    Scenario: Trace cards are clickable and navigate to traces page
      When the student clicks a trace card
      Then the page navigates to traces page
      And the URL contains "/cofolio/student/tools/traces"

    @medium @traces @dataset-full
    Scenario: See all traces button navigates to traces page
      When the student clicks see all traces button
      Then the page navigates to traces page
      And the URL contains "/cofolio/student/tools/traces"

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
      Then the mailbox button is visible
      And the notifications button is visible
      And the profile button is visible
      And the language switcher is visible
