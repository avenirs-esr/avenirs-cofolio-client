import type { NotificationDTO, PagedResponseNotificationDTO } from '@/api/avenir-esr'
import { NotificationDTOType } from '@/api/avenir-esr'

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

export const ASK_FOR_FEEDBACK_NOTIFICATION_ACTIVITY_TITLE = 'Activité "CV" : Construire son parcours'
export const ASK_FOR_FEEDBACK_NOTIFICATION_ACTIVITY_ID = '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77'
export function mockedAskForFeedbackNotification (): NotificationDTO {
  return {
    id: 'notification-ask-for-feedback',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: NotificationDTOType.ASK_FOR_FEEDBACK,
    elementId: ASK_FOR_FEEDBACK_NOTIFICATION_ACTIVITY_ID,
    seen: false,
    parameters: {
      activityTitle: ASK_FOR_FEEDBACK_NOTIFICATION_ACTIVITY_TITLE,
    },
  }
}

export const ASSESSMENT_REQUEST_NOTIFICATION_ACTIVITY_TITLE = 'Activité "Me connaître" : Identifier ses motivations profondes'
export const ASSESSMENT_REQUEST_NOTIFICATION_ACTIVITY_ID = '9a12e6b4-8c3f-4d22-bf55-6d4c1f2a7e33'
export function mockedAssessmentRequestNotification (): NotificationDTO {
  return {
    id: 'notification-assessment-request',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: NotificationDTOType.ASSESSMENT_REQUEST,
    elementId: ASSESSMENT_REQUEST_NOTIFICATION_ACTIVITY_ID,
    seen: false,
    parameters: {
      activityTitle: ASSESSMENT_REQUEST_NOTIFICATION_ACTIVITY_TITLE,
    },
  }
}

export function createStaffMockedNotifications (totalElements: number): NotificationDTO[] {
  const notifications: NotificationDTO[] = [
    mockedAskForFeedbackNotification(),
    mockedAssessmentRequestNotification(),
  ]

  for (let i = notifications.length + 1; i <= totalElements; i++) {
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
