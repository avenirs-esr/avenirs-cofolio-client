import { mockedTraceDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/traces.fixtures'
import AssociatedDeclaredActivitiesCard, { type AssociatedDeclaredActivitiesCardProps } from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.vue'
import { AssociatedActivityCardStub } from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AvCardStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated declared activities card', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvCard: AvCardStub,
    AvIconText: AvIconTextStub,
    AssociatedActivityCard: AssociatedActivityCardStub,
  }

  BddTest().when('the component is mounted with associated activities', () => {
    const props: AssociatedDeclaredActivitiesCardProps = {
      associatedActivities: mockedTraceDeclaredActivityAssociations
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedDeclaredActivitiesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the av card', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render a card for each associated activity', () => {
      const activityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(activityCards).toHaveLength(props.associatedActivities.length)
    })

    BddTest().then('it should display the plural title with count', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe(`Mes activités déclarées associées (${props.associatedActivities.length})`)
    })
  })

  BddTest().when('the component is mounted with a single associated activity', () => {
    const props: AssociatedDeclaredActivitiesCardProps = {
      associatedActivities: [mockedTraceDeclaredActivityAssociations[0]]
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedDeclaredActivitiesCard, { props, global: { stubs } })
    })

    BddTest().then('it should display the singular title with count', () => {
      expect(wrapper.findComponent(AvIconTextStub).props('text')).toBe('Mon activité déclarée associée (1)')
    })
  })

  BddTest().when('the component is mounted with no associated activities', () => {
    const props: AssociatedDeclaredActivitiesCardProps = {
      associatedActivities: []
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociatedDeclaredActivitiesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render nothing', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(false)
    })
  })
})
