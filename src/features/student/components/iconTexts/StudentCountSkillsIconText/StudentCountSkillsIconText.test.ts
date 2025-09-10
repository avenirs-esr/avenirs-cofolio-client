import StudentCountSkillsIconText from '@/features/student/components/iconTexts/StudentCountSkillsIconText/StudentCountSkillsIconText.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach } from 'vitest'

BddTest().given('a student count skills icon text', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentCountSkillsIconText>>

  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['text']
    },
  }

  BddTest().when('countSkills equals 0', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountSkillsIconText, {
        props: { countSkills: 0 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render none version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('0 compétence')
    })
  })

  BddTest().when('countSkills equals 1', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountSkillsIconText, {
        props: { countSkills: 1 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render singular version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('1 compétence')
    })
  })

  BddTest().when('countSkills is greater than 1', () => {
    beforeEach(() => {
      wrapper = mount(StudentCountSkillsIconText, {
        props: { countSkills: 2 },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render pluaral version of text', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('2 compétences')
    })
  })
})
