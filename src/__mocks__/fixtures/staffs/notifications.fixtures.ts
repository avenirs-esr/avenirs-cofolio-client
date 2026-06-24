import { type NotificationDTO, NotificationDTOType, type PagedResponseNotificationDTO } from '@/api/avenir-esr'

export const mockedStaffNotification: NotificationDTO = {
  id: crypto.randomUUID(),
  createdAt: '2024-01-01T00:00:00Z',
  type: NotificationDTOType.ASK_FOR_FEEDBACK,
  seen: true
}

export const mockedStaffUnseenNotification: NotificationDTO = {
  ...mockedStaffNotification,
  seen: false
}

export function createStaffMockedNotifications (totalElements: number): NotificationDTO[] {
  const notifications: NotificationDTO[] = []

  for (let i = 1; i <= totalElements; i++) {
    notifications.push({
      ...mockedStaffNotification,
      id: `notification-${i}`,
      seen: i % 2 === 0
    })
  }

  return notifications
}

export function createStaffMockedPagedResponseNotifications (pageSize: number, totalElements: number, page: number): PagedResponseNotificationDTO {
  const mockedNotifications = createStaffMockedNotifications(totalElements)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedNotifications = mockedNotifications.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedNotifications,
    page: { pageSize, totalElements, totalPages, page },
  }
}
