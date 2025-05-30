import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TeacherHomeView from './TeacherHomeView.vue'

describe('teacherHomeView', () => {
  it('should display the page', () => {
    const wrapper = mount(TeacherHomeView)
    const title = wrapper.find('h1')
    expect(title.text()).toBe('Teacher feature home page')
  })
})
