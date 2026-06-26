import { createTraceOverviewHandler, traceOverviewErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { HomeWidgetStub } from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.stub'
import {
  StudentTraceCardStub
} from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.stub'
import StudentTracesWidget from '@/features/student/traces/components/cards/StudentTracesWidget/StudentTracesWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('a student traces widget', async () => {
  let wrapper: VueWrapper

  const stubs = {
    HomeWidget: HomeWidgetStub,
    StudentTraceCard: StudentTraceCardStub
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    const handler = createTraceOverviewHandler()
    server.use(handler)

    wrapper = await mountWithRouter(StudentTracesWidget, {
      global: {
        stubs,
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        })
        }]],
      },
    })

    await vi.waitFor(() => {
      expect(wrapper.find('.home-main-widget').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should display up to 3 traces', () => {
      const studentTraceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
      expect(studentTraceCards).toHaveLength(3)
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(async () => {
      server.use(traceOverviewErrorHandler)
      wrapper = await mountWithRouter(StudentTracesWidget, {
        global: {
          stubs,
          plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
            },
          })
          }]],
        },
      })
      await flushPromises()
    })

    BddTest().then('it should call addErrorMessage with error toast', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })
  })
})
