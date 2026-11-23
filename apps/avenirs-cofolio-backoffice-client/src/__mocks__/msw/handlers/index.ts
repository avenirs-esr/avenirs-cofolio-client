import { cguHandlers } from '@/__mocks__/msw/handlers/cgu.handlers'
import { globalAlertHandlers } from '@/__mocks__/msw/handlers/global-alert.handlers'
import { nationalToolsHandlers } from '@/__mocks__/msw/handlers/national-tools.handlers'

export const handlers = [
  ...cguHandlers,
  ...globalAlertHandlers,
  ...nationalToolsHandlers
]
