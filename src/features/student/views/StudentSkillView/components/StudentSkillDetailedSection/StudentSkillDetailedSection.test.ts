import StudentSkillDetailedSection from '@/features/student/views/StudentSkillView/components/StudentSkillDetailedSection/StudentSkillDetailedSection.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student skill detailed placeholder section', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillDetailedSection>>

  beforeEach(() => {
    wrapper = mount(StudentSkillDetailedSection)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the placeholder title', () => {
      const h3 = wrapper.find('h3')
      expect(h3.exists()).toBe(true)
      expect(h3.text()).toBe('Skill Detailed Section (placeholder)')
    })
  })
})
