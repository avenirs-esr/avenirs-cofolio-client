import { filesHandlers } from '@/__mocks__/msw/handlers/shared/files.handlers'
import { notificationsHandlers } from '@/__mocks__/msw/handlers/shared/notifications.handlers'
import { staffsActivitiesHandlers } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { feedbacksHandlers } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { staffNotificationsHandlers } from '@/__mocks__/msw/handlers/staffs/notifications.handlers'
import { staffUserHandlers } from '@/__mocks__/msw/handlers/staffs/user.handlers'
import { activitiesHandlers } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { backOfficeHandlers } from '@/__mocks__/msw/handlers/student/back-office.handlers'
import { declaredExperiencesHandlers } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { declaredProgramsHandlers } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { studentNotificationsHandlers } from '@/__mocks__/msw/handlers/student/notifications.handlers'
import { overviewsHandlers } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { selfKnowledgeHandlers } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { skillsHandlers } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { tracesHandlers } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { studentUserHandlers } from '@/__mocks__/msw/handlers/student/user.handlers'

export const handlers = [
  ...filesHandlers,
  ...notificationsHandlers,
  ...staffNotificationsHandlers,
  ...staffUserHandlers,
  ...studentNotificationsHandlers,
  ...studentUserHandlers,
  ...feedbacksHandlers,
  ...backOfficeHandlers,
  ...declaredExperiencesHandlers,
  ...declaredProgramsHandlers,
  ...selfKnowledgeHandlers,
  ...skillsHandlers,
  ...staffsActivitiesHandlers,
  ...feedbacksHandlers,
  ...tracesHandlers,
  ...activitiesHandlers,
  ...overviewsHandlers,
]
