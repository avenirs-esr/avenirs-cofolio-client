@activities
Feature: Student Project Activities Page

  Background:
    Given the student opens the project activities page

  Rule: Page Title - Responsive behavior

    Background:
      Given the page is displayed on mobile viewport
      Then no horizontal scrolling is required

    @medium @responsive
    Scenario: Student can see the show breadcrumb button 
      And the show breadcrumb button is visible
      And the breadcrumb items are hidden

    @medium @responsive
    Scenario: Student can interact with the show breadcrumb button
      When the user clicks the show breadcrumb button
      Then the show breadcrumb button is hidden
      And the breadcrumb items are visible
  
  Rule: Library activities tab - Mobile display

    Background:
      Given the page is displayed on mobile viewport
      When the student open activity library tab

    @medium @responsive @library-activity-tab @dataset-full
    Scenario: Student can see library activity tab on mobile
      And the library activity tab is visible
      And library activity tab title is visible with positive count

    @medium @responsive @library-activity-tab @dataset-full
    Scenario: Activity library card spans full width on mobile
      Then the list of activity library elements is visible
      And the first activity card spans full width

    @medium @responsive @library-activity-tab @library-activity-card @dataset-full
    Scenario: Activity library card hides detail information on mobile
      Then the first activity card description is hidden
      And the first activity card status badge is hidden
      And the first activity card period badge is hidden

    @medium @responsive @library-activity-tab @library-activity-pagination @dataset-full
    Scenario: Student can navigate to the next page using bottom pagination on mobile
      Then the bottom pagination next button is enabled
      When the user navigates to next page using bottom pagination
      Then the activity library page contains elements