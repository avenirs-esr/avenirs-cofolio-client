@declared-skill-details @dataset-full
Feature: Student Life Project Declared Skill Detail Page

  Background:
    Given the student opens the skills page
    When the student opens the declared skills tab
    And the student clicks the first declared skill

  Rule: Declared skill associations

    Background:
      When the student opens the declared skill associations tab
      Then the declared skill associations are loaded

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can see the trace associations card
      And the trace associations card is visible
      And the trace associations title is defined

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can see trace association items
      When the student expands the trace associations card
      Then the trace association items are not empty
      And each trace association item has a defined title

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can see the activity associations card
      And the activity associations card is visible
      And the activity associations title is defined

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can see activity association items
      When the student expands the activity associations card
      Then the activity association items are not empty
      And each activity association item has a defined title

  Rule: Declared skill association deletion

    Background:
      When the student opens the declared skill associations tab
      Then the declared skill associations are loaded

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can see the delete associations dropdown
      Then the delete associations dropdown is visible

  Rule: Delete associated activities modal

    Background:
      When the student opens the declared skill associations tab
      And the declared skill associations are loaded
      And the student opens the delete associations dropdown
      And the student selects the activities delete option

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can see the delete activities modal content
      Then the delete associations modal is visible
      And the delete associations modal contains items to delete
      And the delete associations modal confirm button is visible
      And the delete associations modal cancel button is visible

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can cancel the delete activities modal
      When the student cancels the delete associations modal
      Then the delete associations modal is hidden

    @high @declared-skill-details @declared-skill-associations @dataset-full
    Scenario: Student can open and cancel the delete confirmation modal
      When the student selects the first activity to delete
      And the student confirms the delete associations modal
      Then the delete associations confirmation modal is visible
      When the student cancels the delete associations confirmation modal
      Then the delete associations confirmation modal is hidden