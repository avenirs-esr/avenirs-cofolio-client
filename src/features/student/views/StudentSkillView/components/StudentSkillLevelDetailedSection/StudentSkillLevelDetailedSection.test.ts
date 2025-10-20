import StudentSkillLevelDetailedSection from '@/features/student/views/StudentSkillView/components/StudentSkillLevelDetailedSection/StudentSkillLevelDetailedSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student skill level detailed placeholder section', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillLevelDetailedSection>>

  beforeEach(() => {
    wrapper = mount(StudentSkillLevelDetailedSection)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the placeholder title', () => {
      const h3 = wrapper.find('h3')
      expect(h3.exists()).toBe(true)
      expect(h3.text()).toBe('Skill level detailed Section (placeholder)')
    })
  })
})
