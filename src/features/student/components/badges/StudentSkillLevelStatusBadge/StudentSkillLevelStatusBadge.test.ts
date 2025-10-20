import { ESkillLevelStatus } from '@/api/avenir-esr'
import StudentSkillLevelStatusBadge from '@/features/student/components/badges/StudentSkillLevelStatusBadge/StudentSkillLevelStatusBadge.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a studentLevelBadge', () => {
  let wrapper: VueWrapper

  const basePath = import.meta.env.BASE_URL
  const stubs = {
    AvBadge: {
      name: 'AvBadge',
      template: `<div class="av-badge"/>`,
      props: {
        label: String,
        small: {
          type: Boolean,
          default: false
        },
        ellipsis: {
          type: Boolean,
          default: false
        },
        color: String,
        backgroundColor: String,
        iconPath: String
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with FAILED status', () => {
    beforeEach(() => {
      wrapper = mount(StudentSkillLevelStatusBadge, {
        props: { status: ESkillLevelStatus.FAILED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Non validé',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-error)',
        backgroundColor: 'var(--light-background-error)',
        iconPath: `${basePath}assets/icons/close-circle-outline.svg`
      })
    })
  })

  BddTest().when('the component is mounted with NOT_STARTED status', () => {
    beforeEach(() => {
      wrapper = mount(StudentSkillLevelStatusBadge, {
        props: { status: ESkillLevelStatus.NOT_STARTED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'En cours d\'acquisition',
        small: true,
        ellipsis: true,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/hourglass.svg`
      })
    })
  })

  BddTest().when('the component is mounted with TO_BE_EVALUATED status', () => {
    beforeEach(() => {
      wrapper = mount(StudentSkillLevelStatusBadge, {
        props: { status: ESkillLevelStatus.TO_BE_EVALUATED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'En cours d\'acquisition',
        small: true,
        ellipsis: true,
        color: 'var(--dark-background-primary1)',
        backgroundColor: 'var(--light-background-primary2)',
        iconPath: `${basePath}assets/icons/hourglass.svg`
      })
    })
  })

  BddTest().when('the component is mounted with UNDER_REVIEW status', () => {
    beforeEach(() => {
      wrapper = mount(StudentSkillLevelStatusBadge, {
        props: { status: ESkillLevelStatus.UNDER_REVIEW },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Soumis pour évaluation',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-primary1)',
        backgroundColor: 'var(--light-background-critical)',
        iconPath: `${basePath}assets/icons/dots-horizontal-circle-outline.svg`
      })
    })
  })

  BddTest().when('the component is mounted with VALIDATED status', () => {
    beforeEach(() => {
      wrapper = mount(StudentSkillLevelStatusBadge, {
        props: { status: ESkillLevelStatus.VALIDATED },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should pass correct properties to AvBadge', () => {
      const badge = wrapper.findComponent({ name: 'AvBadge' })

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Validé',
        small: true,
        ellipsis: true,
        color: 'var(--light-foreground-success)',
        backgroundColor: 'var(--light-background-success)',
        iconPath: `${basePath}assets/icons/check-circle.svg`
      })
    })
  })
})
