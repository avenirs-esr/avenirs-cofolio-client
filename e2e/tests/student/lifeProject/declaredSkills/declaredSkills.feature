@declared-skill @dataset-full
Feature: Student Life Project Declared Skills Page

  Background:
    Given the student opens the skills page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load the project skills page successfully
      Then the student skills page is displayed
      And the URL contains "/cofolio/student/project/skills"

    @high @dataset-full
    Scenario: Student can see the declared skills cards
      Then the declared skills are loaded

    @high @dataset-full
    Scenario: Student can see the add declared skill button
      Then the add declared skill button is visible

  Rule: Add a declared skill

    Background:
      When the student clicks the add declared skill button
      Then the add declared skill drawer is visible
      When the student clicks the associate accordion

    @high @declared-skills @add-declared-skills @associate @dataset-full
    Scenario: Student can see the associate elements section
      Then the associate elements drawer section is visible
      Then the associate elements type select is visible

    @high @declared-skills @add-declared-skills @associate @dataset-full
    Scenario: Student can see the associate activities option in the associate elements type select
      Then the associate elements type select is visible
      And the associate elements type select contains activities options

    