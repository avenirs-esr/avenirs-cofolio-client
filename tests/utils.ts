import type { AvRoute } from '@/common/types'
import type { CommonMutationArgs } from '@/features/student/queries/types'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import { useInvalidateQuery } from '@/common/composables'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { createMockQueryError, mockAddErrorMessage } from 'tests/mocks'
import { describe, expect, it, type Mock, type MockedFunction, type MockInstance } from 'vitest'

function testUseBaseApiExceptionToast<T> ({
  mockedUseQuery,
  payload,
  mountComponent,
}: {
  mockedUseQuery: MockedFunction<() => UseQueryDefinedReturnType<T, BaseApiException>>
  payload: T
  mountComponent: (() => Promise<unknown>) | (() => unknown)
}) {
  describe('when a query error occurs', () => {
    it('then it should add error message to pinia toaster store', async () => {
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
  })
}

function testRoute (route: AvRoute, expectedConfig: Partial<typeof route>, expectedComponent: unknown) {
  describe(`given the route ${route.name}`, () => {
    describe('when the route is built', () => {
      it('then it should have correct route config', () => {
        expect(route).toMatchObject({ ...expectedConfig, component: expect.any(Function) })
      })

      it('then it should dynamically import the component and match it', async () => {
        const componentLoader = route.component as () => Promise<{ default: unknown }>
        const componentModule = await componentLoader()
        expect(componentModule).toBeDefined()
        expect(componentModule.default).toBe(expectedComponent)
      })
    })
  })
}

export interface TestUseMutationOptions<
  ApiFn extends (...args: any) => any,
  Variables extends Record<string, any>,
  Data = Awaited<ReturnType<ApiFn>>
> {
  mutationName: string
  mutation: (args?: any) => ReturnType<any>
  apiModulePath: string
  apiMethodName: keyof typeof import('@/api/avenir-esr')
  validVariables: Variables
  invalidVariables: Variables
  successResponse?: Data
  mockOnSuccess?: Mock
  mockOnError?: Mock
  skipInvalidateCheck?: boolean
}

/**
 * Method used for testing use mutations
 * @param options
 * @example
 * testUseMutation({
 *   mutationName: 'useUpdateProfileCoverMutation',
 *   mutation: useUpdateProfileCoverMutation,
 *   apiModulePath: '@/api/avenir-esr',
 *   apiMethodName: 'updateProfileCover',
 *   validVariables: {
 *     profile: 'student',
 *     updateProfileCoverBody: {
 *       file: new Blob(['fake content'], { type: 'image/jpeg' }),
 *     }
 *   },
 *   invalidVariables: {
 *     profile: invalidProfile,
 *     updateProfileCoverBody: {
 *       file: new Blob(['fake content'], { type: 'image/jpeg' }),
 *     }
 *   },
 *   skipInvalidateCheck: true
})
 */
export function testUseMutation<
  ApiFn extends (...args: any) => any,
  Variables extends Record<string, any>
> (options: TestUseMutationOptions<ApiFn, Variables>) {
  const {
    mutationName,
    mutation,
    apiModulePath,
    apiMethodName,
    validVariables,
    invalidVariables,
    mockOnSuccess = vi.fn(),
    mockOnError = vi.fn(),
    skipInvalidateCheck = false,
  } = options

  describe(`given ${mutationName}`, () => {
    let apiSpy: MockInstance
    let mutationResult: ReturnType<typeof mutation>

    const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
    const mockInvalidateFunction = vi.fn()
    const mutationArgs: CommonMutationArgs = {
      onSuccess: mockOnSuccess,
      onError: mockOnError
    }

    beforeEach(async () => {
      vi.clearAllMocks()
      vi.restoreAllMocks()

      const api = await import(apiModulePath)
      apiSpy = vi.spyOn(api, apiMethodName as any)

      mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    describe(`when ${mutationName} is called with valid input`, () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => mutation(mutationArgs))
        await mutationResult.mutateAsync(validVariables)
        await flushPromises()
      })

      it('then it should call API with correct params', () => {
        expect(apiSpy).toHaveBeenCalledWith(...Object.values(validVariables))
      })

      it('then it should call onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })

      if (!skipInvalidateCheck) {
        it('then it should call invalidate queries', () => {
          expect(mockInvalidateFunction).toHaveBeenCalled()
        })
      }

      it('then it should set success state', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })
    })

    describe(`when ${mutationName} is called with valid input`, () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => mutation(mutationArgs))
        await mutationResult.mutateAsync(invalidVariables).catch(() => {})
        await flushPromises()
      })

      it('then it should call API with invalid input', () => {
        expect(apiSpy).toHaveBeenCalledWith(...Object.values(invalidVariables))
      })

      it('then it should call onError callback', () => {
        expect(mockOnError).toHaveBeenCalled()
      })

      it('then it should not call onSuccess', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      it('then it should not invalidate queries on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })

      it('then it should set error state', () => {
        expect(mutationResult.isError.value).toBe(true)
      })
    })
  })
}

export {
  testRoute,
  testUseBaseApiExceptionToast
}
