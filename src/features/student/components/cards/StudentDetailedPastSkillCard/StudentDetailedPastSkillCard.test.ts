import { SkillLevelStatus, type SkillViewDTO } from '@/api/avenir-esr'
import StudentDetailedPastSkillCard from '@/features/student/components/cards/StudentDetailedPastSkillCard/StudentDetailedPastSkillCard.vue'
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
    name: 'Level 1',
    status: SkillLevelStatus.TO_BE_EVALUATED,
    shortDescription: 'A short description'
  }
}

function createWrapper (skill: SkillViewDTO = baseSkill) {
  return mount(StudentDetailedPastSkillCard, {
    props: {
      skill
    },
    global: {
      stubs: {
        StudentDetailedSkillCard: {
          name: 'StudentDetailedSkillCard',
          props: ['skill', 'skillColor', 'icon', 'color'],
          template: `<div class="student-detailed-skill-card"><slot /></div>`
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

describe('given a student detailed past skill card with valid props', () => {
  let wrapper: VueWrapper

  describe('when the card is mounted', () => {
    beforeEach(() => {
      wrapper = createWrapper()
    })

    it('then it should render the AvBadge with correct label', () => {
      const badge = wrapper.find('.badge')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain(`${baseSkill.levelCount} niveaux`)
    })
  })
})
