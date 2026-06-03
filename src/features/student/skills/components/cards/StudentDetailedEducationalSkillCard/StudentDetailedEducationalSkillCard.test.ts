import { ESkillLevelStatus, type SkillDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import StudentDetailedEducationalSkillCard from '@/features/student/skills/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { useRoute } from 'vue-router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

const mockedUseRoute = vi.mocked(useRoute)

const baseSkill: SkillDTO = {
  id: 'skill-1',
  name: 'Test Skill',
  levelCount: 3,
  isProgramFinished: false,
  currentSkillLevel: {
    id: 'level-1',
    name: 'Niveau 1',
    status: ESkillLevelStatus.TO_BE_EVALUATED,
    shortDescription: 'Une description courte'
  },
  achievedSkillLevels: {
    id: 'level-0',
    name: 'Niveau 0',
    shortDescription: 'Niveau 0 description',
    status: ESkillLevelStatus.VALIDATED
  }
}

const skillColor = 'var(--color-skill-primary)'

function createWrapper (skill: SkillDTO = baseSkill) {
  return mount(StudentDetailedEducationalSkillCard, {
    props: {
      skill,
      skillColor
    },
    global: {
      stubs: {
        StudentDetailedSkillCard: {
          name: 'StudentDetailedSkillCard',
          props: ['id', 'name', 'skillColor', 'icon', 'to', 'color'],
          template: `<div class="student-detailed-skill-card"><slot /></div>`
        },
        StudentSkillLevelStatusBadge: {
          name: 'StudentSkillLevelStatusBadge',
          props: ['status'],
          template: `<div class="student-level-badge">{{ status }}</div>`
        },
        AvBadge: {
          name: 'AvBadge',
          props: ['label', 'color', 'backgroundColor', 'icon', 'small', 'ellipsis'],
          template: `<div class="badge">{{ label }}</div>`
        },
        StudentLastCompletedLevelBadge: {
          name: 'StudentLastCompletedLevelBadge',
          props: ['level'],
          template: `<div class="last-completed-badge">{{ level.name }}</div>`
        }
      }
    }
  })
}

BddTest().given('a student detailed educationnal skill card with valid props', () => {
  let wrapper: VueWrapper
  let routeName: string

  beforeEach(() => {
    routeName = ROUTES.STUDENT.EDUCATION_SKILLS.name
    mockedUseRoute.mockReturnValue({
      get name () {
        return routeName
      }
    } as ReturnType<typeof useRoute>)
  })

  BddTest().when('the card is mounted', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    BddTest().then('it should render the skill level name', () => {
      expect(wrapper.text()).toContain(baseSkill.currentSkillLevel.name)
    })

    BddTest().then('it should render the short description', () => {
      expect(wrapper.text()).toContain(baseSkill.currentSkillLevel.shortDescription)
    })

    BddTest().then('it should render the AvBadge with correct label', () => {
      const badge = wrapper.find('.badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain(`${baseSkill.levelCount} niveaux`)
    })

    BddTest().then('it should render the StudentSkillLevelStatusBadge when status is TO_BE_EVALUATED', () => {
      const badge = wrapper.find('.student-level-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain(ESkillLevelStatus.TO_BE_EVALUATED)
    })

    BddTest().then('it should render the StudentSkillLevelStatusBadge when status is UNDER_REVIEW', () => {
      const skill = { ...baseSkill, currentSkillLevel: { ...baseSkill.currentSkillLevel, status: ESkillLevelStatus.UNDER_REVIEW } }
      wrapper = createWrapper(skill)
      const badge = wrapper.find('.student-level-badge')
      expect(badge.exists()).toBe(true)
    })

    BddTest().then('it should not render the StudentSkillLevelStatusBadge when status is VALIDATED', () => {
      const skill = { ...baseSkill, currentSkillLevel: { ...baseSkill.currentSkillLevel, status: ESkillLevelStatus.VALIDATED } }
      wrapper = createWrapper(skill)
      const badge = wrapper.find('.student-level-badge')
      expect(badge.exists()).toBe(false)
    })

    BddTest().then('it should render the StudentLastCompletedLevelBadge when achievedSkillLevels is present', () => {
      const badge = wrapper.find('.last-completed-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('Niveau 0')
    })

    BddTest().then('it should not render the StudentLastCompletedLevelBadge when achievedSkillLevels is undefined', () => {
      const skill = { ...baseSkill, achievedSkillLevels: undefined }
      wrapper = createWrapper(skill)
      const badge = wrapper.find('.last-completed-badge')
      expect(badge.exists()).toBe(false)
    })

    BddTest().then('it should navigate to the education skill route when rendered from education skills', () => {
      const card = wrapper.findComponent({ name: 'StudentDetailedSkillCard' })
      expect(card.props('to')).toBe(ROUTES.STUDENT.EDUCATION_SKILL.name)
    })

    BddTest().then('it should navigate to the project skill route when rendered outside education skills', () => {
      routeName = ROUTES.STUDENT.PROJECT_SKILLS.name
      wrapper = createWrapper()

      const card = wrapper.findComponent({ name: 'StudentDetailedSkillCard' })
      expect(card.props('to')).toBe(ROUTES.STUDENT.PROJECT_SKILL.name)
    })
  })
})
