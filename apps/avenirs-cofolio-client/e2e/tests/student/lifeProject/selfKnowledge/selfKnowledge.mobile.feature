@self-knowledge
Feature: Student Project Self-Knowledge Main Section Page

  Background:
    Given the student opens the project self knowledge main section page

  Rule: Responsive Behavior

    @high @self-knowledge @title
    Scenario: Self-knowledge section title is displayed
      Then the self-knowledge section title is displayed
      
    @high @responsive @self-knowledge @profile
    Scenario: Profile card displays correctly on mobile viewport
      Then the self-knowledge profile card is visible
      And the profile card spans full width

    @medium @responsive @self-knowledge @profile
    Scenario: Profile card content is readable on mobile
      Then all profile content is readable on mobile
  
  Rule: Update Profile Drawer

    @high @update-profile-drawer
    Scenario: Student can open the update profile drawer
      When the user clicks the display update profile drawer button
      Then the update profile drawer is opened in the project self knowledge main section page
      And the update profile drawer card spans full width

    @high @update-profile-drawer
    Scenario: Student can close the update profile drawer
      When the user clicks the display update profile drawer button
      And the user clicks the exit button on the update profile drawer
      Then the update profile drawer is closed in the project self knowledge main section page