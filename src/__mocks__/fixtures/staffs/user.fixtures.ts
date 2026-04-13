import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import profile_banner_placeholder from '@/assets/staff_profile_banner_placeholder.jpg'
import profile_picture_placeholder from '@/assets/staff_profile_picture_placeholder.jpg'

export const mockedStaffProfileOverview: ProfileOverviewDTO = {
  firstname: 'Marie',
  lastname: 'Dupont',
  email: 'm.dupont@example.com',
  profilePicture: {
    fileId: undefined,
    fileName: profile_picture_placeholder,
    url: profile_picture_placeholder,
  },
  coverPicture: {
    fileId: undefined,
    fileName: undefined,
    url: profile_banner_placeholder,
  },
  bio: 'Je suis enseignante en chimie et écologie.'
}
