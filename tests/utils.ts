import type { AvRoute } from '@/common/types'
import type { CommonMutationArgs } from '@/features/student/queries/types'
import type { Component, Plugin } from 'vue'
import { useInvalidateQuery } from '@/common/composables'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { mountQueryComposable } from '@/ui/tests/utils'
import { QueryClient, type QueryClientConfig, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMockQueryError, mockAddErrorMessage } from 'tests/mocks'
import { describe, expect, it, type Mock, type MockedFunction, type MockInstance } from 'vitest'

/**
 * Function allowing developpers to use a common BDD format for tests
 * @returns given (describe), when (describe) and then (it)
 */
export function BddTest () {
  return {
    given (description: string, fn: () => void) {
      describe(`🔵 GIVEN ${description}`, fn)
      return this
    },
    when (description: string, fn: () => void) {
      describe(`🔶 WHEN ${description}`, fn)
      return this
    },
    and (description: string, fn: () => void) {
      describe(`➕ AND ${description}`, fn)
      return this
    },
    then (description: string, fn: () => void) {
      it(`🟩 THEN ${description}`, fn)
      return this
    },
  }
}

/**
 * Options to configure the mounting of a component under test.
 */
interface MountComponentOptions {
  /**
   * Enables the use of TanStack Query.
   * @default true
   */
  useTanstack?: boolean

  /**
   * Enables the use of Pinia for the store.
   * @default true
   */
  usePinia?: boolean

  /**
   * Custom QueryClient configuration for TanStack Query.
   */
  queryClientConfig?: QueryClientConfig
}

/**
 * Mounts a Vue component with common testing configuration (i18n, Pinia, TanStack Query).
 *
 */
function mountComponent<T extends Component> (
  component: T,
  mountOptions?: ComponentMountingOptions<T>,
  {
    useTanstack = true,
    usePinia = true,
    queryClientConfig = { defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }
  }: MountComponentOptions = {}
) {
  const plugins: (Plugin | [Plugin, ...unknown[]])[] = []

  if (usePinia) {
    const pinia = createPinia()
    setActivePinia(pinia)
    plugins.push(pinia)
  }

  if (useTanstack) {
    const queryClient = new QueryClient(queryClientConfig)
    plugins.push([VueQueryPlugin, { queryClient }])
  }

  return mount(component, {
    ...mountOptions,
    global: {
      ...(mountOptions?.global ?? {}),
      plugins: [
        ...(mountOptions?.global?.plugins ?? []),
        ...plugins
      ]
    }
  })
}

export function testUseBaseApiExceptionToast<T> ({
  mockedUseQuery,
  payload,
  mountComponent,
}: {
  mockedUseQuery: MockedFunction<() => UseQueryDefinedReturnType<T, BaseApiException>>
  payload: T
  mountComponent: (() => Promise<unknown>) | (() => unknown)
}) {
  BddTest().when('a query error occurs', () => {
    BddTest().then('it should add error message to pinia toaster store', async () => {
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

export function testRoute (route: AvRoute, expectedConfig: Partial<typeof route>, expectedComponent: unknown) {
  describe(`given the route ${route.name}`, () => {
    BddTest().when('the route is built', () => {
      BddTest().then('it should have correct route config', () => {
        expect(route).toMatchObject({ ...expectedConfig, component: expect.any(Function) })
      })

      BddTest().then('it should dynamically import the component and match it', async () => {
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

      BddTest().then('it should call API with correct params', () => {
        expect(apiSpy).toHaveBeenCalledWith(...Object.values(validVariables))
      })

      BddTest().then('it should call onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })

      if (!skipInvalidateCheck) {
        BddTest().then('it should call invalidate queries', () => {
          expect(mockInvalidateFunction).toHaveBeenCalled()
        })
      }

      BddTest().then('it should set success state', () => {
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

      BddTest().then('it should call API with invalid input', () => {
        expect(apiSpy).toHaveBeenCalledWith(...Object.values(invalidVariables))
      })

      BddTest().then('it should call onError callback', () => {
        expect(mockOnError).toHaveBeenCalled()
      })

      BddTest().then('it should not call onSuccess', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      BddTest().then('it should not invalidate queries on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })

      BddTest().then('it should set error state', () => {
        expect(mutationResult.isError.value).toBe(true)
      })
    })
  })
}

export {
  mountComponent
}
