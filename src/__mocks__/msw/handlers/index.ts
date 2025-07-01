import { amsHandlers } from '@/__mocks__/msw/handlers/student/ams.handlers'
import { overviewsHandlers } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { programProgressHandlers } from '@/__mocks__/msw/handlers/student/program-progress.handlers'
import { tracesHandlers } from '@/__mocks__/msw/handlers/student/traces.handlers'

export const handlers = [
  ...amsHandlers,
  ...overviewsHandlers,
  ...programProgressHandlers,
  ...tracesHandlers,
]
