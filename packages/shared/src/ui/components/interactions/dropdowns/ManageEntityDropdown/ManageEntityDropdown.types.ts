import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'

/**
 * Available actions, sorted alphabetically.
 * The order in which actions are displayed depends on `moreActionConfig`.
 */
export enum Action {
  ADD = 'add',
  ASSOCIATE = 'associate',
  CLONE = 'clone',
  COLLAPSE = 'collapse',
  DISSOCIATE = 'dissociate',
  DELETE = 'delete',
  DOWNLOAD = 'download',
  EXPAND = 'expand',
  NAVIGATE_TO_FEEDBACKS = 'navigateToFeedbacks',
  PUBLISH = 'publish',
  RESUBSCRIBE = 'resubscribe',
  UNPUBLISH = 'unpublish',
  UNSUBSCRIBE = 'unsubscribe',
  UPDATE = 'update',
  UPDATE_IN_PROFILE = 'updateInProfile',
}

export interface ActionItem extends AvInteractiveProps {
  type: Action
}
