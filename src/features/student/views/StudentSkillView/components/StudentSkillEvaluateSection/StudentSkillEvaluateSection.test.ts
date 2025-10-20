import StudentSkillEvaluateSection from '@/features/student/views/StudentSkillView/components/StudentSkillEvaluateSection/StudentSkillEvaluateSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student skill evaluate placeholder section', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillEvaluateSection>>

  beforeEach(() => {
    wrapper = mount(StudentSkillEvaluateSection)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the placeholder title', () => {
      const h3 = wrapper.find('h3')
      expect(h3.exists()).toBe(true)
      expect(h3.text()).toBe('Skill Evaluate Section (placeholder)')
    })
  })
})
