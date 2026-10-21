import { setupWorker } from 'msw/browser'
import { handlers } from '@/__mocks__/msw/handlers'

export const worker = setupWorker(...handlers)
