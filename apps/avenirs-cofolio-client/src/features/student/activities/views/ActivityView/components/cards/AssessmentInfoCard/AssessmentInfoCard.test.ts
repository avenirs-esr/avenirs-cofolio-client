import type { VueWrapper } from '@vue/test-utils'
import type { AssessmentInfoCardProps } from '@/features/student/activities/views/ActivityView/components/cards/AssessmentInfoCard/AssessmentInfoCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { CardStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import AssessmentInfoCard from '@/features/student/activities/views/ActivityView/components/cards/AssessmentInfoCard/AssessmentInfoCard.vue'

BddTest().given('an AssessmentInfoCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentInfoCard>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    AvBadge: AvBadgeStub,
  }

  const mountWith = (props: AssessmentInfoCardProps) => {
    wrapper = mountComponent(AssessmentInfoCard, { props, global: { stubs } })
  }

  const getBadge = (testid: string) =>
    wrapper.findAllComponents(AvBadgeStub).find(badge => badge.attributes('data-testid') === testid)

  BddTest().when('the activity has no assessment', () => {
    beforeEach(() => {
      mountWith({ assessment: undefined })
    })

    BddTest().then('it should render the card with the correct background props', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
      expect(card.props('backgroundColor')).toBe('var(--card)')
      expect(card.props('titleBackground')).toBe('var(--card)')
    })

    BddTest().then('it should render the title with correct icon and text', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.props('text')).toBe('Évaluation de l\'activité')
      expect(title.props('icon')).toBe(MDI_ICONS.TEXT_BOX_CHECK_OUTLINE)
      expect(title.props('iconColor')).toBe('var(--dark-background-primary1)')
      expect(title.props('textColor')).toBe('var(--text1)')
    })

    BddTest().then('it should only render the disabled badge', () => {
      const badges = wrapper.findAllComponents(AvBadgeStub)
      expect(badges).toHaveLength(1)

      const badge = getBadge('assessment-info-card-disabled-badge')
      expect(badge?.props('label')).toBe('Évaluation désactivée')
      expect(badge?.props('icon')).toBe(MDI_ICONS.TEXT_BOX_CHECK_OUTLINE)
      expect(badge?.props('color')).toBe('var(--text1)')
      expect(badge?.props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(badge?.props('borderColor')).toBe('transparent')
    })
  })

  BddTest().when('the activity assessment has a comment and a grade', () => {
    beforeEach(() => {
      mountWith({ assessment: { comment: true, grade: 20 } })
    })

    BddTest().then('it should not render the disabled badge', () => {
      expect(getBadge('assessment-info-card-disabled-badge')).toBeUndefined()
    })

    BddTest().then('it should render the qualitative assessment badge', () => {
      const badge = getBadge('assessment-info-card-comment-badge')
      expect(badge?.props('label')).toBe('Appréciation qualitative')
      expect(badge?.props('icon')).toBe(MDI_ICONS.POST_IT_NOTES_OUTLINE)
    })

    BddTest().then('it should render the grade badge with its scale', () => {
      const badge = getBadge('assessment-info-card-grade-badge')
      expect(badge?.props('label')).toBe('Note sur 20')
      expect(badge?.props('icon')).toBe(MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER)
    })

    BddTest().then('it should not render the validation badge', () => {
      expect(getBadge('assessment-info-card-validation-badge')).toBeUndefined()
    })
  })

  BddTest().when('the activity assessment only has a validation', () => {
    beforeEach(() => {
      mountWith({ assessment: { validation: true } })
    })

    BddTest().then('it should render the validation badge', () => {
      const badge = getBadge('assessment-info-card-validation-badge')
      expect(badge?.props('label')).toBe('Validation')
      expect(badge?.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
    })

    BddTest().then('it should not render the qualitative assessment nor the grade badges', () => {
      expect(getBadge('assessment-info-card-comment-badge')).toBeUndefined()
      expect(getBadge('assessment-info-card-grade-badge')).toBeUndefined()
    })
  })
})
