import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createTraceDetailedHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { ROUTES } from '@/common/constants'
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
      DetailedPageTitle: DetailedPageTitleStub,
      AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
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
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe(mockedTraceDetailed.title)
    })

    BddTest().then('it should render the stepper', () => {
      expect(wrapper.findComponent({ name: 'AvStepper' }).exists()).toBe(true)
    })

    BddTest().then('it should render TermsStep by default', () => {
      expect(wrapper.findComponent({ name: 'TermsStep' }).exists()).toBe(true)
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
