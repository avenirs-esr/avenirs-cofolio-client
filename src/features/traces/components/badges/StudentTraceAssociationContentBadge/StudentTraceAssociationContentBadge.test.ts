import type { VueWrapper } from '@vue/test-utils'
import StudentTraceAssociationContentBadge from '@/features/traces/components/badges/StudentTraceAssociationContentBadge/StudentTraceAssociationContentBadge.vue'
import { ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvBadge: {
    name: 'AvBadge',
    template: '<div class="av-badge" />',
    props: {
      label: String,
      color: String,
      backgroundColor: String,
      icon: String,
      small: Boolean,
      ellipsis: Boolean
    }
  }
}

BddTest().given('a student trace association content badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceAssociationContentBadge>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with only label prop', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationContentBadge, {
        props: {
          label: 'Test Badge Label'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render AvBadge with correct props', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Test Badge Label')
      expect(badge.props('color')).toBe('var(--light-foreground-text1)')
      expect(badge.props('backgroundColor')).toBe('var(--surface-background)')
      expect(badge.props('small')).toBe(true)
      expect(badge.props('ellipsis')).toBe(true)
    })

    BddTest().then('it should render with default icon', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.props('icon')).toBe(ICONS_DATA_URL.AMS_SAE)
    })

    BddTest().then('it should have proper styling classes', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.classes()).toContain('student-trace-association-content-badge')
      expect(badge.classes()).toContain('caption-regular')
    })
  })

  BddTest().when('the component is mounted with custom icon', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationContentBadge, {
        props: {
          label: 'Custom Icon Badge',
          icon: ICONS_DATA_URL.CLOCK_QUARTER_CHECK
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render AvBadge with custom icon', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('icon')).toBe(ICONS_DATA_URL.CLOCK_QUARTER_CHECK)
    })
  })

  BddTest().when('the component is mounted with long label text', () => {
    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAssociationContentBadge, {
        props: {
          label: 'This is a very long badge label that should be truncated with ellipsis'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should enable ellipsis on AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.props('ellipsis')).toBe(true)
    })
  })
})
