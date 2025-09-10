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
      const leftContainer = wrapper.find('.student-home-left-container')
      const rightContainer = wrapper.find('.student-home-right-container')

      expect(leftContainer.exists()).toBe(true)
      expect(leftContainer.findComponent({ name: 'StudentOverviewWidget' }).exists()).toBe(true)
      expect(leftContainer.findComponent({ name: 'StudentEventsWidget' }).exists()).toBe(true)
      expect(leftContainer.findComponent({ name: 'StudentResumesWidget' }).exists()).toBe(true)
      expect(leftContainer.findComponent({ name: 'StudentPagesWidget' }).exists()).toBe(true)

      expect(rightContainer.exists()).toBe(true)
      expect(rightContainer.findComponent({ name: 'StudentSkillsWidget' }).exists()).toBe(true)
      expect(rightContainer.findComponent({ name: 'StudentDeliverablesWidget' }).exists()).toBe(true)
      expect(rightContainer.findComponent({ name: 'StudentTracesWidget' }).exists()).toBe(true)
    })
  })
})
