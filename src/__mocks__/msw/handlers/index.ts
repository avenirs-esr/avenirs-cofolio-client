import { amsHandlers } from '@/__mocks__/msw/handlers/student/ams.handlers'
import { backOfficeHandlers } from '@/__mocks__/msw/handlers/student/back-office.handlers'
import { overviewsHandlers } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { programProgressHandlers } from '@/__mocks__/msw/handlers/student/program-progress.handlers'
import { selfKnowledgeHandlers } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { skillsHandlers } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { tracesHandlers } from '@/__mocks__/msw/handlers/student/traces.handlers'

export const handlers = [
  ...amsHandlers,
  ...backOfficeHandlers,
  ...overviewsHandlers,
  ...programProgressHandlers,
  ...selfKnowledgeHandlers,
  ...skillsHandlers,
  ...tracesHandlers,
]
