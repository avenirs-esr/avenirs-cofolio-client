import { staffsActivitiesHandlers } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { feedbacksHandlers } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { staffsUserHandlers } from '@/__mocks__/msw/handlers/staffs/user.handlers'
import { activitiesHandlers } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { backOfficeHandlers } from '@/__mocks__/msw/handlers/student/back-office.handlers'
import { declaredExperiencesHandlers } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { declaredProgramsHandlers } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { overviewsHandlers } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { programProgressHandlers } from '@/__mocks__/msw/handlers/student/program-progress.handlers'
import { selfKnowledgeHandlers } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { skillsHandlers } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { tracesHandlers } from '@/__mocks__/msw/handlers/student/traces.handlers'

export const handlers = [
  ...feedbacksHandlers,
  ...activitiesHandlers,
  ...backOfficeHandlers,
  ...tracesHandlers,
  ...declaredExperiencesHandlers,
  ...declaredProgramsHandlers,
  ...overviewsHandlers,
  ...programProgressHandlers,
  ...selfKnowledgeHandlers,
  ...skillsHandlers,
  ...staffsUserHandlers,
  ...staffsActivitiesHandlers,
  ...feedbacksHandlers,
]
