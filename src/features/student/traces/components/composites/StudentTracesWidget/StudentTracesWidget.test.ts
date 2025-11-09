import { createTraceOverviewHandler, traceOverviewErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  StudentTraceCardStub
} from '@/features/student/traces/components/cards/StudentTraceCard/StudentTraceCard.stub'
import StudentTracesWidget from '@/features/student/traces/components/composites/StudentTracesWidget/StudentTracesWidget.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentTraces = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentTraces,
    }),
  }
})

BddTest().given('a student traces widget', async () => {
  let wrapper: VueWrapper

  const stubs = {
    AvButton: AvButtonStub,
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
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should display up to 3 traces', async () => {
      await vi.waitFor(() => {
        const studentTraceCards = wrapper.findAllComponents({ name: 'StudentTraceCard' })
        expect(studentTraceCards).toHaveLength(3)
      })
    })
  })

  BddTest().when('clicking the navigation button', () => {
    BddTest().then('it should call navigation', async () => {
      const btn = wrapper.findComponent({ name: 'AvButton' })
      await btn.trigger('click')

      expect(navigateToStudentTraces).toHaveBeenCalled()
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
