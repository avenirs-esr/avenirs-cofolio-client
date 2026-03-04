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
      And the activity library pagination is hidden

  @dataset-full
  Rule: Library activities tab

    Background:
      When the student open activity library tab

    @high @library-activity-tab @library-activity-tab-title
    Scenario: Student can see library activity tab
      Then the library activity tab is visible
      And library activity tab title is visible with positive count

    @high @library-activity-tab @library-activity-content
    Scenario: Student can see library activity elements
      Then the list of activity library elements is visible
      And the first page of activity does not exceed the selected page size

    @high @library-activity-tab @library-activity-card
    Scenario: Student can see the first activity card information
      Then the first activity card title is visible
      And the first activity card thematic badge is visible
      And the first activity card status badge is visible
      And the first activity card description is visible

      
    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to next page using bottom pagination
      Then the bottom pagination next button is enabled
      When the user navigates to next page using bottom pagination
      Then the activity library page contains elements
      
    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to the next page using top pagination
      And the user navigates to next page using top pagination
      Then the activity library page contains elements
      And the top pagination next button is disabled

    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to previous page using bottom pagination
      When the user navigates to next page using bottom pagination
      And the user navigates to previous page using bottom pagination
      Then the activity library page contains elements
      And the bottom pagination previous button is disabled
      And the bottom pagination first button is disabled

    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to last page using bottom pagination
      When the user navigates to last page using bottom pagination
      Then the activity library page contains elements
      And the bottom pagination next button is disabled
      And the bottom pagination last button is disabled

    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can navigate to first page using bottom pagination
      When the user navigates to next page using bottom pagination
      And the user navigates to first page using bottom pagination
      Then the activity library page contains elements
      And the bottom pagination previous button is disabled
      And the bottom pagination first button is disabled

    @high @library-activity-tab @library-activity-pagination
    Scenario: Student can change the page size
      When the user changes the page size to 8
      Then the first page of activity contains less than 9 activities

    @high @library-activity-tab @library-activity-unsubscribe @unsubscribe-activity
    Scenario: Student can unsubscribe from a library activity using the more actions menu
      When the user opens the unsubscribe activities modal
      And the user selects the first activity in the unsubscribe modal
      And the user confirms the unsubscription
      And the user confirms the final unsubscription
      Then unsubscription success message is visible