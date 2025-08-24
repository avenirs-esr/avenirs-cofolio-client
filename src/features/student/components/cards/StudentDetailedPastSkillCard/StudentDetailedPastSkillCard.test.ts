import { type SkillDTO, SkillLevelStatus } from '@/api/avenir-esr'
import { mount, type VueWrapper } from '@vue/test-utils'
import StudentDetailedPastSkillCard from './StudentDetailedPastSkillCard.vue'

const stubs = {
  StudentDetailedSkillCard: {
    name: 'StudentDetailedSkillCard',
    props: ['id', 'name', 'skillColor', 'icon', 'color'],
    template: '<div class="student-detailed-skill-card-stub"><slot /></div>'
  },
  AvBadge: {
    name: 'AvBadge',
    props: ['color', 'backgroundColor', 'iconPath', 'label', 'small', 'ellipsis'],
    template: '<div class="av-badge-stub">{{ label }}</div>'
  },
  StudentLastCompletedLevelBadge: {
    name: 'StudentLastCompletedLevelBadge',
    props: ['level'],
    template: '<div class="student-last-completed-level-badge-stub" />'
  }
}

const mockSkill: SkillDTO = {
  id: '458861bb-cfa9-4770-9d6f-204c2f84785c',
  name: 'Skill deserunt - [fr_FR]',
  traceCount: 0,
  activityCount: 0,
  levelCount: 3,
  currentSkillLevel: {
    id: '5e7090f5-0c9e-4f71-a770-03ad2bb75711',
    name: 'Niv. 0 - [fr_FR]',
    shortDescription: 'Molestiae et libero. - [fr_FR]',
    status: SkillLevelStatus.UNDER_ACQUISITION
  },
  achievedSkillLevels: {
    id: '80ca37c3-388d-4ac9-948a-63288a2d4148',
    name: 'Niv. 2 - [fr_FR]',
    shortDescription: 'Ex molestiae illum beatae eligendi laborum ducimus quos. - [fr_FR]',
    status: SkillLevelStatus.VALIDATED
  },
  isProgramFinished: true
}

const mockSkillWithoutAchievedLevels: SkillDTO = {
  id: 'b57e3a55-f503-48be-a7e3-ab0c06c510a2',
  name: 'Skill doloremque - [fr_FR]',
  traceCount: 0,
  activityCount: 1,
  levelCount: 3,
  currentSkillLevel: {
    id: 'a29eb925-23f7-4d5d-bcf3-597ea2c17427',
    name: 'Niv. 7 - [fr_FR]',
    shortDescription: 'Perferendis repellat dolorem optio consequatur quis minus. - [fr_FR]',
    status: SkillLevelStatus.TO_BE_EVALUATED
  },
  achievedSkillLevels: undefined,
  isProgramFinished: true
}

describe('studentDetailedPastSkillCard', () => {
  describe('given a student detailed past skill card component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentDetailedPastSkillCard>>

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(StudentDetailedPastSkillCard, {
        props: {
          skill: mockSkill
        },
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted with a skill', () => {
      it('then it should render StudentDetailedSkillCard with correct props', () => {
        const skillCard = wrapper.findComponent({ name: 'StudentDetailedSkillCard' })

        expect(skillCard.exists()).toBe(true)
        expect(skillCard.props('id')).toBe('458861bb-cfa9-4770-9d6f-204c2f84785c')
        expect(skillCard.props('name')).toBe('Skill deserunt - [fr_FR]')
        expect(skillCard.props('skillColor')).toBe('var(--light-background-neutral)')
        expect(skillCard.props('color')).toBe('var(--text1)')
      })

      it('then it should render program finished badge', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        const programBadge = badges[0]

        expect(programBadge.exists()).toBe(true)
        expect(programBadge.props('label')).toBe('Formation associée')
        expect(programBadge.props('color')).toBe('var(--foreground-text)')
        expect(programBadge.props('backgroundColor')).toBe('var(--surface-background)')
        expect(programBadge.props('small')).toBe('')
        expect(programBadge.props('ellipsis')).toBe('')
      })

      it('then it should render level count badge', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        const levelBadge = badges[1]

        expect(levelBadge.exists()).toBe(true)
        expect(levelBadge.props('label')).toBe('3 niveaux')
        expect(levelBadge.props('color')).toBe('var(--foreground-text)')
        expect(levelBadge.props('backgroundColor')).toBe('var(--surface-background)')
        expect(levelBadge.props('small')).toBe('')
        expect(levelBadge.props('ellipsis')).toBe('')
      })

      it('then it should render StudentLastCompletedLevelBadge when achievedSkillLevels exists', () => {
        const levelBadge = wrapper.findComponent({ name: 'StudentLastCompletedLevelBadge' })

        expect(levelBadge.exists()).toBe(true)
        expect(levelBadge.props('level')).toEqual(mockSkill.achievedSkillLevels)
      })
    })

    describe('when the component is mounted with a skill without achieved levels', () => {
      beforeEach(() => {
        wrapper = mount(StudentDetailedPastSkillCard, {
          props: {
            skill: mockSkillWithoutAchievedLevels
          },
          global: {
            stubs
          }
        })
      })

      it('then it should not render StudentLastCompletedLevelBadge', () => {
        const levelBadge = wrapper.findComponent({ name: 'StudentLastCompletedLevelBadge' })

        expect(levelBadge.exists()).toBe(false)
      })

      it('then it should render correct level count', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        const levelBadge = badges[1]

        expect(levelBadge.props('label')).toBe('3 niveaux')
      })
    })
  })
})
