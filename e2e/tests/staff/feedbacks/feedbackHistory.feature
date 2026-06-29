@staff @feedbacks @feedback-history @dataset-full
Feature: Staff Feedback History

  Background:
    Given the staff opens the feedbacks page
    When the staff clicks the access feedback button for an activity with associated elements
    And the staff expands the writing feedback floating panel
    And the staff clicks on the history tab

  Rule: History Tab Display

    @high
    Scenario: The feedbacks history tab is visible
      Then the feedbacks history tab is visible

    @high
    Scenario: The feedbacks history tab contains at least one feedback history card
      Then the feedbacks history tab contains at least one feedback history card

  Rule: Feedback History Card Default State

    @high
    Scenario: The first feedback history card is collapsed by default
      Then the first feedback history card is collapsed

    @high
    Scenario: The first feedback history card collapsed state is visible
      Then the first feedback history card collapsed state is visible

  Rule: Feedback History Card Expanded State

    @high
    Scenario: The first feedback history card expanded state is visible
      When the staff expands the first feedback history card
      Then the first feedback history card expanded state is visible

  Rule: Anti-chronological Order

    @medium
    Scenario: Feedbacks are displayed in anti-chronological order
      Then the feedbacks history tab displays feedbacks in anti-chronological order
