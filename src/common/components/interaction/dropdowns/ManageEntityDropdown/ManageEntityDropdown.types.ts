export enum Action {
  ADD = 'add',
  ASSOCIATE = 'associate',
  CLONE = 'clone',
  COLLAPSE = 'collapse',
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

export interface ActionItem {
  type: Action
  disabled?: boolean
  disabledTooltip?: string
}
