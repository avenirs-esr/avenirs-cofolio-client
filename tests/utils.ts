import type { AvRoute } from '@/common/types'
import { BaseApiErrorCode, type BaseApiException } from '@/common/exceptions'
import { i18n } from '@/plugins/vue-i18n/vue-i18n'
import { QueryClient, type QueryClientConfig, type UseQueryDefinedReturnType, VueQueryPlugin } from '@tanstack/vue-query'
import { type ComponentMountingOptions, flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { describe, expect, it, type MockedFunction } from 'vitest'
import { type Component, createApp } from 'vue'
import { createMockQueryError } from './mocks'

interface MountComposableOptions {
  useTanstack?: boolean
  useI18n?: boolean
  queryClientConfig?: QueryClientConfig
}

function mountComposable<T> (fn: () => T, { useTanstack = false, useI18n = false, queryClientConfig = {} }: MountComposableOptions): T {
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
  const queryClient = new QueryClient(queryClientConfig)
  if (useTanstack) {
    app.use(VueQueryPlugin, { queryClient })
  }
  app.mount(document.createElement('div'))
  return composableResult as T
}

function mountQueryComposable<T> (fn: () => T, queryClientConfig?: QueryClientConfig): T {
  return mountComposable(fn, { useTanstack: true, queryClientConfig })
}

async function mountWithRouter<T> (component: Component, options?: ComponentMountingOptions<T>) {
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
  mountComposable,
  mountQueryComposable,
  mountWithRouter,
  testRoute,
  testUseBaseApiExceptionToast
}
