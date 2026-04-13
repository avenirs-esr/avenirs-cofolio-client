@trace-details @dataset-full
Feature: Student Tools Trace Detail Page

  Background:
    Given the student opens the tools traces page
    When the student open associated traces tab
    And the student clicks the first associated trace card
    And the trace details page is loaded

  Rule: Page Load

    @high @trace-details
    Scenario: Student can load trace detail page
      Then the URL contains "/cofolio/student/trace/"

  Rule: Trace Detail

    Background:
      And the trace details page is loaded

    @high @trace-details
    Scenario: Student can see the trace details
      Then the trace details page is loaded

  Rule: Trace associations

    Background:
      And the trace details page is loaded
      When the student open associations tab
      Then the trace associations are loaded

    @high @trace-details @trace-associations @dataset-full
    Scenario: Student can see the declared skill associations
      When the student clicks on the declared skill associate button
      And the student selects the first skill in the associate skill dropdown
      And the student confirms the skill association
      Then the declared skill associations are visible
      And the skill associations are not empty

    @high @trace-details @trace-associations @dataset-full
    Scenario: Student can see the declared activity associations
      Then the declared activity associations are visible
      And the activity associations are not empty