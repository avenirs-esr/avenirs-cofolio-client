import { EActivityThematic, EAssociationContextType, EExperienceType, EExternalSkillType } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ICONS } from '@/common/constants'
import AssociationCompactCard, {
  type AssociationCompactCardProps
} from '@/features/student/associations/components/cards/AssociationCompactCard/AssociationCompactCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { ICONS_DATA_URL } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  FloatingIconCard: FloatingIconCardStub,
  ActivityThematicBadge: ActivityThematicBadgeStub,
  AvBadge: AvBadgeStub
}

function mountCard (props: AssociationCompactCardProps) {
  return mountComponent(AssociationCompactCard, { props, global: { stubs } })
}

BddTest().given('an association compact card', () => {
  let wrapper: ReturnType<typeof mountCard>

  const findFloatingIconCard = () => wrapper.findComponent(FloatingIconCardStub)

  const expectNoBadge = () => {
    expect(wrapper.findComponent(ActivityThematicBadgeStub).exists()).toBe(false)
    expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
  }

  BddTest().when('it is mounted with a trace', () => {
    const props: AssociationCompactCardProps = {
      contextType: EAssociationContextType.TRACE,
      association: { id: 'trace-1', title: 'Ma super trace' }
    }

    beforeEach(() => {
      wrapper = mountCard(props)
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(wrapper.find('[data-testid="association-compact-card"]').exists()).toBe(true)
    })

    BddTest().then('it should pass the title and the light colors to the card', () => {
      expect(findFloatingIconCard().props()).toMatchObject({
        title: props.association.title,
        titleColor: 'var(--text1)',
        color: 'var(--light-background-neutral)',
        borderColor: 'var(--other-border-skill-card)'
      })
    })

    BddTest().then('it should pass the trace icon to the card', () => {
      expect(findFloatingIconCard().props('iconOptions')).toEqual({
        name: ICONS.TRACES,
        color: 'var(--icon)',
        bottom: '-2.5rem',
        borderColor: 'var(--other-border-skill-card)'
      })
    })

    BddTest().then('it should pass the compact layout props to the card', () => {
      expect(findFloatingIconCard().props()).toMatchObject({
        headerRows: 2,
        height: '7.5rem',
        customTitleHeight: '4rem',
        titleTypographyClasses: 'caption-regular'
      })
    })

    BddTest().then('it should not render any badge', () => {
      expectNoBadge()
    })
  })

  BddTest().when('it is mounted with a categorized declared activity', () => {
    beforeEach(() => {
      wrapper = mountCard({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        association: {
          id: 'activity-1',
          title: 'Définir ses valeurs',
          category: EActivityThematic.SELF_KNOWLEDGE,
          description: 'Connaissance de soi'
        }
      })
    })

    BddTest().then('it should use the light colors and the activity icon', () => {
      expect(findFloatingIconCard().props('color')).toBe('var(--light-background-neutral)')
      expect(findFloatingIconCard().props('iconOptions')).toMatchObject({ name: ICONS.ACTIVITY, color: 'var(--icon)' })
    })

    BddTest().then('it should render a small thematic badge with the category', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('thematic')).toBe(EActivityThematic.SELF_KNOWLEDGE)
      expect(badge.props('small')).toBe(true)
    })

    BddTest().then('it should not render the skill type badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('it is mounted with a declared activity without category description', () => {
    beforeEach(() => {
      wrapper = mountCard({
        contextType: EAssociationContextType.DECLARED_ACTIVITY,
        association: { id: 'activity-1', title: 'Définir ses valeurs', category: EActivityThematic.SELF_KNOWLEDGE }
      })
    })

    BddTest().then('it should not render any badge', () => {
      expectNoBadge()
    })
  })

  BddTest().when('it is mounted with a categorized declared skill', () => {
    const props: AssociationCompactCardProps = {
      contextType: EAssociationContextType.DECLARED_SKILL,
      association: {
        id: 'skill-1',
        title: 'Gestion de projet agile',
        category: EExternalSkillType.ROME4,
        description: 'Rome 4.0'
      }
    }

    beforeEach(() => {
      wrapper = mountCard(props)
    })

    BddTest().then('it should use the dark colors', () => {
      expect(findFloatingIconCard().props()).toMatchObject({
        title: props.association.title,
        titleColor: 'var(--card)',
        color: 'var(--dark-background-primary1)'
      })
    })

    BddTest().then('it should pass the skill icon with the dark icon color to the card', () => {
      expect(findFloatingIconCard().props('iconOptions')).toMatchObject({ name: ICONS.SKILLS, color: 'var(--card)' })
    })

    BddTest().then('it should render the type badge with the category description', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props()).toMatchObject({
        label: 'Rome 4.0',
        color: 'var(--text1)',
        borderColor: 'var(--other-border-skill-card)',
        backgroundColor: 'var(--surface-background)',
        icon: ICONS_DATA_URL.MDI_BOOKMARK_CHECK,
        small: true,
        ellipsis: true
      })
    })

    BddTest().then('it should not render the thematic badge', () => {
      expect(wrapper.findComponent(ActivityThematicBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('it is mounted with a declared skill without category', () => {
    beforeEach(() => {
      wrapper = mountCard({
        contextType: EAssociationContextType.DECLARED_SKILL,
        association: { id: 'skill-1', title: 'Gestion de projet agile' }
      })
    })

    BddTest().then('it should not render any badge', () => {
      expectNoBadge()
    })
  })

  BddTest().when('it is mounted with a categorized declared experience', () => {
    beforeEach(() => {
      wrapper = mountCard({
        contextType: EAssociationContextType.DECLARED_EXPERIENCE,
        association: {
          id: 'experience-1',
          title: 'Développeur Web Full Stack',
          category: EExperienceType.PROFESSIONAL,
          description: 'Professionnelle'
        }
      })
    })

    BddTest().then('it should use the light colors and the experience icon', () => {
      expect(findFloatingIconCard().props('color')).toBe('var(--light-background-neutral)')
      expect(findFloatingIconCard().props('iconOptions')).toMatchObject({ name: ICONS.EXPERIENCES, color: 'var(--icon)' })
    })

    BddTest().then('it should not render any badge', () => {
      expectNoBadge()
    })
  })
})
