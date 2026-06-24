import { type NotificationDTO, NotificationDTOType, type PagedResponseNotificationDTO } from '@/api/avenir-esr'

export const mockedStudentNotification: NotificationDTO = {
  id: crypto.randomUUID(),
  createdAt: '2024-01-01T00:00:00Z',
  type: NotificationDTOType.ASK_FOR_FEEDBACK,
  seen: true
}

export const mockedStudentUnseenNotification: NotificationDTO = {
  ...mockedStudentNotification,
  seen: false
}

export function createStudentMockedNotifications (totalElements: number): NotificationDTO[] {
  const notifications: NotificationDTO[] = []

  for (let i = 1; i <= totalElements; i++) {
    notifications.push({
      ...mockedStudentNotification,
      id: `notification-${i}`,
      seen: i % 2 === 0
    })
  }

  return notifications
}

export function createStudentMockedPagedResponseNotifications (pageSize: number, totalElements: number, page: number): PagedResponseNotificationDTO {
  const mockedNotifications = createStudentMockedNotifications(totalElements)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedNotifications = mockedNotifications.slice(start, end)
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    data: paginatedNotifications,
    page: { pageSize, totalElements, totalPages, page },
  }
}
