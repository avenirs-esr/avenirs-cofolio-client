import { ESkillLevelStatus, type SkillLevelProgressOverviewDTO } from '@/api/avenir-esr'
import StudentLastCompletedLevelBadge from '@/features/student/skills/components/badges/StudentLastCompletedLevelBadge/StudentLastCompletedLevelBadge.vue'
import { ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

const stubs = {
  AvBadge: AvBadgeStub
}

BddTest().given('a student last completed level badge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentLastCompletedLevelBadge>>

  BddTest().when('the level status is validated', () => {
    const validatedLevel: SkillLevelProgressOverviewDTO = {
      id: '1',
      name: 'Niveau 1',
      traceCount: 0,
      activityCount: 0,
      status: ESkillLevelStatus.VALIDATED,
    }

    beforeEach(() => {
      wrapper = mount(StudentLastCompletedLevelBadge, {
        props: {
          level: validatedLevel
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render AvBadge with validated props', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Niveau 1 Validé')
      expect(badge.props('color')).toBe('var(--light-foreground-success)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
      expect(badge.props('icon')).toBe(ICONS_DATA_URL.MDI_CHECK_CIRCLE)
    })
  })

  BddTest().when('the level status is failed', () => {
    const failedLevel: SkillLevelProgressOverviewDTO = {
      id: '2',
      name: 'Niveau 2',
      traceCount: 0,
      activityCount: 0,
      status: ESkillLevelStatus.FAILED,
    }

    beforeEach(() => {
      wrapper = mount(StudentLastCompletedLevelBadge, {
        props: {
          level: failedLevel
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render AvBadge with failed props', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Niveau 2 Non validé')
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
      expect(badge.props('icon')).toBe(ICONS_DATA_URL.MDI_CLOSE_CIRCLE_OUTLINE)
    })
  })

  BddTest().when('the level status is neither validated nor failed', () => {
    const inProgressLevel: SkillLevelProgressOverviewDTO = {
      id: '3',
      name: 'Niveau 3',
      traceCount: 0,
      activityCount: 0,
      status: ESkillLevelStatus.UNDER_REVIEW,
    }

    beforeEach(() => {
      wrapper = mount(StudentLastCompletedLevelBadge, {
        props: {
          level: inProgressLevel
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not render AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(false)
    })
  })
})
