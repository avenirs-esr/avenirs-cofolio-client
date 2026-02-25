@activities
Feature: Student Project Activities Catalog Page

  Background:
    Given the student opens the project activities catalog page

  Rule: Activities Navigation - Mobile

    Background:
      Given the student project activities catalog page is displayed on mobile viewport

    @high @navigation @responsive
    Scenario: Student can see the activities select navigation
      Then the activities select navigation is visible
      And the activities side navigation is hidden
      And activities select navigation has thematics

    @high @navigation @dataset-full @responsive
    Scenario: Student sees all expected thematics in select navigation
      Then all expected thematics are displayed in select navigation

    @high @navigation @responsive
    Scenario: Student can navigate by selecting an activity from select navigation
      When the user selects the second activity of the "SELF_KNOWLEDGE" thematic from select navigation
      Then the URL contains the selected activity and "SELF_KNOWLEDGE" thematic

    @high @navigation @dataset-full @responsive
    Scenario: Student sees first thematic activities in select navigation
      Then the first thematic in select navigation is "SELF_KNOWLEDGE"
      And the first thematic in select navigation has at least 1 activity
      And the first thematic in select navigation first activity is "Définir ses valeurs"
      And the first thematic in select navigation last activity is "Identifier ses centres d’intérêt"