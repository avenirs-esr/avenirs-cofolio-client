import type { VueWrapper } from '@vue/test-utils'
import { EActivityThematic } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import DeclaredActivityCompactCard, {
  type DeclaredActivityCompactCardProps
} from '@/features/buildProject/components/cards/DeclaredActivityCompactCard/DeclaredActivityCompactCard.vue'
import { FloatingIconCardStub } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared activity compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredActivityCompactCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    ActivityThematicBadge: ActivityThematicBadgeStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with activity without thematic', () => {
    const props: DeclaredActivityCompactCardProps = {
      activity: { id: 'activity-1', title: 'Activité sans thématique' }
    }

    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredActivityCompactCard, {
        props,
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should pass the activity title to the card', () => {
      expect(floatingCard.props('title')).toBe(props.activity.title)
    })

    BddTest().then('it should use the neutral background color', () => {
      expect(floatingCard.props('color')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should use the text1 title color', () => {
      expect(floatingCard.props('titleColor')).toBe('var(--text1)')
    })

    BddTest().then('it should not render the thematic badge', () => {
      const badge = wrapper.findComponent({ name: 'ActivityThematicBadge' })
      expect(badge.exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with activity with thematic', () => {
    const props: DeclaredActivityCompactCardProps = {
      activity: {
        id: 'activity-2',
        title: 'Définir ses valeurs',
        thematic: EActivityThematic.SELF_KNOWLEDGE
      }
    }

    let badge: VueWrapper<InstanceType<typeof ActivityThematicBadgeStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredActivityCompactCard, {
        props,
        global: { stubs }
      })
      badge = wrapper.findComponent({ name: 'ActivityThematicBadge' }) as VueWrapper<InstanceType<typeof ActivityThematicBadgeStub>>
    })

    BddTest().then('it should render the thematic badge', () => {
      expect(badge.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct thematic to the badge', () => {
      expect(badge.props('thematic')).toBe(EActivityThematic.SELF_KNOWLEDGE)
    })

    BddTest().then('it should pass small prop to the badge', () => {
      expect(badge.props('small')).toBe(true)
    })
  })
})
