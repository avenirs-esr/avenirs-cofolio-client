@activity-details @dataset-full
Feature: Student Project Activity Detail Page

  Background:
    Given the student opens the project activities page
    When the student open activity library tab
    And the student clicks the first library activity card

  Rule: Page Load

    @high @activity-details
    Scenario: Student can load activity detail page
      Then the URL contains "/cofolio/student/project/activities/"

  Rule: Activity Detail

    Background:
      And the project activity details are loaded

    @high @activity-details @activity-title
    Scenario: Student can see the activity detail title
      Then the activity detail title is visible

    @high @activity-details @activity-dropdown
    Scenario: Student can see the activity dropdown
      Then the activity dropdown is visible

    @high @activity-details @activity-period
    Scenario: Student can see the activity start and end dates
      Then the activity start date is visible
      And the activity end date is visible

    @high @activity-details @activity-content
    Scenario: Student can see the activity title and summary
      Then the activity title is visible
      And the activity summary is visible

    @high @activity-details @activity-execution-period
    Scenario: Student can see the activity execution period list
      Then the activity execution period list is visible

    @high @activity-details @activity-status
    Scenario: Student can see the activity status
      Then the activity status is visible

  Rule: My perspective

    Background:
      And the project activity details are loaded

    @high @activity-details @perspective
    Scenario: Student can edit an activity perspective
      When the student opens the project activities page
      And the student open activity library tab
      And the student clicks a library activity card with in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the my perspective card is visible
      And the my perspective card is in readonly mode
      When the student clicks the edit my perspective button
      Then the my perspective card is in editable mode

    @high @activity-details @perspective
    Scenario: Student can cancel the edition of an activity perspective
      When the student opens the project activities page
      And the student open activity library tab
      And the student clicks a library activity card with in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the my perspective card is visible
      And the my perspective card is in readonly mode
      When the student clicks the edit my perspective button
      Then the my perspective card is in editable mode
      When the student cancels the perspective edition
      Then the my perspective card is in readonly mode

  Rule: Finish declared activity

    Background:
      And the project activity details are loaded

    @high @activity-details @finish-activity
    Scenario: Student cannot finish an activity that is not in progress
      When the student opens the project activities page
      And the student open activity library tab
      And the student clicks a library activity card with not in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the finish activity button is hidden

    @high @activity-details @finish-activity
    Scenario: Student can finish an in progress activity
      When the student opens the project activities page
      And the student open activity library tab
      And the student clicks a library activity card with in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the finish activity button is visible
      When the student clicks the finish activity button
      Then the finish activity confirmation modal is visible

  Rule: Associated elements

    Background:
      And the project activity details are loaded
      When the student opens the project activities page
      And the student open activity library tab

    @high @activity-details @associated-elements @dataset-full
    Scenario: Student can see the activity associated elements
      And the student clicks a library activity card with in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      When the student opens associated elements tab
      Then the associated traces card is visible
      When the student clicks the associated traces card
      Then the associated trace cards are visible

    @high @activity-details @associated-elements
    Scenario: Student can't see associated elements of activities without associated elements
      And the student clicks a library activity card with not in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      When the student opens associated elements tab
      Then the associated traces card is hidden
      And the associated trace cards are hidden

    @high @activity-details @associated-elements @associate-traces-modal @dataset-full
    Scenario: Student can open associate traces modal from associated elements tab
      And the student clicks a library activity card with in progress status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      And the student opens associated elements tab
      And the student opens the associate elements dropdown
      And the student clicks the associate traces dropdown item
      Then the associate traces modal is visible
      And the associate traces modal title is visible
      And the traces type select is visible in associate traces modal
      And the search association layout is visible in associate traces modal
      And the associate traces confirmation modal is hidden