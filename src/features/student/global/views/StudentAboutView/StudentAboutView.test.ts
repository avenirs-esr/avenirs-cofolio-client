import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import StudentAboutView from '@/features/student/global/views/StudentAboutView/StudentAboutView.vue'

BddTest().given('a learner about view', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(StudentAboutView)
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render h1 properly', () => {
      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)
      expect(h1.text()).toBe('Learner feature about page')
    })
  })
})
