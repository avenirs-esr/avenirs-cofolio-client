import { ESelfKnowledgeCategory, type SelfKnowledgeElementViewDTO } from '@/api/avenir-esr/generated/types'
import { RatingStub } from '@/common/components/Rating/Rating.stub'
import { FloatingIconCardStub } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import SelfKnowledgeElementCard from '@/features/selfKnowledge/components/cards/SelfKnowledgeElementCard/SelfKnowledgeElementCard.vue'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const stubs = {
  FloatingIconCard: FloatingIconCardStub,
  Rating: RatingStub,
  RouterLink: RouterLinkStub
}

BddTest().given('a self knowledge element card', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementCard>>

  const baseElement: SelfKnowledgeElementViewDTO = {
    id: '1',
    title: 'Test Element',
    description: 'This is a test description for the element',
    category: { type: ESelfKnowledgeCategory.VALUES, mandatory: true }
  }

  BddTest().when('the component is mounted with VALUES category type', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: baseElement,
          categoryType: ESelfKnowledgeCategory.VALUES
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the component', () => {
      const card = wrapper.find('.floating-icon-card')
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should display the correct icon for VALUES', async () => {
      await flushPromises()
      const icon = wrapper.find('.card-icon')
      expect(icon.text()).toBe(MDI_ICONS.DIAMOND_STONE)
    })

    BddTest().then('it should pass the element title to FloatingIconCard', () => {
      const floatingCard = wrapper.findComponent(FloatingIconCardStub)
      expect(floatingCard.props('title')).toBe('Test Element')
    })

    BddTest().then('it should render the element description', () => {
      const description = wrapper.find('.self-knowledge-element-card__body .caption-regular')
      expect(description.exists()).toBe(true)
      expect(description.text()).toBe('This is a test description for the element')
    })

    BddTest().then('it should apply default category color', () => {
      const floatingCard = wrapper.findComponent(FloatingIconCardStub)
      expect(floatingCard.props('color')).toBe('var(--light-foreground-primary1)')
    })
  })

  BddTest().when('the component is mounted with STRENGTHS category type', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: baseElement,
          categoryType: ESelfKnowledgeCategory.STRENGTHS
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the correct icon for STRENGTHS', () => {
      const icon = wrapper.find('.card-icon')
      expect(icon.text()).toBe(MDI_ICONS.WEIGHTS)
    })
  })

  BddTest().when('the component is mounted with ASPIRATIONS category type', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: baseElement,
          categoryType: ESelfKnowledgeCategory.ASPIRATIONS
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the correct icon for ASPIRATIONS', async () => {
      await flushPromises()
      const icon = wrapper.find('.card-icon')
      expect(icon.text()).toBe(RI_ICONS.HAND_HEART_LINE)
    })
  })

  BddTest().when('the component is mounted with a custom category color', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: baseElement,
          categoryType: ESelfKnowledgeCategory.VALUES,
          categoryColor: 'var(--custom-color)'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the custom color to FloatingIconCard', () => {
      const floatingCard = wrapper.findComponent(FloatingIconCardStub)
      expect(floatingCard.props('color')).toBe('var(--custom-color)')
    })
  })

  BddTest().when('the element has a rating', () => {
    beforeEach(() => {
      const elementWithRating: SelfKnowledgeElementViewDTO = {
        ...baseElement,
        rating: 4
      }

      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: elementWithRating,
          categoryType: ESelfKnowledgeCategory.VALUES
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the Rating component', () => {
      const rating = wrapper.findComponent(RatingStub)
      expect(rating.exists()).toBe(true)
    })

    BddTest().then('it should pass the rating value to Rating component', () => {
      const rating = wrapper.findComponent(RatingStub)
      expect(rating.props('rating')).toBe(4)
    })

    BddTest().then('it should render the footer slot', () => {
      const footer = wrapper.find('.card-footer')
      expect(footer.exists()).toBe(true)
      const rating = footer.findComponent(RatingStub)
      expect(rating.exists()).toBe(true)
    })
  })

  BddTest().when('the element does not have a rating', () => {
    beforeEach(() => {
      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: baseElement,
          categoryType: ESelfKnowledgeCategory.VALUES
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the Rating component', () => {
      const rating = wrapper.findComponent(RatingStub)
      expect(rating.exists()).toBe(false)
    })
  })

  BddTest().when('the element has a long description', () => {
    beforeEach(() => {
      const elementWithLongDescription: SelfKnowledgeElementViewDTO = {
        ...baseElement,
        description: 'This is a very long description that should be truncated with line clamp after three lines to maintain consistent card layout and prevent the card from becoming too tall with excessive text content'
      }

      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: elementWithLongDescription,
          categoryType: ESelfKnowledgeCategory.VALUES
        },
        global: { stubs }
      })
    })

    BddTest().then('it should apply line clamp styles to the description', () => {
      const description = wrapper.find('.self-knowledge-element-card__body .caption-regular')
      expect(description.exists()).toBe(true)
      expect(description.classes()).toContain('caption-regular')
    })
  })

  BddTest().when('the component is mounted with all props', () => {
    beforeEach(() => {
      const completeElement: SelfKnowledgeElementViewDTO = {
        id: '123',
        title: 'Complete Element',
        description: 'A complete element with all properties',
        rating: 5,
        category: { type: ESelfKnowledgeCategory.STRENGTHS, mandatory: true }
      }

      wrapper = mountComponent(SelfKnowledgeElementCard, {
        props: {
          element: completeElement,
          categoryType: ESelfKnowledgeCategory.STRENGTHS,
          categoryColor: 'var(--strength-color)'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass all props correctly to FloatingIconCard', () => {
      const floatingCard = wrapper.findComponent(FloatingIconCardStub)
      expect(floatingCard.props('title')).toBe('Complete Element')
      expect(floatingCard.props('iconOptions')).toEqual({ name: MDI_ICONS.WEIGHTS })
      expect(floatingCard.props('color')).toBe('var(--strength-color)')
    })

    BddTest().then('it should render both body and footer slots', () => {
      const description = wrapper.find('.self-knowledge-element-card__body .caption-regular')
      const rating = wrapper.findComponent(RatingStub)
      expect(description.exists()).toBe(true)
      expect(rating.exists()).toBe(true)
      expect(description.text()).toBe('A complete element with all properties')
      expect(rating.props('rating')).toBe(5)
    })
  })
})
