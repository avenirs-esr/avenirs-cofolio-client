import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { createTraceDetailedHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentHomeRoute, studentToolsTracesRoute } from '@/features/student/routes'
import StudentTraceView from '@/features/student/views/StudentTraceView/StudentTraceView.vue'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { BddTest, mountComponent } from 'tests/utils'

BddTest().given('a student trace view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceView>>

  const stubs = {
    PageTitle: PageTitleStub,
    TraceSettingsPopover: {
      name: 'TraceSettingsPopover',
      template: '<div class="trace-settings-popover" />'
    },
    TraceDeletionConfirmationModal: {
      name: 'TraceDeletionConfirmationModal',
      props: ['trace', 'show'],
      template: '<div class="trace-deletion-confirmation-modal" />'
    },
    UpdateTraceModal: {
      name: 'UpdateTraceModal',
      props: ['trace', 'show'],
      template: '<div class="update-trace-modal" />'
    }
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    const handler = createTraceDetailedHandler(mockedTraceDetailed)
    server.use(handler)
    wrapper = mountComponent(StudentTraceView, {
      props: { traceId: mockedTraceDetailed.id },
      global: { stubs },
      useTanstack: true,
      usePinia: true
    })

    await flushPromises()
  })

  const title = `Trace ${mockedTraceDetailed.title}`
  const breadcrumbLinks = [
    { text: 'Accueil', to: studentHomeRoute },
    { text: 'Mes outils' },
    { text: 'Mes traces', to: studentToolsTracesRoute },
    { text: mockedTraceDetailed.title }
  ]

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(breadcrumbLinks)
    })

    BddTest().then('it should render the popover', async () => {
      const popover = wrapper.findComponent({ name: 'TraceSettingsPopover' })
      expect(popover.exists()).toBe(true)
    })

    BddTest().then('it should render the TraceDeletionConfirmationModal initially hidden', async () => {
      const modal = wrapper.findComponent({ name: 'TraceDeletionConfirmationModal' })
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
    })

    BddTest().then('it should render the UpdateTraceModal initially hidden', async () => {
      const modal = wrapper.findComponent({ name: 'UpdateTraceModal' })
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
    })
  })
})
