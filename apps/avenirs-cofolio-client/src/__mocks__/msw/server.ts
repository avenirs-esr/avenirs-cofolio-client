import { setupServer } from 'msw/node'
import { handlers } from '@/__mocks__/msw/handlers'

export const server = setupServer(...handlers)
