import StudentAboutView from '@/features/student/views/StudentAboutView/StudentAboutView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

BddTest().given('a student about view', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(StudentAboutView)
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render h1 properly', () => {
      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)
      expect(h1.text()).toBe('Student feature about page')
    })
  })
})
