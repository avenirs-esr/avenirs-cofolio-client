import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { TutorialStub } from '@/common/components/overlay/tooltips/Tutorial/Tutorial.stub'
import { ROUTES } from '@/common/constants'
import { ActivitiesWidgetStub } from '@/features/student/global/views/StudentHomeView/components/ActivitiesWidget/ActivitiesWidget.stub'
import StudentHomeView from '@/features/student/global/views/StudentHomeView/StudentHomeView.vue'
import { TracesWidgetStub } from '@/features/student/traces/components/cards/TracesWidget/TracesWidget.stub'
import { StudentOverviewWidgetStub } from '@/features/student/user/components/cards/StudentOverviewWidget/StudentOverviewWidget.stub'

const mockInaccessibleRoutes = ref<{ name: string }[]>([])

vi.mock('@/common/utils/route/access/route-access', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/route/access/route-access')>()
  return {
    ...actual,
    canAccessRoute: (route: { name: string }) => !mockInaccessibleRoutes.value.some(({ name }) => name === route.name)
  }
})

BddTest().given('a student home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentHomeView>>

  const stubs = {
    StudentOverviewWidget: StudentOverviewWidgetStub,
    ActivitiesWidget: ActivitiesWidgetStub,
    TracesWidget: TracesWidgetStub,
    Tutorial: TutorialStub,
  }

  const mountWith = async (inaccessibleRoutes: { name: string }[] = []) => {
    vi.clearAllMocks()
    mockInaccessibleRoutes.value = inaccessibleRoutes

    wrapper = mount(StudentHomeView, { global: { stubs } })
    await wrapper.vm.$nextTick()
  }

  const getActivitiesWidgets = () => wrapper.findAllComponents(ActivitiesWidgetStub)
  const getStudentOverviewWidget = () => wrapper.findComponent(StudentOverviewWidgetStub)
  const getTracesWidget = () => wrapper.findComponent(TracesWidgetStub)
  const getTutorial = () => wrapper.findComponent(TutorialStub)
  const getSideBar = () => wrapper.find('.layout-home__sidebar')
  const getMain = () => wrapper.find('.layout-home__main')

  BddTest().when('the view is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render all expected widgets in the correct layout', () => {
      expect(getSideBar().exists()).toBe(true)
      expect(getStudentOverviewWidget().exists()).toBe(true)
      expect(getMain().exists()).toBe(true)
      expect(getActivitiesWidgets()).toHaveLength(2)
      expect(getTracesWidget().exists()).toBe(true)
    })

    BddTest().then('it should render the Tutorial component', () => {
      expect(getTutorial().exists()).toBe(true)
    })
  })

  BddTest().when('the user cannot access the activities page', () => {
    beforeEach(async () => {
      await mountWith([ROUTES.STUDENT.ACTIVITIES])
    })

    BddTest().then('it should not render the activities widgets', () => {
      expect(getActivitiesWidgets()).toHaveLength(0)
      expect(getTracesWidget().exists()).toBe(true)
    })
  })

  BddTest().when('the user cannot access the traces page', () => {
    beforeEach(async () => {
      await mountWith([ROUTES.STUDENT.TOOLS_TRACES])
    })

    BddTest().then('it should not render the traces widget', () => {
      expect(getTracesWidget().exists()).toBe(false)
      expect(getActivitiesWidgets()).toHaveLength(2)
    })
  })
})
