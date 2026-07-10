import { EFileType, type ProfileOverviewDTO, type QuickLinksDTO } from '@/api/avenir-esr'
import profile_banner_placeholder from '@/assets/staff_profile_banner_placeholder.jpg'
import profile_picture_placeholder from '@/assets/staff_profile_picture_placeholder.jpg'

export const mockedStaffProfileOverview: ProfileOverviewDTO = {
  firstname: 'Marie',
  lastname: 'Dupont',
  id: crypto.randomUUID(),
  email: 'm.dupont@example.com',
  profilePicture: {
    id: crypto.randomUUID(),
    fileSize: 1000,
    fileType: EFileType.PNG,
    version: 1,
    uploadedAt: '2025-06-13T08:42:17',
    fileName: profile_picture_placeholder,
    url: profile_picture_placeholder,
  },
  coverPicture: {
    id: crypto.randomUUID(),
    fileSize: 1000,
    fileType: EFileType.PNG,
    version: 1,
    uploadedAt: '2025-06-13T08:42:17',
    fileName: profile_banner_placeholder,
    url: profile_banner_placeholder,
  },
  bio: 'Je suis enseignante en chimie et écologie.'
}

export const mockedStaffQuickLinks: QuickLinksDTO = {
  userId: crypto.randomUUID(),
  firstname: 'Marie',
  lastname: 'Dupont',
  hasUnseenNotification: true,
  unreadNotifications: 10,
  notificationEnabled: false
}
