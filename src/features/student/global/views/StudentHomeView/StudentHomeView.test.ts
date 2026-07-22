import { ActivitiesWidgetStub } from '@/features/student/global/views/StudentHomeView/components/ActivitiesWidget/ActivitiesWidget.stub'
import StudentHomeView from '@/features/student/global/views/StudentHomeView/StudentHomeView.vue'
import { StudentSkillsWidgetStub } from '@/features/student/skills/components/cards/StudentSkillsWidget/StudentSkillsWidget.stub'
import { TracesWidgetStub } from '@/features/student/traces/components/cards/TracesWidget/TracesWidget.stub'
import { StudentOverviewWidgetStub } from '@/features/student/user/components/cards/StudentOverviewWidget/StudentOverviewWidget.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a student home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentHomeView>>

  const stubs = {
    StudentOverviewWidget: StudentOverviewWidgetStub,
    StudentSkillsWidget: StudentSkillsWidgetStub,
    ActivitiesWidget: ActivitiesWidgetStub,
    TracesWidget: TracesWidgetStub,
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

      expect(main.exists()).toBe(true)
      expect(main.findComponent({ name: 'StudentSkillsWidget' }).exists()).toBe(true)

      expect(main.findAllComponents(ActivitiesWidgetStub)).toHaveLength(2)
      expect(main.findComponent(TracesWidgetStub).exists()).toBe(true)
    })
  })
})
