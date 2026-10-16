import type { RouteLocationRaw } from 'vue-router'
import { EFileType, ERole, EUserCategory, type ProfileOverviewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

/**
 * Stand-in while there is no session or data is invalid.
 */
export const INVALID_USER_CATEGORY = 'INVALID_USER_CATEGORY' as unknown as EUserCategory

/**
 * Stand-in while there is no profile (logged out, loading, failed).
 */
export const INVALID_PROFILE: ProfileOverviewDTO = {
  id: 'INVALID_PROFILE_ID',
  firstname: '',
  lastname: '',
  bio: '',
  email: '',
  profilePicture: {
    id: 'INVALID_PROFILE_PICTURE_ID',
    fileName: '',
    fileType: EFileType.JPEG,
    fileSize: 0,
    url: '',
    uploadedAt: ''
  },
  coverPicture: {
    id: 'INVALID_PROFILE_COVER_PICTURE_ID',
    fileName: '',
    fileType: EFileType.JPEG,
    fileSize: 0,
    url: '',
    uploadedAt: ''
  }
}

/**
 * Maps each role to its corresponding user category.
 */
export const ROLE_USER_CATEGORY: Record<ERole, EUserCategory> = {
  [ERole.ROLE_STUDENT]: EUserCategory.STUDENT,
  [ERole.ROLE_STAFF]: EUserCategory.STAFF,
  [ERole.ROLE_ADMIN]: EUserCategory.STAFF,
  [ERole.ROLE_SUPER_ADMIN]: EUserCategory.STAFF,
}

/**
 * Priority used to pick the default category (lowest value wins).
 */
export const USER_CATEGORY_PRIORITY: Record<EUserCategory, number> = {
  [EUserCategory.STUDENT]: 1,
  [EUserCategory.STAFF]: 0
}

/**
 * Maps each user category to its corresponding home route.
 */
export const USER_CATEGORY_HOME: Record<EUserCategory, RouteLocationRaw> = {
  [EUserCategory.STUDENT]: ROUTES.STUDENT.HOME,
  [EUserCategory.STAFF]: ROUTES.STAFF.HOME
}
