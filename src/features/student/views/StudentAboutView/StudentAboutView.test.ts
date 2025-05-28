import { mount } from '@vue/test-utils'
import StudentAboutView from './StudentAboutView.vue'

describe('studentAboutView', () => {
  it('should render h1 properly', () => {
    const wrapper = mount(StudentAboutView)
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Student feature about page')
  })
})
