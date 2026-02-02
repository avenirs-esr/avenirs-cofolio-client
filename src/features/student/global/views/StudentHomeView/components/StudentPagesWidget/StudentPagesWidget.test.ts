import { HomeWidgetStub } from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.stub'
import StudentPagesWidget from '@/features/student/global/views/StudentHomeView/components/StudentPagesWidget/StudentPagesWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const navigateToStudentPages = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentPages,
    }),
  }
})

BddTest().given('a student pages widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentPagesWidget>>

  const stubs = { HomeWidget: HomeWidgetStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentPagesWidget, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should only display up to 3 pages', () => {
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
      expect(navigateToStudentPages).toHaveBeenCalled()
    })
  })
})
