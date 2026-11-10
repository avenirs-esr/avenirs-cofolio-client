import type { QuickLinksDTO } from '@avenirs-esr/shared/api/avenir-esr'

export const mockedStudentQuickLinks: QuickLinksDTO = {
  userId: crypto.randomUUID(),
  firstname: 'Jeanne',
  lastname: 'Moulin',
  hasUnseenNotification: false,
  unreadNotifications: 0,
  notificationEnabled: true
}
