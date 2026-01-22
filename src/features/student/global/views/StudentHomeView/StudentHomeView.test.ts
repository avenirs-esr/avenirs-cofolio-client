import { StudentDeliverablesWidgetStub } from '@/features/student/global/views/StudentHomeView/components/StudentDeliverablesWidget/StudentDeliverablesWidget.stub'
import { StudentEventsWidgetStub } from '@/features/student/global/views/StudentHomeView/components/StudentEventsWidget/StudentEventsWidget.stub'
import { StudentPagesWidgetStub } from '@/features/student/global/views/StudentHomeView/components/StudentPagesWidget/StudentPagesWidget.stub'
import { StudentResumesWidgetStub } from '@/features/student/global/views/StudentHomeView/components/StudentResumesWidget/StudentResumesWidget.stub'
import StudentHomeView from '@/features/student/global/views/StudentHomeView/StudentHomeView.vue'
import { StudentSkillsWidgetStub } from '@/features/student/skills'
import { StudentTracesWidgetStub } from '@/features/student/traces'
import { StudentOverviewWidgetStub } from '@/features/student/user'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

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
})
