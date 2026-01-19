import DeclaredProgramAssociations
  from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramAssociations/DeclaredProgramAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared program detailed placeholder section', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramAssociations>>

  beforeEach(() => {
    wrapper = mount(DeclaredProgramAssociations)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the placeholder title', () => {
      const h3 = wrapper.find('h3')
      expect(h3.exists()).toBe(true)
      expect(h3.text()).toBe('Declared Program Associations Section (placeholder)')
    })
  })
})
