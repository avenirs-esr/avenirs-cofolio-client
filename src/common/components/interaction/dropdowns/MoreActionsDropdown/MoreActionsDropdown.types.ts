export enum Action {
  ADD = 'add',
  CLONE = 'clone',
  DELETE = 'delete',
  DOWNLOAD = 'download',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  UPDATE = 'update',
}

export interface ActionItem {
  type: Action
  disabled?: boolean
}
