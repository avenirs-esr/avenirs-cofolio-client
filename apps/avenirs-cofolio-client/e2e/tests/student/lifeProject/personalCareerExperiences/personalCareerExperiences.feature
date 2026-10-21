@personal-career @experiences @dataset-full
Feature: Student Personal Career Experiences Section

  Background:
    Given the student opens the project personal career experiences page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load the project personal career experiences page successfully
      Then the student project personal career experiences page is displayed
      And the URL contains "/cofolio/student/project/personal-career/experiences"

    @high @dataset-full
    Scenario: Student can see the experiences cards
      Then the declared experience cards are visible

  Rule: Experiences information display

    @medium @dataset-full
    Scenario: Student can see the experiences information
      Then the period badge is visible on the first declared experience card

    