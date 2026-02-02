import { HomeWidgetStub } from '@/features/student/global/views/StudentHomeView/components/HomeWidget/HomeWidget.stub'
import StudentDeliverablesWidget from '@/features/student/global/views/StudentHomeView/components/StudentDeliverablesWidget/StudentDeliverablesWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { beforeEach, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const navigateToStudentDeliverables = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentDeliverables,
    }),
  }
})

BddTest().given('a student deliverables widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDeliverablesWidget>>

  const stubs = { HomeWidget: HomeWidgetStub }

  beforeEach(async () => {
    wrapper = mount(StudentDeliverablesWidget, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should only display up to 3 deliverables', () => {
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
      expect(navigateToStudentDeliverables).toHaveBeenCalled()
    })
  })
})
