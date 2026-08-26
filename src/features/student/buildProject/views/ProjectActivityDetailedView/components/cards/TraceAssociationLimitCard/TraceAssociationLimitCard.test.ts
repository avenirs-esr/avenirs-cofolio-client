import type { TraceAssociationLimitCardProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import type { VueWrapper } from '@vue/test-utils'
import { WarningBadgeStub } from '@/common/components/badges/WarningBadge/WarningBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import TraceAssociationLimitCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a TraceAssociationLimitCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociationLimitCard>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
    AvBadge: AvBadgeStub,
    WarningBadge: WarningBadgeStub,
  }

  const getCard = () => wrapper.findComponent(CardStub)
  const getTitle = () =>
    wrapper.findComponent(AvIconTextStub)

  const getBadge = () =>
    wrapper.findComponent(AvBadgeStub)

  const getWarningBadge = () =>
    wrapper.findComponent(WarningBadgeStub)

  BddTest().when('the trace association limit is 7', () => {
    const props: TraceAssociationLimitCardProps = {
      traceAllowedAssociations: 7,
    }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociationLimitCard, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(getCard().exists()).toBe(true)
      expect(getCard().props('backgroundColor')).toBe('var(--card)')
      expect(getCard().props('titleBackground')).toBe('var(--card)')
    })

    BddTest().then('it should render the title', () => {
      expect(getTitle().props('text')).toBe('Limite d\'association')
      expect(getTitle().props('icon')).toBe(MDI_ICONS.ALERT_OUTLINE)
    })

    BddTest().then('it should render the badge', () => {
      expect(getWarningBadge().props('label')).toBe('Limité à 7 traces')
      expect(getWarningBadge().props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('a custom title is provided', () => {
    const props: TraceAssociationLimitCardProps = {
      traceAllowedAssociations: 7,
      title: 'Association de traces'
    }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociationLimitCard, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the provided title', () => {
      expect(getTitle().props('text')).toBe('Association de traces')
    })
  })

  BddTest().when('the trace association limit is unlimited', () => {
    const props: TraceAssociationLimitCardProps = {
      traceAllowedAssociations: -1,
    }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociationLimitCard, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should display "Traces illimitées"', () => {
      expect(getBadge().props('label')).toBe('Traces illimitées')
    })
  })

  BddTest().when('trace associations are disabled', () => {
    const props: TraceAssociationLimitCardProps = {
      traceAllowedAssociations: 0,
    }

    beforeEach(() => {
      wrapper = mountComponent(TraceAssociationLimitCard, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the disabled badge', () => {
      expect(getCard().exists()).toBe(true)
      expect(getBadge().props('label')).toBe('Association de traces désactivée')
    })
  })
})
