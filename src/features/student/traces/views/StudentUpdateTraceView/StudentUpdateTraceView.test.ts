import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createTraceDetailedHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants'
import { UpdateTabsStub } from '@/features/student/traces/views/StudentUpdateTraceView/components/UpdateTabs/UpdateTabs.stub'
import StudentUpdateTraceView from '@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'
import { AvCancelConfirmButtonsStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { useRoute } from 'vue-router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const mockedUseRoute = vi.mocked(useRoute)

let routeName: string

const mockNavigateToStudentTraces = vi.fn()
const mockNavigateToStudentToolsTraces = vi.fn()
const mockNavigateToStudentHome = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentHome: mockNavigateToStudentHome,
      navigateToStudentTraces: mockNavigateToStudentTraces,
      navigateToStudentToolsTraces: mockNavigateToStudentToolsTraces,
    }),
  }
})

vi.mock(
  '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form',
  () => ({
    useUpdateTraceForm: () => ({
      form: {},
      hasErrors: ref(false),
    }),
  }),
)

BddTest().given('a student update trace view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentUpdateTraceView>>

  beforeEach(async () => {
    vi.clearAllMocks()

    routeName = ROUTES.STUDENT.UPDATE_TRACE.name

    mockedUseRoute.mockReturnValue({
      get name () {
        return routeName
      },
    } as ReturnType<typeof useRoute>)

    const handler = createTraceDetailedHandler(mockedTraceDetailed)
    server.use(handler)

    const stubs = {
      UpdatePageTitle: UpdatePageTitleStub,
      AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
      UpdateTabs: UpdateTabsStub,
    }

    wrapper = mountComponent(StudentUpdateTraceView, {
      props: {
        traceId: mockedTraceDetailed.id,
      },
      global: { stubs },
      useTanstack: true,
      usePinia: true,
    })

    await flushPromises()
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render the trace title', () => {
      const pageTitle = wrapper.findComponent(UpdatePageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe(mockedTraceDetailed.title)
    })

    BddTest().then('it should render UpdateTabs', () => {
      expect(wrapper.findComponent(UpdateTabsStub).exists()).toBe(true)
    })

    BddTest().then('it should render cancel confirm buttons', () => {
      expect(wrapper.findComponent(AvCancelConfirmButtonsStub).exists()).toBe(true)
    })
  })

  BddTest().when('the close button is clicked', () => {
    beforeEach(async () => {
      const cancelConfirmButtons = wrapper.findComponent(AvCancelConfirmButtonsStub)

      await cancelConfirmButtons.vm.$emit('cancel')
      await flushPromises()
    })

    BddTest().then('it should navigate to home page', () => {
      expect(mockNavigateToStudentHome).toHaveBeenCalled()
    })
  })
})
