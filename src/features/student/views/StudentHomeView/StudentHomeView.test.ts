import StudentHomeView from '@/features/student/views/StudentHomeView/StudentHomeView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { StudentDeliverablesWidgetStub } from './components/StudentDeliverablesWidget/StudentDeliverablesWidget.stub'
import { StudentEventsWidgetStub } from './components/StudentEventsWidget/StudentEventsWidget.stub'
import { StudentOverviewWidgetStub } from './components/StudentOverviewWidget/StudentOverviewWidget.stub'
import { StudentPagesWidgetStub } from './components/StudentPagesWidget/StudentPagesWidget.stub'
import { StudentResumesWidgetStub } from './components/StudentResumesWidget/StudentResumesWidget.stub'
import { StudentSkillsWidgetStub } from './components/StudentSkillsWidget/StudentSkillsWidget.stub'
import { StudentTracesWidgetStub } from './components/StudentTracesWidget/StudentTracesWidget.stub'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

BddTest().given('a student home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentHomeView>>

  const stubs = {
    StudentDeliverablesWidget: StudentDeliverablesWidgetStub,
    StudentEventsWidget: StudentEventsWidgetStub,
    StudentOverviewWidget: StudentOverviewWidgetStub,
    StudentPagesWidget: StudentPagesWidgetStub,
    StudentResumesWidget: StudentResumesWidgetStub,
    StudentSkillsWidget: StudentSkillsWidgetStub,
    StudentTracesWidget: StudentTracesWidgetStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentHomeView, { global: { stubs } })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render all expected widgets in the correct layout', () => {
      const sidebar = wrapper.find('.layout-home__sidebar')
      const main = wrapper.find('.layout-home__main')

      expect(sidebar.exists()).toBe(true)
      expect(sidebar.findComponent({ name: 'StudentOverviewWidget' }).exists()).toBe(true)
      expect(sidebar.findComponent({ name: 'StudentEventsWidget' }).exists()).toBe(true)
      expect(sidebar.findComponent({ name: 'StudentResumesWidget' }).exists()).toBe(true)
      expect(sidebar.findComponent({ name: 'StudentPagesWidget' }).exists()).toBe(true)

      expect(main.exists()).toBe(true)
      expect(main.findComponent({ name: 'StudentSkillsWidget' }).exists()).toBe(true)
      expect(main.findComponent({ name: 'StudentDeliverablesWidget' }).exists()).toBe(true)
      expect(main.findComponent({ name: 'StudentTracesWidget' }).exists()).toBe(true)
    })
  })

  BddTest().then('it should not render the mobile containers', () => {
    expect(wrapper.find('.layout-home--mobile').exists()).toBe(false)
  })

  BddTest().and('is in mobile view', () => {
    beforeEach(() => {
      mockIsMobile.value = true
    })

    BddTest().then('it should render the mobile containers', () => {
      expect(wrapper.find('.layout-home--mobile').exists()).toBe(true)
    })
  })
})
