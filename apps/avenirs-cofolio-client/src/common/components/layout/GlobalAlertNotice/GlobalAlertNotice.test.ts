import type { VueWrapper } from '@vue/test-utils'
import { AvNoticeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAlertMessageResponse } from '@/__mocks__/fixtures/student/back-office.fixtures'
import { alertMessageUnauthorizedHandler, createAlertMessageHandler } from '@/__mocks__/msw/handlers/student/back-office.handlers'
import { server } from '@/__mocks__/msw/server'
import GlobalAlertNotice from '@/common/components/layout/GlobalAlertNotice/GlobalAlertNotice.vue'

const FIRST_PATH = '/first-page'
const SECOND_PATH = '/second-page'

const route = reactive<{ path: string, query: Record<string, string> }>({ path: FIRST_PATH, query: {} })

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

const mockRevalidateSession = vi.fn()

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    revalidateSession: mockRevalidateSession,
  })),
}))

BddTest().given('a global alert notice', () => {
  let wrapper: VueWrapper<InstanceType<typeof GlobalAlertNotice>>
  const onAlertMessageRequest = vi.fn()

  const stubs = {
    AvNotice: AvNoticeStub
  }

  const getAlert = () => wrapper.find('[data-testid="global-alert-notice"]')
  const getNotice = () => wrapper.findComponent(AvNoticeStub)

  const mountWith = async (handler = createAlertMessageHandler(mockedAlertMessageResponse, onAlertMessageRequest)) => {
    vi.clearAllMocks()
    route.path = FIRST_PATH
    route.query = {}
    server.use(handler)

    wrapper = mountComponent<typeof GlobalAlertNotice>(GlobalAlertNotice, {
      global: { stubs }
    })

    await flushPromises()
  }

  // A mounted notice keeps watching the shared route: it must not refetch during the next tests
  afterEach(() => {
    wrapper.unmount()
  })

  BddTest().and('an alert message to display', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should fetch the alert message once', () => {
        expect(onAlertMessageRequest).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should display the message in a global alert notice', () => {
        expect(getNotice().exists()).toBe(true)
        expect(getNotice().props('type')).toBe('alert')
        expect(getNotice().props('global')).toBe(true)
        expect(getNotice().props('text')).toBe(mockedAlertMessageResponse.message)
      })
    })

    BddTest().when('the user navigates to another page', () => {
      beforeEach(async () => {
        route.path = SECOND_PATH
        await flushPromises()
      })

      BddTest().then('it should fetch the alert message again', () => {
        expect(onAlertMessageRequest).toHaveBeenCalledTimes(2)
      })
    })

    BddTest().when('only the query of the current page changes', () => {
      beforeEach(async () => {
        route.query = { page: '2' }
        await flushPromises()
      })

      BddTest().then('it should not fetch the alert message again', () => {
        expect(onAlertMessageRequest).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no alert message to display', () => {
    beforeEach(async () => {
      await mountWith(createAlertMessageHandler({ message: null as unknown as string }))
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not display any notice', () => {
        expect(getAlert().exists()).toBe(false)
        expect(getNotice().exists()).toBe(false)
      })
    })
  })

  BddTest().and('a blank alert message', () => {
    beforeEach(async () => {
      await mountWith(createAlertMessageHandler({ message: '   ' }))
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not display any notice', () => {
        expect(getAlert().exists()).toBe(false)
      })
    })
  })

  BddTest().and('the alert endpoint answers 401', () => {
    beforeEach(async () => {
      await mountWith(alertMessageUnauthorizedHandler)
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not display any notice', () => {
        expect(getAlert().exists()).toBe(false)
      })

      BddTest().then('it should not revalidate the user session', () => {
        expect(mockRevalidateSession).not.toHaveBeenCalled()
      })
    })
  })
})
