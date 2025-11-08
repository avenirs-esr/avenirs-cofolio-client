import type { AvRoute } from '@/common/types'
import type { CommonMutationArgs } from '@/types'
import { useInvalidateQuery } from '@/common/composables/use-invalidate-query/use-invalidate-query'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { i18n } from '@/plugins/vue-i18n/vue-i18n'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, type QueryClientConfig, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMockQueryError, mockAddErrorMessage } from 'tests/mocks'
import { describe, expect, type Mock, type MockedFunction, type MockInstance } from 'vitest'
import { type Component, createApp, type Plugin } from 'vue'

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
export function mountComponent<T extends Component> (
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

/**
 * Options to configure the mounting of a composable under test.
 */
interface MountComposableOptions {
  /**
   * Enables the use of TanStack Query.
   * @default false
   */
  useTanstack?: boolean

  /**
   * Enables the i18n plugin configuration.
   * @default false
   */
  useI18n?: boolean

  /**
   * Enables the use of Pinia for the store.
   * @default false
   */
  usePinia?: boolean

  /**
   * Custom QueryClient configuration for TanStack Query.
   */
  queryClientConfig?: QueryClientConfig
}

/**
 * Mounts a Vue composable for testing with configuration options.
 *
 * @template T
 * @param {() => T} fn - Composable function to execute and mount.
 * @param {MountComposableOptions} options - Options to configure the mount.
 * @param {boolean} [options.useTanstack] - Enables the use of TanStack Query.
 * @param {boolean} [options.useI18n] - Enables the use of the i18n plugin.
 * @param {boolean} [options.usePinia] - Enables the use of Pinia for the store.
 * @param {QueryClientConfig} [options.queryClientConfig] - Custom configuration of TanStack Query QueryClient.
 * @returns {{ result: T, unmount: () => void }} An object containing the result of the composable and a function to unmount the application.
 */
export function mountComposable<T> (fn: () => T, { useTanstack = false, useI18n = false, usePinia = false, queryClientConfig = {} }: MountComposableOptions): { result: T, unmount: () => void } {
  let composableResult: T | undefined
  const app = createApp({
    setup () {
      composableResult = fn()
      return () => null
    }
  })
  if (useI18n) {
    app.use(i18n)
  }
  if (usePinia) {
    const pinia = createPinia()
    setActivePinia(pinia)
    app.use(pinia)
  }
  const queryClient = new QueryClient(queryClientConfig)
  if (useTanstack) {
    app.use(VueQueryPlugin, { queryClient })
  }
  app.mount(document.createElement('div'))

  return {
    result: composableResult as T,
    unmount: () => app.unmount()
  }
}

/**
 * Mounts a Vue composable configured to use TanStack Query in tests.
 *
 * @template T
 * @param {() => T} fn - Composable function to execute and mount.
 * @param {QueryClientConfig} [queryClientConfig] - Custom configuration of TanStack Query QueryClient.
 * @returns {T} The result returned by the mounted composable.
 */
export function mountQueryComposable<T> (fn: () => T, queryClientConfig?: QueryClientConfig): T {
  const { result } = mountComposable(fn, { useTanstack: true, queryClientConfig })
  return result
}

/**
 * Mounts a Vue component with a mock router for testing.
 *
 * This function uses Vue Test Utils to mount the component by injecting
 * stubs for `RouterLink` and `RouterView` to simulate the router behavior
 * without launching a real instance.
 *
 * @template T
 * @param {Component} component - Vue component to mount.
 * @param {ComponentMountingOptions<T>} [options] - Additional options for mounting the component.
 * @returns {Promise<ReturnType<typeof mount>>} The mounted component wrapper, after the next tick.
 */
export async function mountWithRouter<T> (component: Component, options?: ComponentMountingOptions<T>) {
  const wrapper = mount(component, {
    ...options,
    global: {
      ...(options?.global ?? {}),
      stubs: {
        RouterLink: RouterLinkStub,
        RouterView: {
          name: 'RouterView',
          template: '<div class="router-view-stub"><slot /></div>'
        },
        ...(options?.global?.stubs ?? {})
      },
    },
  })

  await wrapper.vm.$nextTick()
  return wrapper
}
