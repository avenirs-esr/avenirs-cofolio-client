import type { VueWrapper } from '@vue/test-utils'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { ESkillLevel } from '@/api/avenir-esr'
import DeclaredSkillLevelBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.vue'

const stubs = {
  AvBadge: AvBadgeStub
}

BddTest().given('a declared skill level badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillLevelBadge>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with BEGINNER level', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.BEGINNER
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should render AvBadge with BEGINNER configuration', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ESkillLevel.BEGINNER)
      expect(badge.props('backgroundColor')).toBe('var(--light-background-primary3)')
      expect(badge.props('color')).toBe('var(--dark-background-primary3)')
      expect(badge.props('icon')).toBeDefined()
      expect(badge.props('small')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with INTERMEDIATE level', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.INTERMEDIATE
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should render AvBadge with INTERMEDIATE configuration', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ESkillLevel.INTERMEDIATE)
      expect(badge.props('backgroundColor')).toBe('var(--light-background-info)')
      expect(badge.props('color')).toBe('var(--dark-background-info)')
      expect(badge.props('icon')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with COMPETENT level', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.COMPETENT
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should render AvBadge with COMPETENT configuration', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ESkillLevel.COMPETENT)
      expect(badge.props('backgroundColor')).toBe('var(--light-background-critical)')
      expect(badge.props('color')).toBe('var(--light-foreground-critical)')
      expect(badge.props('icon')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with ADVANCED level', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.ADVANCED
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should render AvBadge with ADVANCED configuration', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ESkillLevel.ADVANCED)
      expect(badge.props('backgroundColor')).toBe('var(--light-background-primary2)')
      expect(badge.props('color')).toBe('var(--dark-background-primary2)')
      expect(badge.props('icon')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with EXPERT level', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.EXPERT
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should render AvBadge with EXPERT configuration', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ESkillLevel.EXPERT)
      expect(badge.props('backgroundColor')).toBe('var(--light-background-primary1)')
      expect(badge.props('color')).toBe('var(--light-foreground-primary2)')
      expect(badge.props('icon')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with small prop set to true', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.BEGINNER,
          small: true
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should pass small prop to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('small')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with small prop set to false', () => {
    beforeEach(async () => {
      wrapper = mountComponent(DeclaredSkillLevelBadge, {
        props: {
          level: ESkillLevel.EXPERT,
          small: false
        },
        global: {
          stubs
        }
      })
      await vi.waitFor(() => {
        expect(wrapper.findComponent({ name: 'AvBadge' }).exists()).toBe(true)
      })
    })

    BddTest().then('it should pass small prop as false to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('small')).toBe(false)
    })
  })
})
