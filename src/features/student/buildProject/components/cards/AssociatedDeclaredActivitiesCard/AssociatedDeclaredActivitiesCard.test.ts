import { mockedTraceDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/traces.fixtures'
import AssociatedDeclaredActivitiesCard, { type AssociatedDeclaredActivitiesCardProps } from '@/features/student/buildProject/components/cards/AssociatedDeclaredActivitiesCard/AssociatedDeclaredActivitiesCard.vue'
import { AssociatedActivityCardStub } from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.stub'
import { AssociationsCardStub } from '@/features/student/global/components/cards/AssociationsCard/AssociationsCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an associated declared activities card', () => {
  let wrapper: VueWrapper

  const stubs = {
    AssociationsCard: AssociationsCardStub,
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

    BddTest().then('it should render a card for each associated activity', () => {
      const activityCards = wrapper.findAllComponents(AssociatedActivityCardStub)
      expect(activityCards).toHaveLength(props.associatedActivities.length)
    })

    BddTest().then('it should pass the plural title with count', () => {
      expect(wrapper.findComponent(AssociationsCardStub).props('title')).toBe(`Mes activités déclarées associées (${props.associatedActivities.length})`)
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

    BddTest().then('it should pass the singular title with count', () => {
      expect(wrapper.findComponent(AssociationsCardStub).props('title')).toBe('Mon activité déclarée associée (1)')
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
      expect(wrapper.findComponent(AssociationsCardStub).exists()).toBe(false)
    })
  })
})
