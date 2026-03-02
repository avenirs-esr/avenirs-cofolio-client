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

    @high @navigation @dataset-full
    Scenario: Student can navigate to the previous activity
      When the user selects the first activity of the "SELF_KNOWLEDGE" thematic from side navigation
      And the user clicks on the previous activity button
      Then the URL does not contain the "SELF_KNOWLEDGE" thematic

    @high @navigation @dataset-full
    Scenario: Student can navigate to the next activity
      When the user selects the last activity of the "SELF_KNOWLEDGE" thematic from side navigation
      And the user clicks on the next activity button
      Then the URL does not contain the "SELF_KNOWLEDGE" thematic

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

  Rule: Activity preview - Desktop

    @high @preview
    Scenario: Student can see the activity preview
      Then the activity preview is visible
      And the activity preview is correctly displayed
      And the activity preview subscribe button is visible

  Rule: Activity subscription - Desktop

    Background:
      When the user clicks on the activity preview subscribe button

      @high @subsribe
      Scenario: Student can see the subscribe activity modal
        Then the subscribe activity modal is displayed

      @medium @subscribe
      Scenario: Student can see the cancel subscribe modal
        When the user clicks on the activity preview subscribe modal cancel button
        Then the cancel subscribe activity confirm modal is displayed

      @low @subscribe
      Scenario: Student can confirm the cancel subscribe modal
        When the user clicks on the activity preview subscribe modal cancel button and confirms
        Then the cancel subscribe activity confirm modal is hidden
        And the subscribe activity modal is hidden

      @low @subscribe
      Scenario: Student can cancel the cancel subscribe modal
        When the user clicks on the activity preview subscribe modal cancel button and cancels
        Then the cancel subscribe activity confirm modal is hidden
        And the subscribe activity modal is displayed

      @high @subscribe
      Scenario: Student can subscribe to the activity and unsubscribe from it right after
        When the user clicks on the activity preview subscribe modal confirm button
        Then the subscribe activity modal is hidden
        And the activity preview unsubscribe button is visible
        And the activity preview subscribe button is hidden
        When the user clicks on the activity preview unsubscribe button
        Then the unsubscribe activities confirm modal is displayed
        When the user clicks on the activity preview unsubscribe activities confirm modal confirm button
        Then the activity preview unsubscribe activities confirm modal is hidden
        And the activity preview subscribe button is visible
        And the activity preview unsubscribe button is hidden