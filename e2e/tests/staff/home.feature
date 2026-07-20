@staff @home
Feature: Staff Home Page

  Background:
    Given the staff opens the home page

  Rule: Page Load and Basic Display

    @high
    Scenario: Staff can load home page successfully
      Then the staff home page is displayed
      And the URL contains "/cofolio/staff"
      And the page title is "Cofolio"
      
  Rule: Footer

    @high @footer
    Scenario: Staff can see the footer
      Then the footer is visible
      
  Rule: Profile Section

    Background:
      Given the staff profile overview widget is visible

    @high @profile
    Scenario: Staff can see profile section
      Then the staff profile banner is visible
      And the staff profile picture is visible
      And the staff name is visible

  Rule: Navigation

    @high @navigation @desktop
    Scenario: Main navigation is fully visible on desktop
      Then the staff main navigation menu is visible
      And the staff HOME link is visible
      And the staff ACTIVITIES link is visible

    @high @navigation @desktop
    Scenario: Staff can navigate to activities pages
      When the user click on the ACTIVITIES link
      Then the page navigates to activities page

  Rule: Notifications preferences
        Background:
          Given the staff opens the notifications dropdown

          @high @notifications @dataset-full
          Scenario: Notifications dropdown displays title and enabled state by default
            Then the staff notifications dropdown title is displayed
            And the staff notifications toggle is enabled
            And the staff exit button is displayed

          @high @notifications @dataset-full
          Scenario: Staff can disable notifications
            Given the staff activates the notifications toggle
            When the staff deactivates the notifications toggle
            Then the staff notifications toggle is disabled
            And the staff notifications disabled message is displayed

          @medium @notifications @dataset-full
          Scenario: Staff can enable notifications
            Given the staff deactivates the notifications toggle
            When the staff activates the notifications toggle
            Then the staff notifications toggle is enabled

          @medium @notifications @dataset-full
          Scenario: Staff can close the notifications dropdown
            When the staff clicks the exit button on the notifications dropdown
            Then the staff notifications dropdown is closed

  Rule: Feedback request notifications
    Background:
      Given the staff opens the notifications dropdown
      And the staff activates the notifications toggle

    @medium @notifications @dataset-full
    Scenario: Staff can open a feedback notification detail
      Then the feedback notification card is displayed
      When the staff clicks on a feedback notification card
      Then the page navigates to the feedback detail page
      And the notification is marked as read
      
  Rule: Logout

    @high @logout
    Scenario: Staff can see logout action
      When the staff opens the profile dropdown
      Then the staff logout action have correct label

    @high @logout
    Scenario: Staff sees logout confirmation modal
      When the staff opens the profile dropdown
      And the staff clicks on the logout action
      Then the staff logout confirmation modal is visible