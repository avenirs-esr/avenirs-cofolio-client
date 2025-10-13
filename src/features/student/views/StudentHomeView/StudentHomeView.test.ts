import { StudentDeliverablesWidgetStub } from '@/features/student/components/widgets/StudentDeliverablesWidget/StudentDeliverablesWidget.stub'
import { StudentEventsWidgetStub } from '@/features/student/components/widgets/StudentEventsWidget/StudentEventsWidget.stub'
import { StudentOverviewWidgetStub } from '@/features/student/components/widgets/StudentOverviewWidget/StudentOverviewWidget.stub'
import { StudentPagesWidgetStub } from '@/features/student/components/widgets/StudentPagesWidget/StudentPagesWidget.stub'
import { StudentResumesWidgetStub } from '@/features/student/components/widgets/StudentResumesWidget/StudentResumesWidget.stub'
import { StudentSkillsWidgetStub } from '@/features/student/components/widgets/StudentSkillsWidget/StudentSkillsWidget.stub'
import { StudentTracesWidgetStub } from '@/features/student/components/widgets/StudentTracesWidget/StudentTracesWidget.stub'
import StudentHomeView from '@/features/student/views/StudentHomeView/StudentHomeView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

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
