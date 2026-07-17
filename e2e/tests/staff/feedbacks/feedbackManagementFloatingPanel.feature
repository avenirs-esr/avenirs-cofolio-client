@staff @feedbacks @write-feedback @dataset-full
Feature: Staff feedback management

  Background:
    Given the staff opens the feedbacks page

  Rule: feedback management floating panel
    Background:
      When the staff clicks the access feedback button for an activity with associated elements

    @high
    Scenario: Staff can see the write feedback floating panel
      Then the writing feedback floating panel is visible

    @high
    Scenario: Staff can exmpand the write feedback floating panel to see the write feedback form
      When the staff expands the writing feedback floating panel
      Then the writing feedback floating panel is expanded
      Then the writing feedback tab is visible in the expanded floating panel

    @medium
    Scenario: Staff can collapse the panel by cancelling the form
      When the staff expands the writing feedback floating panel
      Then the writing feedback floating panel is expanded
      Then the writing feedback tab is visible in the expanded floating panel
      When the staff cancels writing feedback in the floating panel
      Then the writing feedback floating panel is collapsed

  Rule: History Tab

    Background:
      When the staff clicks the access feedback button for an activity with associated elements
      And the staff expands the writing feedback floating panel
      And the staff clicks on the history tab

    @high
    Scenario: The feedbacks history tab is visible
      Then the feedbacks history tab is visible

    @high
    Scenario: The feedbacks history tab contains at least one feedback history card
      Then the feedbacks history tab contains at least one feedback history card

    @high
    Scenario: The first feedback history card is collapsed by default
      Then the first feedback history card is collapsed

    @high
    Scenario: The first feedback history card collapsed state is visible
      Then the first feedback history card collapsed state is visible

    @high
    Scenario: The first feedback history card expanded state is visible
      When the staff expands the first feedback history card
      Then the first feedback history card expanded state is visible

    @medium
    Scenario: Feedbacks are displayed in anti-chronological order
      Then the feedbacks history tab displays feedbacks in anti-chronological order

  Rule: Write feedback tab when feedback is in process
    Background:
      When the staff clicks access button of the first feedback with "IN_PROCESS" status
      And the staff expands the writing feedback floating panel

    @high
    Scenario: The write feedback tab is visible and enabled
      Then the writing feedback tab is visible in the expanded floating panel

    @high
    Scenario: The feedback form field is enabled
      Then the feedback form field is enabled

    @high
    Scenario: The send and cancel buttons are enabled
      Then the write feedback send button is enabled
      And the write feedback cancel button is enabled

  Rule: Write feedback tab when feedback is submitted
    Background:
      When the staff clicks access button of the first feedback with "SUBMITTED" status
      And the staff expands the writing feedback floating panel

    @high
    Scenario: The feedback form field is disabled
      Then the feedback form field is disabled

    @high
    Scenario: The send button is disabled
      Then the write feedback send button is disabled
      And the write feedback cancel button is enabled