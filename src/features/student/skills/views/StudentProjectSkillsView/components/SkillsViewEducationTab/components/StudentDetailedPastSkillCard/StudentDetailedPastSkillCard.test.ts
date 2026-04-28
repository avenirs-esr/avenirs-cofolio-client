import { ESkillLevelStatus, type SkillDTO } from '@/api/avenir-esr'
import StudentDetailedPastSkillCard from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewEducationTab/components/StudentDetailedPastSkillCard/StudentDetailedPastSkillCard.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

const stubs = {
  AvBadge: AvBadgeStub,
  StudentDetailedSkillCard: {
    name: 'StudentDetailedSkillCard',
    props: ['id', 'name', 'skillColor', 'icon', 'color'],
    template: '<div class="student-detailed-skill-card-stub"><slot /></div>'
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
  levelCount: 3,
  currentSkillLevel: {
    id: '5e7090f5-0c9e-4f71-a770-03ad2bb75711',
    name: 'Niv. 0 - [fr_FR]',
    shortDescription: 'Molestiae et libero. - [fr_FR]',
    status: ESkillLevelStatus.UNDER_ACQUISITION
  },
  achievedSkillLevels: {
    id: '80ca37c3-388d-4ac9-948a-63288a2d4148',
    name: 'Niv. 2 - [fr_FR]',
    shortDescription: 'Ex molestiae illum beatae eligendi laborum ducimus quos. - [fr_FR]',
    status: ESkillLevelStatus.VALIDATED
  },
  isProgramFinished: true
}

const mockSkillWithoutAchievedLevels: SkillDTO = {
  id: 'b57e3a55-f503-48be-a7e3-ab0c06c510a2',
  name: 'Skill doloremque - [fr_FR]',
  levelCount: 3,
  currentSkillLevel: {
    id: 'a29eb925-23f7-4d5d-bcf3-597ea2c17427',
    name: 'Niv. 7 - [fr_FR]',
    shortDescription: 'Perferendis repellat dolorem optio consequatur quis minus. - [fr_FR]',
    status: ESkillLevelStatus.TO_BE_EVALUATED
  },
  achievedSkillLevels: undefined,
  isProgramFinished: true
}

BddTest().given('a student detailed past skill card component', () => {
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

  BddTest().when('the component is mounted with a skill', () => {
    BddTest().then('it should render StudentDetailedSkillCard with correct props', () => {
      const skillCard = wrapper.findComponent({ name: 'StudentDetailedSkillCard' })

      expect(skillCard.exists()).toBe(true)
      expect(skillCard.props('id')).toBe('458861bb-cfa9-4770-9d6f-204c2f84785c')
      expect(skillCard.props('name')).toBe('Skill deserunt - [fr_FR]')
      expect(skillCard.props('skillColor')).toBe('var(--light-background-neutral)')
      expect(skillCard.props('color')).toBe('var(--text1)')
    })

    BddTest().then('it should render program finished badge', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const programBadge = badges[0]

      expect(programBadge.exists()).toBe(true)
      expect(programBadge.props('label')).toBe('Formation associée')
      expect(programBadge.props('color')).toBe('var(--foreground-text)')
      expect(programBadge.props('backgroundColor')).toBe('var(--surface-background)')
      expect(programBadge.props('small')).toBe(true)
      expect(programBadge.props('ellipsis')).toBe(true)
    })

    BddTest().then('it should render level count badge', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const levelBadge = badges[1]

      expect(levelBadge.exists()).toBe(true)
      expect(levelBadge.props('label')).toBe('3 niveaux')
      expect(levelBadge.props('color')).toBe('var(--foreground-text)')
      expect(levelBadge.props('backgroundColor')).toBe('var(--surface-background)')
      expect(levelBadge.props('small')).toBe(true)
      expect(levelBadge.props('ellipsis')).toBe(true)
    })

    BddTest().then('it should render StudentLastCompletedLevelBadge when achievedSkillLevels exists', () => {
      const levelBadge = wrapper.findComponent({ name: 'StudentLastCompletedLevelBadge' })

      expect(levelBadge.exists()).toBe(true)
      expect(levelBadge.props('level')).toEqual(mockSkill.achievedSkillLevels)
    })
  })

  BddTest().when('the component is mounted with a skill without achieved levels', () => {
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

    BddTest().then('it should not render StudentLastCompletedLevelBadge', () => {
      const levelBadge = wrapper.findComponent({ name: 'StudentLastCompletedLevelBadge' })

      expect(levelBadge.exists()).toBe(false)
    })

    BddTest().then('it should render correct level count', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const levelBadge = badges[1]

      expect(levelBadge.props('label')).toBe('3 niveaux')
    })
  })
})
