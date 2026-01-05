import type { VueWrapper } from '@vue/test-utils'
import { type AdditionalSkillAssociationDTO, EAdditionalSkillLevel, EAmsStatus, EExternalSkillType, ESkillLevelStatus, type SkillLevelAssociationDTO } from '@/api/avenir-esr'
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
  StudentTraceAdditionalSkillAssociationCard: {
    name: 'StudentTraceAdditionalSkillAssociationCard',
    template: '<div class="student-trace-additional-skill-association-card" />',
    props: {
      additionalSkill: Object
    }
  }
}

BddTest().given('a student trace associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociations>>

  BddTest().when('the component is mounted with empty associations', () => {
    beforeEach(() => {
      const associationsProps = { skillLevelAssociations: [], additionalSkillAssociations: [] }
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
      const additionalSkillCards = wrapper.findAllComponents({ name: 'StudentTraceAdditionalSkillAssociationCard' })

      expect(skillCards).toHaveLength(0)
      expect(additionalSkillCards).toHaveLength(0)
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

    const associationsProps = { skillLevelAssociations, additionalSkillAssociations: [] }

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

    BddTest().then('it should not render additional skill cards', () => {
      const additionalSkillCards = wrapper.findAllComponents({ name: 'StudentTraceAdditionalSkillAssociationCard' })

      expect(additionalSkillCards).toHaveLength(0)
    })
  })

  BddTest().when('the component is mounted with only additional skill associations', () => {
    const additionalSkillAssociations: AdditionalSkillAssociationDTO[] = [
      {
        id: 'additional-1',
        title: 'Compétence additionnelle 1',
        level: EAdditionalSkillLevel.BEGINNER,
        pathSegments: [],
        type: EExternalSkillType.ROME4
      }
    ]

    const associationsProps = { skillLevelAssociations: [], additionalSkillAssociations }

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

    BddTest().then('it should render 1 additional skill association card', () => {
      const additionalSkillCards = wrapper.findAllComponents({ name: 'StudentTraceAdditionalSkillAssociationCard' })

      expect(additionalSkillCards).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to additional skill card', () => {
      const additionalSkillCards = wrapper.findAllComponents({ name: 'StudentTraceAdditionalSkillAssociationCard' })

      expect(additionalSkillCards[0].props('additionalSkill')).toEqual(additionalSkillAssociations[0])
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

    const additionalSkillAssociations: AdditionalSkillAssociationDTO[] = [
      {
        id: 'additional-1',
        title: 'Compétence additionnelle 1',
        level: EAdditionalSkillLevel.EXPERT,
        pathSegments: [],
        type: EExternalSkillType.ROME4
      }
    ]

    const associationsProps = { skillLevelAssociations, additionalSkillAssociations }

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

    BddTest().then('it should render 1 additional skill association card', () => {
      const additionalSkillCards = wrapper.findAllComponents({ name: 'StudentTraceAdditionalSkillAssociationCard' })

      expect(additionalSkillCards).toHaveLength(1)
    })
  })

  BddTest().when('the component is mounted with more than 12 skill associations', () => {
    const skillLevelAssociations: SkillLevelAssociationDTO[] = Array.from({ length: 15 }, (_, i) => ({
      id: `skill-${i}`,
      skillTitle: `Compétence ${i}`,
      level: `Niv. ${i}`,
      status: ESkillLevelStatus.VALIDATED
    }))

    const associationsProps = { skillLevelAssociations, additionalSkillAssociations: [] }

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
