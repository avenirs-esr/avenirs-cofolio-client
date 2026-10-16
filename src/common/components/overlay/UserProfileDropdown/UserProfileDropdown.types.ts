import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'

export interface UserProfileDropdownAction extends AvInteractiveProps {
  name: string
  label: string
  icon?: string
}

export enum UserProfileDropdownEvents {
  REWATCH_TUTORIAL = 'rewatch-tutorial',
  LOGOUT = 'logout-button'
}
