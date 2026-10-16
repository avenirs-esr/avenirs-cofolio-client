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
