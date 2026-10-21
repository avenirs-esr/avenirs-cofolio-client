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

  Rule: Feedbacks widget

    Background:
      Given the staff feedbacks widget is visible

    @high @feedbacks-widget @dataset-full
    Scenario: Feedbacks widget displays some feedback cards and see all button
      Then the feedbacks widget displays correctly

    @high @feedbacks-widget @dataset-full
    Scenario: Feedback cards are clickable and navigate to the feedback details page
      When the staff clicks a feedback card
      And the URL contains "/activity-feedback"

    @medium @feedbacks-widget @dataset-full
    Scenario: See all feedbacks button navigates to feedbacks page
      When the staff clicks see all feedbacks button
      Then the staff feedbacks page is displayed
      And the URL contains "/student-tracking/feedbacks"

  Rule: Draft activities widget

    Background:
      Given the staff draft activities widget is visible

    @high @draft-activities-widget @dataset-full
    Scenario: Draft activities widget displays some draft activity cards and see all button
      Then the draft activities widget displays correctly

    @high @draft-activities-widget @dataset-full
    Scenario: Draft activity cards are clickable and navigate to the draft activity details page
      When the staff clicks a draft activity card
      Then the staff draft activity details page is displayed
      And the URL contains "/cofolio/staff/activities/DRAFT"

    @medium @draft-activities-widget @dataset-full
    Scenario: See all draft activities button navigates to draft activities page
      When the staff clicks see all draft activities button
      Then the staff activities page is displayed
      And the URL contains "/cofolio/staff/activities"

  Rule: Published activities widget

    Background:
      Given the staff published activities widget is visible

    @high @published-activities-widget @dataset-full
    Scenario: Published activities widget displays some published activity cards and see all button
      Then the published activities widget displays correctly

    @high @published-activities-widget @dataset-full
    Scenario: Published activity cards are clickable and navigate to the published activity details page
      When the staff clicks a published activity card
      Then the staff published activity details page is displayed
      And the URL contains "/cofolio/staff/activities/PUBLISHED"

    @medium @published-activities-widget @dataset-full
    Scenario: See all published activities button navigates to published activities page
      When the staff clicks see all published activities button
      Then the staff activities page is displayed
      And the URL contains "/cofolio/staff/activities"

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