@kit
Feature: Student Tools Kit View

  Background:
    Given the student opens the tools kit page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load the tools kit page successfully
      Then the student tools kit page is displayed
      And the URL contains "/cofolio/student/tools/kit"

    @high
    Scenario: Student can see the page information
      Then the background image is displayed correctly on the kit page
      And the title is displayed correctly on the kit page
      And the subtitle is displayed correctly on the kit page
      And the consign is displayed correctly on the kit page

    @high @dataset-full
    Scenario: Student can see thei profile card
      Then the profile card is displayed correctly on the kit page