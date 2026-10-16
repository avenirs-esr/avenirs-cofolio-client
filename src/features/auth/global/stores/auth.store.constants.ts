import type { LoggedInUserDTO } from '@/api/avenir-esr'

/**
 * Stand-in while there is no session.
 */
export const INVALID_SESSION: LoggedInUserDTO = {
  firstname: '',
  lastname: '',
  roles: []
}
