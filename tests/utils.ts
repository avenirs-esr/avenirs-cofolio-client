import type { AvRoute } from '@/common/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { flushPromises } from '@vue/test-utils'
import { createMockQueryError, mockAddErrorMessage } from 'tests/mocks'
import { describe, expect, it, type MockedFunction } from 'vitest'

function testUseBaseApiExceptionToast<T> ({
  mockedUseQuery,
  payload,
  mountComponent,
}: {
  mockedUseQuery: MockedFunction<() => UseQueryDefinedReturnType<T, BaseApiException>>
  payload: T
  mountComponent: (() => Promise<unknown>) | (() => unknown)
}) {
  it('should add error message on query error', async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    const error: BaseApiException = {
      message: 'error',
      name: 'mockError',
      status: 400,
      code: BaseApiErrorCode.BAD_REQUEST,
    }

    const queryMockedData = createMockQueryError<T>(payload, error)
    mockedUseQuery.mockReturnValue(queryMockedData)

    await mountComponent()
    await flushPromises()

    expect(mockAddErrorMessage).toHaveBeenCalled()
    expect(mockAddErrorMessage).toHaveBeenCalledWith(error.message)
  })
}

function testRoute (route: AvRoute, expectedConfig: Partial<typeof route>, expectedComponent: unknown) {
  describe(route.name, () => {
    it('should have correct route config', () => {
      expect(route).toMatchObject({ ...expectedConfig, component: expect.any(Function) })
    })

    it('should dynamically import the component and match it', async () => {
      const componentLoader = route.component as () => Promise<{ default: unknown }>
      const componentModule = await componentLoader()
      expect(componentModule).toBeDefined()
      expect(componentModule.default).toBe(expectedComponent)
    })
  })
}

export {
  testRoute,
  testUseBaseApiExceptionToast
}
