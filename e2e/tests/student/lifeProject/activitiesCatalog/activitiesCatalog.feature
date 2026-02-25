@activities
Feature: Student Project Activities Catalog Page

  Background:
    Given the student opens the project activities catalog page
    
  Rule: Activities Navigation - Desktop

    @high @navigation
    Scenario: Student can see the activities side navigation
      Then the activities side navigation is visible
      And the activities select navigation is hidden
      And activities side navigation has thematics

    @high @navigation @dataset-full
    Scenario: Student sees all expected thematics in side navigation
      Then all expected thematics are displayed in side navigation

    @high @navigation
    Scenario: Student can navigate by selecting an activity from side navigation
      When the user selects the second activity of the "SELF_KNOWLEDGE" thematic from side navigation
      Then the URL contains the selected activity and "SELF_KNOWLEDGE" thematic

    @high @navigation @dataset-full
    Scenario: Student sees first thematic activities in side navigation
      Then the first thematic in side navigation is "SELF_KNOWLEDGE"
      And the first thematic in side navigation has at least 1 activity
      And the first thematic in side navigation first activity is "Définir ses valeurs"
      And the first thematic in side navigation last activity is "Identifier ses centres d’intérêt"