import type { VueWrapper } from '@vue/test-utils'
import { type AdditionalSkillAssociationDTO, EAdditionalSkillLevel, EAdditionalSkillType } from '@/api/avenir-esr'
import { StudentTraceAdditionalSkillAssociationCard } from '@/features/student/components/traces'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  StudentTraceAssociationCard: {
    name: 'StudentTraceAssociationCard',
    template: `
      <div class="student-trace-association-card">
        <div class="title-prepend"><slot name="title-prepend" /></div>
        <div class="body"><slot name="body" /></div>
      </div>
    `,
    props: {
      title: String,
      icon: String
    }
  },
  AdditionalSkillTypeBadge: {
    name: 'AdditionalSkillTypeBadge',
    template: '<div class="additional-skill-type-badge" />',
    props: {
      label: String
    }
  },
  AdditionalSkillLevelBadge: {
    name: 'AdditionalSkillLevelBadge',
    template: '<div class="additional-skill-level-badge" />',
    props: {
      level: String,
      small: Boolean
    }
  }
}

BddTest().given('a student trace additional skill association card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceAdditionalSkillAssociationCard>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with additional skill', () => {
    const additionalSkill: AdditionalSkillAssociationDTO = {
      id: 'skill-1',
      title: 'Compétence additionnelle test',
      type: EAdditionalSkillType.ROME4,
      level: EAdditionalSkillLevel.INTERMEDIATE,
      pathSegments: []
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAdditionalSkillAssociationCard, {
        props: {
          additionalSkill
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render StudentTraceAssociationCard with skill title', () => {
      const card = wrapper.findComponent({ name: 'StudentTraceAssociationCard' })

      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe('Compétence additionnelle test')
    })

    BddTest().then('it should render StudentTraceAssociationCard with stars icon', () => {
      const card = wrapper.findComponent({ name: 'StudentTraceAssociationCard' })

      expect(card.props('icon')).toBe(MDI_ICONS.STARS)
    })

    BddTest().then('it should render AdditionalSkillTypeBadge with skill type', () => {
      const typeBadge = wrapper.findComponent({ name: 'AdditionalSkillTypeBadge' })

      expect(typeBadge.exists()).toBe(true)
      expect(typeBadge.props('label')).toBe('Rome 4.0')
    })

    BddTest().then('it should render AdditionalSkillLevelBadge with skill level', () => {
      const levelBadge = wrapper.findComponent({ name: 'AdditionalSkillLevelBadge' })

      expect(levelBadge.exists()).toBe(true)
      expect(levelBadge.props('level')).toBe(EAdditionalSkillLevel.INTERMEDIATE)
      expect(levelBadge.props('small')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with different skill levels', () => {
    const skillBeginner: AdditionalSkillAssociationDTO = {
      id: 'skill-2',
      title: 'Compétence débutant',
      type: EAdditionalSkillType.ROME4,
      level: EAdditionalSkillLevel.BEGINNER,
      pathSegments: []
    }

    const skillExpert: AdditionalSkillAssociationDTO = {
      id: 'skill-3',
      title: 'Compétence expert',
      type: EAdditionalSkillType.ROME4,
      level: EAdditionalSkillLevel.EXPERT,
      pathSegments: []
    }

    BddTest().then('it should render BEGINNER level correctly', () => {
      wrapper = mountComponent(StudentTraceAdditionalSkillAssociationCard, {
        props: { additionalSkill: skillBeginner },
        global: { stubs }
      })

      const levelBadge = wrapper.findComponent({ name: 'AdditionalSkillLevelBadge' })
      expect(levelBadge.props('level')).toBe(EAdditionalSkillLevel.BEGINNER)
    })

    BddTest().then('it should render EXPERT level correctly', () => {
      wrapper = mountComponent(StudentTraceAdditionalSkillAssociationCard, {
        props: { additionalSkill: skillExpert },
        global: { stubs }
      })

      const levelBadge = wrapper.findComponent({ name: 'AdditionalSkillLevelBadge' })
      expect(levelBadge.props('level')).toBe(EAdditionalSkillLevel.EXPERT)
    })
  })

  BddTest().when('the component is mounted with COMPETENT level', () => {
    const skillCompetent: AdditionalSkillAssociationDTO = {
      id: 'skill-4',
      title: 'Compétence compétent',
      type: EAdditionalSkillType.ROME4,
      level: EAdditionalSkillLevel.COMPETENT,
      pathSegments: []
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAdditionalSkillAssociationCard, {
        props: { additionalSkill: skillCompetent },
        global: { stubs }
      })
    })

    BddTest().then('it should render COMPETENT level correctly', () => {
      const levelBadge = wrapper.findComponent({ name: 'AdditionalSkillLevelBadge' })
      expect(levelBadge.props('level')).toBe(EAdditionalSkillLevel.COMPETENT)
    })

    BddTest().then('it should render ROME4 type correctly', () => {
      const typeBadge = wrapper.findComponent({ name: 'AdditionalSkillTypeBadge' })
      expect(typeBadge.props('label')).toBe('Rome 4.0')
    })
  })

  BddTest().when('the component is mounted with body slot content', () => {
    const additionalSkill: AdditionalSkillAssociationDTO = {
      id: 'skill-7',
      title: 'Compétence avec body',
      type: EAdditionalSkillType.ROME4,
      level: EAdditionalSkillLevel.BEGINNER,
      pathSegments: []
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceAdditionalSkillAssociationCard, {
        props: {
          additionalSkill
        },
        slots: {
          body: '<div class="custom-body">Custom body content</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the body slot content', () => {
      expect(wrapper.find('.custom-body').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom body content')
    })
  })
})
