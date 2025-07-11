import { SkillLevelStatus, type SkillViewDTO } from '@/api/avenir-esr'
import StudentDetailedEducationalSkillCard from '@/features/student/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

const baseSkill: SkillViewDTO = {
  id: 'skill-1',
  name: 'Test Skill',
  levelCount: 3,
  traceCount: 5,
  activityCount: 2,
  currentSkillLevel: {
    id: 'level-1',
    name: 'Niveau 1',
    status: SkillLevelStatus.TO_BE_EVALUATED,
    shortDescription: 'Une description courte'
  }
}

const skillColor = 'var(--color-skill-primary)'

function createWrapper (skill: SkillViewDTO = baseSkill) {
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
        StudentLevelBadge: {
          name: 'StudentLevelBadge',
          props: ['level'],
          template: `<div class="student-level-badge">{{ level.name }}</div>`
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
          props: ['label', 'color', 'backgroundColor', 'iconPath', 'small', 'ellipsis'],
          template: `<div class="badge">{{ label }}</div>`
        }
      }
    }
  })
}

describe('given a student detailed educationnal skill card with valid props', () => {
  let wrapper: VueWrapper
  describe('when the card is mounted', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('then it should render the skill level name', () => {
      expect(wrapper.text()).toContain(baseSkill.currentSkillLevel.name)
    })

    it('then it should render the short description', () => {
      expect(wrapper.text()).toContain(baseSkill.currentSkillLevel.shortDescription)
    })

    it('then it should render the trace count', () => {
      expect(wrapper.text()).toContain(`Traces: ${baseSkill.traceCount}`)
    })

    it('then it should render the activity count', () => {
      expect(wrapper.text()).toContain(`AMS: ${baseSkill.activityCount}`)
    })

    it('then it should render the AvBadge with correct label', () => {
      const badge = wrapper.find('.badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain(`${baseSkill.levelCount} niveaux`)
    })

    it('then it should render the StudentLevelBadge when status is TO_BE_EVALUATED', () => {
      const badge = wrapper.find('.student-level-badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain(baseSkill.currentSkillLevel.name)
    })

    it('then it should render the StudentLevelBadge when status is UNDER_REVIEW', () => {
      const skill = { ...baseSkill, currentSkillLevel: { ...baseSkill.currentSkillLevel, status: SkillLevelStatus.UNDER_REVIEW } }
      wrapper = createWrapper(skill)
      const badge = wrapper.find('.student-level-badge')
      expect(badge.exists()).toBe(true)
    })

    it('then it should not render the StudentLevelBadge when status is VALIDATED', () => {
      const skill = { ...baseSkill, currentSkillLevel: { ...baseSkill.currentSkillLevel, status: SkillLevelStatus.VALIDATED } }
      wrapper = createWrapper(skill)
      const badge = wrapper.find('.student-level-badge')
      expect(badge.exists()).toBe(false)
    })
  })
})
