@update-trace @dataset-full
Feature: Student Tools Update Trace Page

  Background:
    Given the student opens the tools traces page
    When the student open associated traces tab
    And the student clicks the first associated trace card
    And the trace details page is loaded
    When the student clicks on the trace settings dropdown trigger
    Then the update item in the trace settings dropdown is visible
    When the student clicks on the update item in the trace settings dropdown

  Rule: Page Load

    @high @update-trace
    Scenario: Student can load trace detail page
      Then the URL contains "/cofolio/student/tools/update-trace/"

  Rule: Update Trace

    Background:
      And the update trace page is loaded

    @high @trace-details
    Scenario: Student can see the author type radio buttons
      Then the author type is visible and contains 3 radio buttons