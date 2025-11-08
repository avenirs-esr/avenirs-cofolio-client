import AdditionalSkillTypeBadge from '@/features/student/components/additionalSkills/badges/AdditionalSkillTypeBadge/AdditionalSkillTypeBadge.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const stubs = {
  AvBadge: {
    name: 'AvBadge',
    props: ['label', 'color', 'borderColor', 'backgroundColor'],
    template: '<div class="av-badge-stub" :style="{ backgroundColor, borderColor, color }">{{ label }}</div>'
  }
}

BddTest().given('an additional skill type badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdditionalSkillTypeBadge>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(AdditionalSkillTypeBadge, {
      props: {
        label: 'ROME 4.0',
        backgroundColor: 'var(--dark-background-primary1)'
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render AvBadge with correct props', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('ROME 4.0')
      expect(badge.props('color')).toBe('white')
      expect(badge.props('borderColor')).toBe('var(--dark-background-primary1)')
      expect(badge.props('backgroundColor')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should apply additional-skill-type-badge class', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.classes()).toContain('additional-skill-type-badge')
    })
  })

  BddTest().when('different props are provided', () => {
    BddTest().then('it should render with custom label and background color', async () => {
      await wrapper.setProps({
        label: 'Custom Type',
        backgroundColor: '#ff6b6b'
      })

      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.props('label')).toBe('Custom Type')
      expect(badge.props('backgroundColor')).toBe('#ff6b6b')
      expect(badge.props('borderColor')).toBe('#ff6b6b')
    })

    BddTest().then('it should maintain white text color regardless of background', async () => {
      await wrapper.setProps({
        label: 'Test Label',
        backgroundColor: '#000000'
      })

      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.props('color')).toBe('white')
    })
  })
})
