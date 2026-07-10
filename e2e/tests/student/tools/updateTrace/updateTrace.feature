@update-trace @dataset-full
Feature: Student Tools Update Trace Page

  Background:
    Given the student opens the tools traces page
    When the student open associated traces tab
    And the student clicks the trace with locked associations
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

  Rule: Update Trace Tabs

    Background:
      And the update trace page is loaded

    @high @update-trace
    Scenario: Student sees the "Ma trace" tab selected by default
      Then the update trace details tab is visible and active
      And the update trace associations tab is visible
      
    @high @update-trace
    Scenario: Student can see the trace valorization toggle
      Then the trace valorization toggle is visible

    @high @update-trace @dataset-full
    Scenario: Student can navigate to the associations tab
      When the student clicks on the update trace associations tab
      Then the trace associations are visible in the update view

  Rule: Save with locked associations

    Background:
      And the update trace page is loaded

    @high @update-trace @dataset-full
    Scenario: Student sees a confirmation modal when saving a trace with locked associations
      When the student clicks the save trace button
      Then the confirm update trace modal is visible
      And the confirm update trace modal title and subtitle are visible