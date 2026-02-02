import { HomeWidgetStub } from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.stub'
import StudentEventsWidget from '@/features/student/global/views/StudentHomeView/components/StudentEventsWidget/StudentEventsWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const navigateToStudentEvents = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentEvents,
    }),
  }
})

BddTest().given('a student events widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentEventsWidget>>

  const stubs = { HomeWidget: HomeWidgetStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentEventsWidget, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should only display up to 3 events', () => {
      const richButtons = wrapper.findAll('.av-rich-button')

      expect(richButtons).toHaveLength(3)
    })
  })

  BddTest().when('clicking on the navigation button', () => {
    beforeEach(async () => {
      const btn = wrapper.find('.see-all-button')
      await btn.trigger('click')
    })

    BddTest().then('it should call navigation', async () => {
      expect(navigateToStudentEvents).toHaveBeenCalled()
    })
  })
})
