import type { VueWrapper } from '@vue/test-utils'
import { type DeclaredSkillAssociationDTO, EDeclaredSkillLevel, EExternalSkillType } from '@/api/avenir-esr'
import StudentTraceDeclaredSkillAssociationCard from '@/features/student/traces/components/cards/StudentTraceDeclaredSkillAssociationCard/StudentTraceDeclaredSkillAssociationCard.vue'
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
  DeclaredSkillTypeBadge: {
    name: 'DeclaredSkillTypeBadge',
    template: '<div class="declared-skill-type-badge" />',
    props: {
      label: String
    }
  },
  DeclaredSkillLevelBadge: {
    name: 'DeclaredSkillLevelBadge',
    template: '<div class="declared-skill-level-badge" />',
    props: {
      level: String,
      small: Boolean
    }
  }
}

BddTest().given('a student trace declared skill association card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceDeclaredSkillAssociationCard>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with declared skill', () => {
    const declaredSkill: DeclaredSkillAssociationDTO = {
      id: 'skill-1',
      title: 'Compétence complémentaire test',
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.INTERMEDIATE,
      pathSegments: []
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceDeclaredSkillAssociationCard, {
        props: {
          declaredSkill
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render StudentTraceAssociationCard with skill title', () => {
      const card = wrapper.findComponent({ name: 'StudentTraceAssociationCard' })

      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe(declaredSkill.title)
    })

    BddTest().then('it should render StudentTraceAssociationCard with stars icon', () => {
      const card = wrapper.findComponent({ name: 'StudentTraceAssociationCard' })

      expect(card.props('icon')).toBe(MDI_ICONS.STARS)
    })

    BddTest().then('it should render DeclaredSkillTypeBadge with skill type', () => {
      const typeBadge = wrapper.findComponent({ name: 'DeclaredSkillTypeBadge' })

      expect(typeBadge.exists()).toBe(true)
      expect(typeBadge.props('label')).toBe('Rome 4.0')
    })

    BddTest().then('it should render DeclaredSkillLevelBadge with skill level', () => {
      const levelBadge = wrapper.findComponent({ name: 'DeclaredSkillLevelBadge' })

      expect(levelBadge.exists()).toBe(true)
      expect(levelBadge.props('level')).toBe(EDeclaredSkillLevel.INTERMEDIATE)
      expect(levelBadge.props('small')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with different skill levels', () => {
    const skillBeginner: DeclaredSkillAssociationDTO = {
      id: 'skill-2',
      title: 'Compétence débutant',
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.BEGINNER,
      pathSegments: []
    }

    const skillExpert: DeclaredSkillAssociationDTO = {
      id: 'skill-3',
      title: 'Compétence expert',
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.EXPERT,
      pathSegments: []
    }

    BddTest().then('it should render BEGINNER level correctly', () => {
      wrapper = mountComponent(StudentTraceDeclaredSkillAssociationCard, {
        props: { declaredSkill: skillBeginner },
        global: { stubs }
      })

      const levelBadge = wrapper.findComponent({ name: 'DeclaredSkillLevelBadge' })
      expect(levelBadge.props('level')).toBe(EDeclaredSkillLevel.BEGINNER)
    })

    BddTest().then('it should render EXPERT level correctly', () => {
      wrapper = mountComponent(StudentTraceDeclaredSkillAssociationCard, {
        props: { declaredSkill: skillExpert },
        global: { stubs }
      })

      const levelBadge = wrapper.findComponent({ name: 'DeclaredSkillLevelBadge' })
      expect(levelBadge.props('level')).toBe(EDeclaredSkillLevel.EXPERT)
    })
  })

  BddTest().when('the component is mounted with COMPETENT level', () => {
    const skillCompetent: DeclaredSkillAssociationDTO = {
      id: 'skill-4',
      title: 'Compétence compétent',
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.COMPETENT,
      pathSegments: []
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceDeclaredSkillAssociationCard, {
        props: { declaredSkill: skillCompetent },
        global: { stubs }
      })
    })

    BddTest().then('it should render COMPETENT level correctly', () => {
      const levelBadge = wrapper.findComponent({ name: 'DeclaredSkillLevelBadge' })
      expect(levelBadge.props('level')).toBe(EDeclaredSkillLevel.COMPETENT)
    })

    BddTest().then('it should render ROME4 type correctly', () => {
      const typeBadge = wrapper.findComponent({ name: 'DeclaredSkillTypeBadge' })
      expect(typeBadge.props('label')).toBe('Rome 4.0')
    })
  })

  BddTest().when('the component is mounted with body slot content', () => {
    const declaredSkill: DeclaredSkillAssociationDTO = {
      id: 'skill-7',
      title: 'Compétence avec body',
      type: EExternalSkillType.ROME4,
      level: EDeclaredSkillLevel.BEGINNER,
      pathSegments: []
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceDeclaredSkillAssociationCard, {
        props: {
          declaredSkill
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
