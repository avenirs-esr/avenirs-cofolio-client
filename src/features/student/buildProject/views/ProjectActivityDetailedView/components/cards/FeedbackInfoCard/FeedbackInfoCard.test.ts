import type { FeedbackInfoCardProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackInfoCard/FeedbackInfoCard.vue'
import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { WarningBadgeStub } from '@/common/components/badges/WarningBadge/WarningBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ICONS } from '@/common/constants'
import FeedbackInfoCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackInfoCard/FeedbackInfoCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a FeedbackInfoCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackInfoCard>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    AvBadge: AvBadgeStub,
    WarningBadge: WarningBadgeStub,
  }

  const getCard = () => wrapper.findComponent(CardStub)
  const getTitleIconText = () => wrapper.findAllComponents(AvIconTextStub).find(c => c.attributes('data-testid') === 'feedback-info-card-title')
  const getDescriptionIconText = () => wrapper.findAllComponents(AvIconTextStub).find(c => c.attributes('data-testid') === 'feedback-info-card-description')
  const getIterationsBadge = () => wrapper.findComponent(AvBadgeStub)
  const getWarningBadge = () => wrapper.findComponent(WarningBadgeStub)

  BddTest().when('the activity allows 2 feedback iterations', () => {
    const props: FeedbackInfoCardProps = {
      activity: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, feedbackAllowedIterations: 2 },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(FeedbackInfoCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the card with the correct background props', () => {
      const card = getCard()
      expect(card.exists()).toBe(true)
      expect(card.props('backgroundColor')).toBe('var(--card)')
      expect(card.props('titleBackground')).toBe('var(--card)')
    })

    BddTest().then('it should render the title with correct icon and text', () => {
      const title = getTitleIconText()
      expect(title?.exists()).toBe(true)
      expect(title?.props('text')).toBe('Demande de feedback')
      expect(title?.props('icon')).toBe(ICONS.FEEDBACK)
      expect(title?.props('iconColor')).toBe('var(--dark-background-primary1)')
      expect(title?.props('textColor')).toBe('var(--text1)')
    })

    BddTest().then('it should render the description with correct icon and text', () => {
      const description = getDescriptionIconText()
      expect(description?.exists()).toBe(true)
      expect(description?.props('icon')).toBe(MDI_ICONS.INFORMATION_OUTLINE)
      expect(description?.props('iconColor')).toBe('var(--text2)')
      expect(description?.props('textColor')).toBe('var(--text2)')
    })

    BddTest().then('it should render the iterations badge with "Limité à 2 itérations"', () => {
      const badge = getWarningBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Limité à 2 itérations')
    })
  })

  BddTest().when('the activity allows 1 feedback iteration', () => {
    const props: FeedbackInfoCardProps = {
      activity: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, feedbackAllowedIterations: 1 },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(FeedbackInfoCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the iterations badge with the singular form', () => {
      expect(getWarningBadge().props('label')).toBe('Limité à 1 itération')
    })
  })

  BddTest().when('the activity has unlimited feedback iterations (-1)', () => {
    const props: FeedbackInfoCardProps = {
      activity: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, feedbackAllowedIterations: -1 },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(FeedbackInfoCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the iterations badge with "Aucune limite"', () => {
      expect(getIterationsBadge().props('label')).toBe('Aucune limite')
    })
  })

  BddTest().when('the activity has disabled feedback iterations (0)', () => {
    const props: FeedbackInfoCardProps = {
      activity: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, feedbackAllowedIterations: 0 },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(FeedbackInfoCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the iterations badge with "Feedback désactivé"', () => {
      const badge = getIterationsBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Feedback désactivé')
      expect(badge.props('icon')).toBe(ICONS.FEEDBACK)
      expect(badge.props('color')).toBe('var(--text1)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(badge.props('borderColor')).toBe('transparent')
    })
  })
})
