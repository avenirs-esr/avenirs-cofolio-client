import type { TraceAssociationLimitCardProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.vue'
import type { VueWrapper } from '@vue/test-utils'
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
  }

  const getCard = () => wrapper.findComponent(CardStub)
  const getTitle = () =>
    wrapper.findComponent(AvIconTextStub)

  const getBadge = () =>
    wrapper.findComponent(AvBadgeStub)

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
      expect(getCard().props('backgroundColor')).toBe('var(--card2)')
      expect(getCard().props('titleBackground')).toBe('var(--card2)')
    })

    BddTest().then('it should render the title', () => {
      expect(getTitle().props('text')).toBe('Limite d\'association')
      expect(getTitle().props('icon')).toBe(MDI_ICONS.ALERT_OUTLINE)
    })

    BddTest().then('it should render the badge', () => {
      expect(getBadge().props('label')).toBe('7 traces')
      expect(getBadge().props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
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

    BddTest().then('it should not render the card', () => {
      expect(getCard().exists()).toBe(false)
    })
  })
})
