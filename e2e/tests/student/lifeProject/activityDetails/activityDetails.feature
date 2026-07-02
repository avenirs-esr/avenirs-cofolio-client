@activity-details @dataset-full
Feature: Student Project Activity Detail Page

  Background:
    Given the student opens the project activities page
    When the student open activity library tab
    And the student selects 12 results per page in activity library

  Rule: Page Load

    @high @activity-details
    Scenario: Student can load activity detail page
      And the student clicks a library activity card with "IN_PROGRESS" status
      Then the URL contains "/cofolio/student/project/activities/"

  Rule: Activity Detail

    Background:
      And the student clicks a library activity card with "IN_PROGRESS" status
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
    Scenario: Student can see the activity title and description
      Then the activity title is visible
      And the activity description is visible

    @high @activity-details @activity-execution-period
    Scenario: Student can see the activity execution period list
      Then the activity execution period list is visible

    @high @activity-details @activity-status
    Scenario: Student can see the activity status
      Then the activity status is visible

  Rule: My perspective

    Background:
      And the student clicks a library activity card with "IN_PROGRESS" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible

    @high @activity-details @perspective
    Scenario: Student can edit an activity perspective
      Then the my perspective card is visible
      And the my perspective card is in readonly mode
      When the student clicks the edit my perspective button
      Then the my perspective card is in editable mode

    @high @activity-details @perspective
    Scenario: Student can cancel the edition of an activity perspective
      Then the my perspective card is visible
      And the my perspective card is in readonly mode
      When the student clicks the edit my perspective button
      Then the my perspective card is in editable mode
      When the student cancels the perspective edition
      Then the my perspective card is in readonly mode

    @high @activity-details @feedback-info-card
    Scenario: Student can see the feedback info card in the my perspective tab
      Then the feedback info card is visible
      And the feedback info card title is visible
      And the feedback info card iterations badge is visible

  Rule: Finish declared activity

    @high @activity-details @finish-activity
    Scenario: Student with in progress activity can finish it
      And the student clicks a library activity card with "IN_PROGRESS" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the finish activity button is visible
      And the finish activity button is enabled
      And the finish activity badge is hidden
      When the student clicks the finish activity button
      Then the finish activity confirmation modal is visible

    @high @activity-details @finish-activity
    Scenario: Student with submitted activity has disabled finish button
      And the student clicks a library activity card with "SUBMITTED" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the finish activity button is visible
      And the finish activity button is disabled
      And the finish activity badge is hidden

    @high @activity-details @finish-activity
    Scenario: Student with completed activity sees finished badge
      And the student clicks a library activity card with "COMPLETED" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the finish activity button is hidden
      And the finish activity badge is visible

    @high @activity-details @finish-activity
    Scenario: Student with subscribed activity has no finish button and no badge
      And the student clicks a library activity card with "SUBSCRIBED" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the finish activity button is hidden
    And the finish activity badge is hidden

  Rule: Request feedback

    @high @activity-details @feedback-request
    Scenario: Student with subscribed activity has no feedback button and no hint
      And the student clicks a library activity card with "SUBSCRIBED" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the request feedback button is hidden
      And the update feedback button is hidden
      And the feedback hint is hidden

    @high @activity-details @feedback-request
    Scenario: Student with in progress activity can request feedback
      And the student clicks a library activity card with "IN_PROGRESS" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the request feedback button is visible
      And the request feedback button is enabled
      And the feedback hint is hidden
      When the student clicks the request feedback button
      Then the request feedback confirmation modal is visible
      When the student clicks the cancel button in the request feedback confirmation modal
      Then the request feedback confirmation modal is hidden

    @high @activity-details @feedback-request
    Scenario: Student with submitted activity has enabled update feedback button and updatable feedback hint
      And the student clicks a library activity card with "SUBMITTED" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the update feedback button is visible
      And the update feedback button is enabled
      And the updatable feedback hint is visible

    @high @activity-details @feedback-request
    Scenario: Student with completed activity has no feedback button and finished hint is visible
      And the student clicks a library activity card with "COMPLETED" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the request feedback button is hidden
      And the update feedback button is hidden
      And the finished hint is visible

  Rule: Received feedbacks

    @high @activity-details @received-feedbacks
    Scenario: Student can see the received feedbacks section in the my perspective tab for an in progress activity
      And the student clicks a library activity card with "IN_PROGRESS" status
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the received feedbacks section is visible
      And the received feedbacks section title is visible

    @high @activity-details @received-feedbacks
    Scenario: Student sees the empty state when no submitted feedbacks
      And the student clicks an in progress activity without received feedbacks
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      Then the received feedbacks section is visible
      And the received feedbacks empty state is visible

  Rule: Associated elements

    Background:
      When the student opens the project activities page
      And the student open activity library tab
      And the student selects 12 results per page in activity library

    @high @activity-details @associated-elements @dataset-full
    Scenario: Student can see the activity associated elements
      And the student clicks an in progress activity with associated traces
      And the project activity details are loaded
      And the student clicks the my perspective item in the activity side menu
      And the my perspective section is visible
      When the student opens associated elements tab
      Then the associated traces card is visible

    @high @activity-details @associated-elements @associate-traces-modal @dataset-full
    Scenario: Student can open associate traces modal from associated elements tab
      And the student clicks an in progress activity with associated traces
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