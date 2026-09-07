import { activityEndpoints } from "@/__mocks__/msw/activity/endpoints"
import { createMockEnvironment } from "@/__mocks__/msw/core"

export const mockEnvironment = createMockEnvironment({
  ...activityEndpoints,
})

export const handlers = mockEnvironment.handlers

export const mockScenario = mockEnvironment.scenarios
