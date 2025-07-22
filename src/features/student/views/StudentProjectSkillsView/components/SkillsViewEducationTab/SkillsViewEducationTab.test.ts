import SkillsViewEducationTab from '@/features/student/views/StudentProjectSkillsView/components/SkillsViewEducationTab/SkillsViewEducationTab.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('skillsViewEducationTab', () => {
  describe('given a skills view education tab component', () => {
    let wrapper: ReturnType<typeof mount<typeof SkillsViewEducationTab>>

    beforeEach(() => {
      wrapper = mount<typeof SkillsViewEducationTab>(SkillsViewEducationTab)
    })

    describe('when the component is mounted', () => {
      it('then it should render the main container', () => {
        const container = wrapper.find('.main-container')
        expect(container.exists()).toBe(true)
      })

      it('then it should render the title container and the title', () => {
        const container = wrapper.find('.title-container')
        expect(container.exists()).toBe(true)
        const title = container.find('.n5')
        expect(title.exists()).toBe(true)
        expect(title.text()).toContain('Les compétences de mes formations')
        const subtitle = title.find('.b1-regular')
        expect(subtitle.exists()).toBe(true)
        expect(subtitle.text()).toContain('(validées et en cours)')
      })

      it('then it should render the skills container', () => {
        const container = wrapper.find('.skills-container')
        expect(container.exists()).toBe(true)
      })
    })
  })
})
