@staff @activities @edit-national-activity @dataset-full
Feature: Staff Edit National Activity Page

  Background:
    Given the staff opens the activities page

  Rule: Page Load and Basic Display

    Background:
      Given the staff navigates to the first activity edit page

    @high
    Scenario: Staff can load edit national activity page successfully
      Then the edit national activity page is displayed
      And the URL contains "/cofolio/staff/activities"
      And the URL contains "/edit"

    @high
    Scenario: The edit activity page is displayed
      Then the edit national activity page is displayed
      And the URL contains "/cofolio/staff/activities"
      And the URL contains "/edit"

    @high @tab-navigation
    Scenario: The content tab is active by default
      Then the content tab is active by default

    @high @side-navigation
    Scenario: The side navigation is visible and expanded by default
      Then the side navigation menu is visible
      And the side navigation menu is expanded by default
      And the side navigation menu has content header
      And the side navigation menu has "TITLE" content section
      And the side navigation menu has "THEMATIC" content section
      And the side navigation menu has "INSTRUCTIONS" content section
      And the side navigation menu has "CONTEXT" content section
      And the side navigation menu has "DOCUMENTS" content section
      And the side navigation menu has "MODALITIES" content section

  Rule: Navigation to the publication tab

    Background:
      Given the staff navigates to the first activity edit page
      And the staff navigates to the publication tab

    @high @tab-navigation
    Scenario: The staff can switch to the publication tab
      Then the publication tab is active

    @high @side-navigation
    Scenario: The side navigation updates when switching to the publication tab
      Then the side navigation menu has publication header
      And the side navigation menu has "ACTIVITY_TITLE" publication section
      And the side navigation menu has "IMAGE" publication section
      And the side navigation menu has "SUMMARY_CONTEXT" publication section

  Rule: Side navigation sub-section interaction

    Background:
      Given the staff navigates to the first activity edit page

    @high @side-navigation
    Scenario: Clicking a content sub-section highlights it in the side navigation
      When the staff clicks on the content "TITLE" section in the side navigation menu
      Then the content "TITLE" section is active in the side navigation menu

    @high @side-navigation
    Scenario: Clicking a content sub-section updates the URL anchor
      When the staff clicks on the content "TITLE" section in the side navigation menu
      Then the URL contains "#TITLE"

    @high @side-navigation
    Scenario: Clicking another content sub-section updates the active state in the side navigation
      When the staff clicks on the content "TITLE" section in the side navigation menu
      And the staff clicks on the content "THEMATIC" section in the side navigation menu
      Then the content "THEMATIC" section is active in the side navigation menu
      And the content "TITLE" section is not active in the side navigation menu

    @high @side-navigation
    Scenario: Clicking a publication sub-section highlights it in the side navigation
      Given the staff navigates to the publication tab
      And the staff clicks on the publication "SUMMARY_CONTEXT" section in the side navigation menu
      Then the publication "SUMMARY_CONTEXT" section is active in the side navigation menu

    @high @side-navigation
    Scenario: Clicking a publication sub-section updates the URL anchor
      Given the staff navigates to the publication tab
      And the staff clicks on the publication "SUMMARY_CONTEXT" section in the side navigation menu
      Then the URL contains "#SUMMARY_CONTEXT"

    @high @side-navigation
    Scenario: Clicking another publication sub-section updates the active state in the side navigation
      Given the staff navigates to the publication tab
      And the staff clicks on the publication "ACTIVITY_TITLE" section in the side navigation menu
      And the staff clicks on the publication "IMAGE" section in the side navigation menu
      Then the publication "IMAGE" section is active in the side navigation menu
      And the publication "ACTIVITY_TITLE" section is not active in the side navigation menu

  Rule: Side navigation collapse

    Background:
      Given the staff navigates to the first activity edit page

    @high @side-navigation
    Scenario: The staff can collapse the side navigation
      When the staff collapses the side navigation menu
      Then the side navigation menu is collapsed

  Rule: Content tab elements

    Background:
      Given the staff navigates to the first activity edit page

    @high
    Scenario: The thematic select field is visible in the content tab
      Then the thematic select field is visible

    @high
    Scenario: The context of realization section is collapsed by default in the content tab
      Then the context of realization section is collapsed by default

    @high
    Scenario: The resources section is collapsed by default
      Then the section accordion "DOCUMENTS" is collapsed
  
    @high
    Scenario: The reflection parameter is visible in the content tab
      Then the reflection parameter is visible
      
    @high
    Scenario: The trace association parameter is visible in the content tab
      Then the trace association parameter is visible
      
    @high
    Scenario: the consign section is collapsed by default in the content tab
      Then the consign section is collapsed by default

  Rule: Content tab feedback interactions

    Background:
      Given the staff navigates to the first activity edit page
      And the staff ensures the feedback request is enabled

    @high
    Scenario: The feedback max iterations input is visible when feedback is enabled
      And the staff ensures unlimited feedback interactions is disabled
      Then the feedback max iterations input is visible

    @high
    Scenario: Disabling feedback request hides the max iterations input
      When the staff disables the feedback request
      Then the feedback max iterations input is hidden

    @high
    Scenario: Allowing unlimited feedback interactions hides the max iterations input
      And the staff ensures unlimited feedback interactions is disabled
      And the staff enables unlimited feedback interactions
      Then the feedback max iterations input is hidden

    @high
    Scenario: Disabling unlimited feedback interactions shows the max iterations input
      And the staff enables unlimited feedback interactions
      And the staff disables unlimited feedback interactions
      Then the feedback max iterations input is visible

  Rule: Publication tab elements
    Background:
      Given the staff navigates to the first activity edit page
      And the staff navigates to the publication tab

    @high
    Scenario: The context of realization section is visible in the publication tab
      Then the context of realization section is visible

    @high
    Scenario: The summary section is visible in the publication tab
      Then the summary section is visible

    @high
    Scenario: The activity banner form field is visible in the publication tab
      Then the activity banner form field is visible

    @high
    Scenario: The publish button is visible and enabled by default
      Then the publish button is visible and enabled

    @high
    Scenario: The staff can see the confirmation modal when clicking publish
      When the staff clicks on the publish button
      Then the publish confirmation modal is visible
      And the confirm and cancel buttons are visible

    @high
    Scenario: The staff can cancel the publication
      When the staff clicks on the publish button
      And the staff clicks on the cancel button in the confirmation modal
      Then the confirmation modal is closed

  Rule: Activity with enrolled students

    Background:
      When the user clicks on the all published activities tab
      And the user clicks on the first published activity title with enrolled students

    @high @dataset-full @edit-published-activity
    Scenario: Staff can edit a published activity with enrolled students but modalities are disabled
      Then the staff published activity details page is displayed
      And the edit published activity button is visible
      When the user clicks on the edit published activity button
      Then the staff edit published activity page is displayed
      And the editable activity content fields are enabled
      And the activity modalities fields are disabled
      And the activity modalities disabled information messages are visible
      When the staff republishes the activity

  Rule: Activity without enrolled students

    Background:
      When the user clicks on the all published activities tab
      And the user clicks on the published activity title without enrolled students

    @high @dataset-full @edit-published-activity
    Scenario: Staff can edit all modalities of a published activity without enrolled students
      Then the staff published activity details page is displayed
      And the edit published activity button is visible
      When the user clicks on the edit published activity button
      Then the staff edit published activity page is displayed
      And the editable activity content fields are enabled
      And the activity modalities fields are enabled
      And the activity modalities future disabled information messages are visible
      When the staff republishes the activity

  Rule: Managing activity resources

    Background:
      When the user clicks on the all published activities tab
      And the user clicks on the first published activity title with file and link
      Then the staff published activity details page is displayed
      When the user clicks on the edit published activity button
      Then the staff edit published activity page is displayed
      And the staff toggles the "DOCUMENTS" section accordion
      And the section accordion "DOCUMENTS" is visible

    @high @dataset-full @activity-resources-managment @delete-activity-resources
    Scenario: The delete resources button is disabled when no resource is selected
      Then the delete resources button is disabled
    
    @high @dataset-full @activity-resources-managment @add-activity-resources
    Scenario: Adding a file resource to the activity by default
      When the staff clicks on the add resource button
      Then the add resource modal file form is visible
      And the add resource modal link form is hidden
    
    @high @dataset-full @activity-resources-managment @add-activity-resources
    Scenario: The staff can select the link type for adding a link resource to the activity
      When the staff clicks on the add resource button
      Then the add resource modal file form is visible
      When the staff selects "link" as the resource type in the add resource modal
      Then the add resource modal link form is visible
      And the add resource modal file form is hidden

    @high @dataset-full @activity-resources-managment @delete-activity-resources
    Scenario: Selecting one resource enables the delete button and shows the singular confirmation message
      When the staff selects the resource "definir-ses-valeurs-exercices.docx"
      Then the delete resources button is enabled
      When the staff clicks on the delete resources button
      Then the delete resources confirmation modal is visible
      And the delete resources confirmation modal shows the singular confirmation message
      And the delete resources confirmation modal lists the resource "definir-ses-valeurs-exercices.docx"

    @high @dataset-full @activity-resources-managment @delete-activity-resources
    Scenario: Selecting several resources shows the plural confirmation message
      When the staff selects the resource "definir-ses-valeurs-exercices.docx"
      And the staff selects the resource "https://example.com/definir-ses-valeurs"
      And the staff clicks on the delete resources button
      Then the delete resources confirmation modal is visible
      And the delete resources confirmation modal shows the plural confirmation message
      And the delete resources confirmation modal lists the resource "definir-ses-valeurs-exercices.docx"
      And the delete resources confirmation modal lists the resource "https://example.com/definir-ses-valeurs"

    @high @dataset-full @activity-resources-managment @delete-activity-resources
    Scenario: Cancelling the deletion keeps the resource
      When the staff selects the resource "definir-ses-valeurs-exercices.docx"
      And the staff clicks on the delete resources button
      And the staff clicks on the cancel button in the delete resources confirmation modal
      Then the delete resources confirmation modal is hidden
      And the resource "definir-ses-valeurs-exercices.docx" is still listed

    @high @dataset-full @activity-resources-managment @delete-activity-resources
    Scenario: Confirming the deletion removes the resource
      When the staff selects the resource "definir-ses-valeurs-exercices.docx"
      And the staff clicks on the delete resources button
      And the staff confirms the deletion in the delete resources confirmation modal
      Then the delete resources confirmation modal is hidden
      And the staff save the activity
      And the resource "definir-ses-valeurs-exercices.docx" is no longer listed
