@self-knowledge
Feature: Student Project Self-Knowledge Main Section Page

  Background:
    Given the student opens the project self knowledge main section page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load project self knowledge main section page successfully
      Then the student project self knowledge main section page is displayed
      And the URL contains "/cofolio/student/project/trajectories?section=SELF_KNOWLEDGE"

  Rule: Update Profile Drawer

    @high @update-profile-drawer
    Scenario: Student can open the update profile drawer
      When the user clicks the display update profile drawer button
      Then the update profile drawer is opened in the project self knowledge main section page

    @high @update-profile-drawer
    Scenario: Student can close the update profile drawer
      When the user clicks the display update profile drawer button
      And the user clicks the exit button on the update profile drawer
      Then the update profile drawer is closed in the project self knowledge main section page