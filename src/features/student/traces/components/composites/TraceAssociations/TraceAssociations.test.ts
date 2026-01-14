import type { VueWrapper } from '@vue/test-utils'
import { type DeclaredSkillAssociationDTO, EAmsStatus, EDeclaredSkillLevel, EExternalSkillType, ESkillLevelStatus, type SkillLevelAssociationDTO } from '@/api/avenir-esr'
import TraceAssociations
  from '@/features/student/traces/components/composites/TraceAssociations/TraceAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvIconText: {
    name: 'AvIconText',
    template: '<div class="av-icon-text"><slot /></div>',
    props: {
      text: String,
      icon: String,
      typographyClass: String
    }
  },
  StudentTraceSkillLevelAssociationCard: {
    name: 'StudentTraceSkillLevelAssociationCard',
    template: '<div class="student-trace-skill-level-association-card" />',
    props: {
      skill: Object,
      levelColor: String
    }
  },
  StudentTraceDeclaredSkillAssociationCard: {
    name: 'StudentTraceDeclaredSkillAssociationCard',
    template: '<div class="student-trace-declared-skill-association-card" />',
    props: {
      declaredSkill: Object
    }
  }
}

BddTest().given('a student trace associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociations>>

  BddTest().when('the component is mounted with empty associations', () => {
    beforeEach(() => {
      const associationsProps = { skillLevelAssociations: [], declaredSkillAssociations: [] }
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the title with count 0', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })

      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('(0)')
    })

    BddTest().then('it should not render any association cards', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(skillCards).toHaveLength(0)
      expect(declaredSkillCards).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with only skill level associations', () => {
    const skillLevelAssociations: SkillLevelAssociationDTO[] = [
      {
        id: 'skill-1',
        skillTitle: 'Compétence 1',
        level: 'Niv. 1',
        status: ESkillLevelStatus.VALIDATED
      },
      {
        id: 'skill-2',
        skillTitle: 'Compétence 2',
        level: 'Niv. 2',
        status: ESkillLevelStatus.UNDER_ACQUISITION,
        ams: {
          id: 'ams-1',
          title: 'SAE 1.4',
          status: EAmsStatus.COMPLETED
        }
      }
    ]

    const associationsProps = { skillLevelAssociations, declaredSkillAssociations: [] }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the title with count 2', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })

      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('(2)')
    })

    BddTest().then('it should render 2 skill level association cards', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })

      expect(skillCards).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to skill cards', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })

      expect(skillCards[0].props('skill')).toEqual(skillLevelAssociations[0])
      expect(skillCards[1].props('skill')).toEqual(skillLevelAssociations[1])
    })

    BddTest().then('it should assign different colors to each skill card', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })

      expect(skillCards[0].props('levelColor')).toBe('var(--skill1)')
      expect(skillCards[1].props('levelColor')).toBe('var(--skill2)')
    })

    BddTest().then('it should not render declared skill cards', () => {
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with only declared skill associations', () => {
    const declaredSkillAssociations: DeclaredSkillAssociationDTO[] = [
      {
        id: 'declared-1',
        title: 'Compétence complémentaire 1',
        level: EDeclaredSkillLevel.BEGINNER,
        pathSegments: [],
        type: EExternalSkillType.ROME4
      }
    ]

    const associationsProps = { skillLevelAssociations: [], declaredSkillAssociations }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the title with count 1', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })

      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('(1)')
    })

    BddTest().then('it should render 1 declared skill association card', () => {
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to declared skill card', () => {
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards[0].props('declaredSkill')).toEqual(declaredSkillAssociations[0])
    })

    BddTest().then('it should not render skill level cards', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })

      expect(skillCards).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with both types of associations', () => {
    const skillLevelAssociations: SkillLevelAssociationDTO[] = [
      {
        id: 'skill-1',
        skillTitle: 'Compétence 1',
        level: 'Niv. 1',
        status: ESkillLevelStatus.VALIDATED
      },
      {
        id: 'skill-2',
        skillTitle: 'Compétence 2',
        level: 'Niv. 2',
        status: ESkillLevelStatus.UNDER_ACQUISITION
      },
      {
        id: 'skill-3',
        skillTitle: 'Compétence 3',
        level: 'Niv. 3',
        status: ESkillLevelStatus.UNDER_REVIEW
      }
    ]

    const declaredSkillAssociations: DeclaredSkillAssociationDTO[] = [
      {
        id: 'declared-1',
        title: 'Compétence complémentaire 1',
        level: EDeclaredSkillLevel.EXPERT,
        pathSegments: [],
        type: EExternalSkillType.ROME4
      }
    ]

    const associationsProps = { skillLevelAssociations, declaredSkillAssociations }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the title with total count 4', () => {
      const iconText = wrapper.findComponent({ name: 'AvIconText' })

      expect(iconText.exists()).toBe(true)
      expect(iconText.props('text')).toContain('(4)')
    })

    BddTest().then('it should render 3 skill level association cards', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })

      expect(skillCards).toHaveLength(3)
    })

    BddTest().then('it should render 1 declared skill association card', () => {
      const declaredSkillCards = wrapper.findAllComponents({ name: 'StudentTraceDeclaredSkillAssociationCard' })

      expect(declaredSkillCards).toHaveLength(1)
    })
  })

  BddTest().when('the component is mounted with more than 12 skill associations', () => {
    const skillLevelAssociations: SkillLevelAssociationDTO[] = Array.from({ length: 15 }, (_, i) => ({
      id: `skill-${i}`,
      skillTitle: `Compétence ${i}`,
      level: `Niv. ${i}`,
      status: ESkillLevelStatus.VALIDATED
    }))

    const associationsProps = { skillLevelAssociations, declaredSkillAssociations: [] }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociations, {
        props: {
          associations: associationsProps
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should cycle through skill colors', () => {
      const skillCards = wrapper.findAllComponents({ name: 'StudentTraceSkillLevelAssociationCard' })

      expect(skillCards[0].props('levelColor')).toBe('var(--skill1)')
      expect(skillCards[11].props('levelColor')).toBe('var(--skill12)')
      expect(skillCards[12].props('levelColor')).toBe('var(--skill1)')
      expect(skillCards[13].props('levelColor')).toBe('var(--skill2)')
    })
  })
})
