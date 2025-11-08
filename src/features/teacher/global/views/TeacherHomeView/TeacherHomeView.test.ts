import TeacherHomeView from '@/features/teacher/global/views/TeacherHomeView/TeacherHomeView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a teacher home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof TeacherHomeView>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(TeacherHomeView)
    })

    BddTest().then('it should display the page', () => {
      const title = wrapper.find('h1')
      expect(title.text()).toBe('Teacher feature home page')
    })
  })
})
