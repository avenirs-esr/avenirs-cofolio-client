@traces @dataset-full
Feature: Student Tools Traces Page

  Background:
    Given the student opens the tools traces page

  Rule: Page Load

    @high @traces
    Scenario: Student can load the tools traces page
      Then the URL contains "/cofolio/student/tools/traces"

  Rule: Add trace drawer

    Background:
      Given the student clicks the add trace button

    @high @traces
    Scenario: Student can open the add trace drawer
      Then the add trace drawer content is visible

    @high @traces
    Scenario: Student can see the declaration accordion
      Then the declaration accordion is visible

    @high @traces
    Scenario: Student can see the author type radio buttons
      When the student clicks the declaration accordion
      Then the trace author type radio set is visible and contains 3 radio buttons

  Rule: Delete traces

    Background:
      When the student clicks on the traces actions dropdown trigger
      And the student clicks on the delete traces item
      Then the delete traces modal is visible

    @high @traces @dataset-full
    Scenario: Student can select multiple traces and open deletion confirmation modal
      When the student selects the first two traces
      Then the delete traces modal confirm button displays selected count
      When the student confirms selected traces deletion
      Then the trace deletion confirmation modal is visible from traces list
      And the trace deletion confirmation modal texts are visible