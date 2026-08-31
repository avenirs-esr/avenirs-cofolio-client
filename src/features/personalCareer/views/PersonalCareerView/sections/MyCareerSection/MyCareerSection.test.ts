import MyCareerSection from '@/features/personalCareer/views/PersonalCareerView/sections/MyCareerSection/MyCareerSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a careers section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyCareerSection>>

  beforeEach(() => {
    wrapper = mount(MyCareerSection)
  })

  BddTest().when('the careers section is mounted', () => {
    BddTest().then('it should render the careers title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Mon parcours')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
