import { ESkillLevelStatus, type SkillDTO } from '@/api/avenir-esr'
import StudentDetailedEducationalSkillCard from '@/features/student/skills/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const baseSkill: SkillDTO = {
  id: 'skill-1',
  name: 'Test Skill',
  levelCount: 3,
  isProgramFinished: false,
  currentSkillLevel: {
    id: 'level-1',
    name: 'Niveau 1',
    traceCount: 5,
    activityCount: 2,
    status: ESkillLevelStatus.TO_BE_EVALUATED,
    shortDescription: 'Une description courte'
  },
  achievedSkillLevels: {
    id: 'level-0',
    name: 'Niveau 0',
    traceCount: 5,
    activityCount: 2,
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
          props: ['skill', 'skillColor', 'icon', 'color'],
          template: `<div class="student-detailed-skill-card"><slot /></div>`
        },
        StudentSkillLevelStatusBadge: {
          name: 'StudentSkillLevelStatusBadge',
          props: ['status'],
          template: `<div class="student-level-badge">{{ status }}</div>`
        },
        StudentCountTracesIconText: {
          name: 'StudentCountTracesIconText',
          props: ['countTraces', 'gap', 'inline'],
          template: `<div class="trace-count">Traces: {{ countTraces }}</div>`
        },
        StudentCountAmsIconText: {
          name: 'StudentCountAmsIconText',
          props: ['countAms', 'gap', 'inline'],
          template: `<div class="ams-count">AMS: {{ countAms }}</div>`
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

    BddTest().then('it should render the trace count', () => {
      expect(wrapper.text()).toContain(`Traces: ${baseSkill.currentSkillLevel.traceCount}`)
    })

    BddTest().then('it should render the activity count', () => {
      expect(wrapper.text()).toContain(`AMS: ${baseSkill.currentSkillLevel.activityCount}`)
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
  })
})
