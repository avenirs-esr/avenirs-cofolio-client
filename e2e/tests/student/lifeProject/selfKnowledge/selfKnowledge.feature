@self-knowledge
Feature: Student Project Self-Knowledge Main Section Page

  Background:
    Given the student opens the project self knowledge main section page

  Rule: Page Load and Basic Display

    @high
    Scenario: Student can load project self knowledge main section page successfully
      Then the student project self knowledge main section page is displayed
      And the URL contains "/cofolio/student/project/build-project?section=SELF_KNOWLEDGE"
    
    @high @self-knowledge @title
    Scenario: Self-knowledge section title is displayed
      Then the self-knowledge section title is displayed

    @high @profile @self-knowledge
    Scenario: Self-knowledge Profile card displays all student information
      Then the self-knowledge profile card is visible
      And the self-knowledge profile card banner is visible
      And the self-knowledge profile card picture is visible
      And the self-knowledge profile card name is visible
      And the self-knowledge profile card bio is visible

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