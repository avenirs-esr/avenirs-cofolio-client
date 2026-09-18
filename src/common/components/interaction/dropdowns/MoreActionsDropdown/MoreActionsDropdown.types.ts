export enum Action {
  ADD = 'add',
  CLONE = 'clone',
  COLLAPSE = 'collapse',
  DELETE = 'delete',
  DOWNLOAD = 'download',
  EXPAND = 'expand',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  UPDATE = 'update',
  UPDATE_IN_PROFILE = 'updateInProfile',
}

export interface ActionItem {
  type: Action
  disabled?: boolean
}
