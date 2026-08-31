import { createMockedDeclaredExperiencesAssociations } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { AssociationsCardStub } from '@/features/global/components/cards/AssociationsCard/AssociationsCard.stub'
import { AssociatedDeclaredExperienceCardStub }
  from '@/features/personalCareer/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.stub'
import AssociatedDeclaredExperiencesCard, {
  type AssociatedDeclaredExperiencesCardProps
} from '@/features/personalCareer/components/cards/AssociatedDeclaredExperiencesCard/AssociatedDeclaredExperiencesCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an associated declared experiences card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedDeclaredExperiencesCard>>

  const stubs = {
    AssociationsCard: AssociationsCardStub,
    AssociatedDeclaredExperienceCard: AssociatedDeclaredExperienceCardStub
  }

  const mockedAssociations = createMockedDeclaredExperiencesAssociations(3)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with associated experiences', () => {
    const props: AssociatedDeclaredExperiencesCardProps = {
      associatedExperiences: mockedAssociations
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperiencesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render a card for each associated experience', () => {
      const experienceCards = wrapper.findAllComponents(AssociatedDeclaredExperienceCardStub)
      expect(experienceCards).toHaveLength(mockedAssociations.length)
    })

    BddTest().then('it should pass each declared experience to its card', () => {
      const experienceCards = wrapper.findAllComponents(AssociatedDeclaredExperienceCardStub)
      experienceCards.forEach((card, index) => {
        expect(card.props('declaredExperience')).toEqual(mockedAssociations[index].declaredExperience)
      })
    })

    BddTest().then('it should pass the plural title with count', () => {
      expect(wrapper.findComponent(AssociationsCardStub).props('title')).toBe(`Mes expériences déclarées associées (${mockedAssociations.length})`)
    })
  })

  BddTest().when('the component is mounted with a single associated experience', () => {
    const props: AssociatedDeclaredExperiencesCardProps = {
      associatedExperiences: [mockedAssociations[0]]
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperiencesCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass the singular title with count', () => {
      expect(wrapper.findComponent(AssociationsCardStub).props('title')).toBe('Mon expérience déclarée associée (1)')
    })
  })

  BddTest().when('the component is mounted with no associated experiences', () => {
    const props: AssociatedDeclaredExperiencesCardProps = {
      associatedExperiences: []
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperiencesCard, { props, global: { stubs } })
    })

    BddTest().then('it should render nothing', () => {
      expect(wrapper.findComponent(AssociationsCardStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    const props: AssociatedDeclaredExperiencesCardProps = {
      associatedExperiences: mockedAssociations,
      disabled: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperiencesCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass disabled=true to each AssociatedDeclaredExperienceCard', () => {
      const experienceCards = wrapper.findAllComponents(AssociatedDeclaredExperienceCardStub)
      expect(experienceCards.length).toBeGreaterThan(0)
      experienceCards.forEach(card => expect(card.props('disabled')).toBe(true))
    })
  })
})
