import { type SkillLevelProgressOverviewDTO, SkillLevelStatus } from '@/api/avenir-esr'
import { mount, type VueWrapper } from '@vue/test-utils'
import StudentLastCompletedLevelBadge from './StudentLastCompletedLevelBadge.vue'

const stubs = {
  AvBadge: {
    name: 'AvBadge',
    props: ['label', 'color', 'backgroundColor', 'iconPath', 'small', 'ellipsis'],
    template: '<div class="av-badge-stub" />'
  }
}

describe('studentLastCompletedLevelBadge', () => {
  describe('given a student last completed level badge component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentLastCompletedLevelBadge>>

    describe('when the level status is validated', () => {
      const validatedLevel: SkillLevelProgressOverviewDTO = {
        id: '1',
        name: 'Niveau 1',
        traceCount: 0,
        activityCount: 0,
        status: SkillLevelStatus.VALIDATED,
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

      it('then it should render AvBadge with validated props', () => {
        const badge = wrapper.findComponent({ name: 'AvBadge' })

        expect(badge.exists()).toBe(true)
        expect(badge.props('label')).toBe('Niveau 1 Validé')
        expect(badge.props('color')).toBe('var(--light-foreground-success)')
        expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
        expect(badge.props('iconPath')).toContain('check-circle.svg')
      })
    })

    describe('when the level status is failed', () => {
      const failedLevel: SkillLevelProgressOverviewDTO = {
        id: '2',
        name: 'Niveau 2',
        traceCount: 0,
        activityCount: 0,
        status: SkillLevelStatus.FAILED,
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

      it('then it should render AvBadge with failed props', () => {
        const badge = wrapper.findComponent({ name: 'AvBadge' })

        expect(badge.exists()).toBe(true)
        expect(badge.props('label')).toBe('Niveau 2 Non validé')
        expect(badge.props('color')).toBe('var(--light-foreground-error)')
        expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
        expect(badge.props('iconPath')).toContain('close-circle-outline.svg')
      })
    })

    describe('when the level status is neither validated nor failed', () => {
      const inProgressLevel: SkillLevelProgressOverviewDTO = {
        id: '3',
        name: 'Niveau 3',
        traceCount: 0,
        activityCount: 0,
        status: SkillLevelStatus.UNDER_REVIEW,
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

      it('then it should not render AvBadge', () => {
        const badge = wrapper.findComponent({ name: 'AvBadge' })

        expect(badge.exists()).toBe(false)
      })
    })
  })
})
