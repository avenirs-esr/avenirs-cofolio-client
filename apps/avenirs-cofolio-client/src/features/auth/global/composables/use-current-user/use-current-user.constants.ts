import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import { EFileType } from '@/api/avenir-esr'

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
 * Keeps the profile of the currently active category fresh indefinitely,
 * preventing automatic refetches due to staleness.
 */
export const PROFILE_STALE_TIME: number = Infinity

/**
 * Keeps profiles of previously selected categories in the cache for 10 minutes
 * after their queries become inactive, allowing them to be reused if selected again.
 */
export const PROFILE_GC_TIME: number = 10 * 60 * 1000
