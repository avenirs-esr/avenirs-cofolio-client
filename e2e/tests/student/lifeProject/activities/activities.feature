@activities
Feature: Student Project Activities Page

  Background:
    Given the student opens the project activities page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load project activities page successfully
      Then the student project activities page is displayed
      And the URL contains "/cofolio/student/project/activities"

  Rule: Page Title

    Background:
      Given the page title is visible

    @high @page-title
    Scenario: Student can see the page title
      Then the page title is correct
      And the show breadcrumb button is hidden
      And the breadcrumb items are visible
      And the breadcrumb is correct
      And the back button is correct
      And the all activities tab new activities paginator card is correct
      And the all activities tab all activities section is correct

    @high @page-title
    Scenario: Student can interact with the page title back button
      When the user clicks the back button
      Then the page navigates to home page

    @high @page-title
    Scenario: Student can interact with the page title first breadcrumb link
      When the user clicks the first breadcrumb link
      Then the page navigates to home page

  Rule: All activities tab

    Background:
      Given the all activities tab is visible

    @high @all-activities-tab @all-activities-tab-header
    Scenario: Student can see the header card
      Then the all activities tab header description is correct
      And the all activities tab see all button is correct
      
  @dataset-empty
  Rule: Library activities tab - user has no library activities

    Background:
      When the student open activity library tab

    @high @library-activity-tab @library-activity-empty-state @dataset-empty
    Scenario: Student sees empty state when no activities are registered
      Then the activity library empty state is visible
      And the activity library empty state message is correct
      And the activity library pagination is not visible

  @dataset-full
  Rule: Library activities tab

    Background:
      When the student open activity library tab

    @high @library-activity-tab @library-activity-tab-title
    Scenario: Student can see library activity tab
      Then the library activity tab is visible
      And library activity tab title is correct with a count

    @high @library-activity-tab @library-activity-content
    Scenario: Student can see library activity elements
      Then the list of activity library elements is visible
      And the first page of activity library elements contain 4 elements

    @high @library-activity-tab @library-activity-card
    Scenario: Student can see the first activity card information
      Then the first activity card title is visible
      And the first activity card thematic badge is valid
      And the first activity card status badge is valid
      And the first activity card description is visible

      
    @high @library-activity-tab @library-activity-card
    Scenario: Student can see the last activity card information
      When the user navigates to page 2 using bottom pagination
      Then the last activity card title is visible
      And the last activity card status badge is "COMPLETED"

    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to the second page using bottom pagination
      Then the bottom pagination shows 2 pages
      When the user navigates to page 2 using bottom pagination
      Then the activity library page contains elements
      And the bottom pagination next button is disabled

    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to the next page using top pagination
      And the user navigates to next page using top pagination
      Then the activity library page contains elements
      And the top pagination next button is disabled