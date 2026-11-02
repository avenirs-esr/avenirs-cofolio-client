import type { NotificationDTO, PagedResponseNotificationDTO } from '@/api/avenir-esr'
import { ActivityModifiedParametersUpdatedFieldsItem, NotificationDTOType } from '@/api/avenir-esr'

export const mockedStudentNotification: NotificationDTO = {
  id: crypto.randomUUID(),
  createdAt: '2024-01-01T00:00:00Z',
  type: NotificationDTOType.ACTIVITY_MODIFIED,
  seen: true
}

export const mockedStudentUnseenNotification: NotificationDTO = {
  ...mockedStudentNotification,
  seen: false
}

export const ACTIVITY_MODIFIED_NOTIFICATION_ACTIVITY_TITLE = 'Activité "CV" : Construire son parcours'

export const ACTIVITY_MODIFIED_NOTIFICATION_SINGLE_SECTION_ACTIVITY_ID = '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77'

export const ACTIVITY_MODIFIED_NOTIFICATION_MULTIPLE_SECTIONS_ACTIVITY_ID = '7b3d4e91-6f2a-4c88-9a1e-5d3f7b2c8e44'

function createMockedActivityModifiedNotification (id: string, elementId: string, updatedFields: ActivityModifiedParametersUpdatedFieldsItem[]): NotificationDTO {
  return {
    id,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: NotificationDTOType.ACTIVITY_MODIFIED,
    elementId,
    seen: false,
    parameters: {
      activityTitle: ACTIVITY_MODIFIED_NOTIFICATION_ACTIVITY_TITLE,
      updatedFields,
    },
  }
}

export function mockedActivityModifiedNotificationSingleSection (): NotificationDTO {
  return createMockedActivityModifiedNotification(
    'notification-activity-modified-single',
    ACTIVITY_MODIFIED_NOTIFICATION_SINGLE_SECTION_ACTIVITY_ID,
    [ActivityModifiedParametersUpdatedFieldsItem.ACTIVITY_TITLE],
  )
}

export function mockedActivityModifiedNotificationMultipleSections (): NotificationDTO {
  return createMockedActivityModifiedNotification(
    'notification-activity-modified-multiple',
    ACTIVITY_MODIFIED_NOTIFICATION_MULTIPLE_SECTIONS_ACTIVITY_ID,
    [
      ActivityModifiedParametersUpdatedFieldsItem.ACTIVITY_TITLE,
      ActivityModifiedParametersUpdatedFieldsItem.THEMATIC,
    ],
  )
}

export const ASSESSMENT_SENT_NOTIFICATION_ACTIVITY_TITLE = 'Activité "Portfolio" : Valoriser ses expériences'

export const ASSESSMENT_SENT_NOTIFICATION_ACTIVITY_ID = '4c8e2a17-3d5b-4f96-8b2e-1a7d9c6f3e52'

export function mockedAssessmentSentNotification (): NotificationDTO {
  return {
    id: 'notification-assessment-sent',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: NotificationDTOType.ASSESSMENT_SENT,
    elementId: ASSESSMENT_SENT_NOTIFICATION_ACTIVITY_ID,
    seen: false,
    parameters: {
      activityTitle: ASSESSMENT_SENT_NOTIFICATION_ACTIVITY_TITLE,
    },
  }
}

export function createStudentMockedNotifications (totalElements: number): NotificationDTO[] {
  const notifications: NotificationDTO[] = [
    mockedActivityModifiedNotificationSingleSection(),
    mockedActivityModifiedNotificationMultipleSections(),
    mockedAssessmentSentNotification(),
  ]

  for (let i = notifications.length + 1; i <= totalElements; i++) {
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
