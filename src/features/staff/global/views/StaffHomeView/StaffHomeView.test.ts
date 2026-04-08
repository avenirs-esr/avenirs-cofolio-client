import StaffHomeView from '@/features/staff/global/views/StaffHomeView/StaffHomeView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffHomeView>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(StaffHomeView)
    })

    BddTest().then('it should display the page', () => {
      const title = wrapper.find('h1')
      expect(title.text()).toBe('Staff feature home page')
    })
  })
})
