import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import { mockedSelfKnowledgeElementDetails } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { RatingStub } from '@/common/components/Rating/Rating.stub'
import { CategoryElementDescriptionTextareaStub } from '@/features/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.stub'
import { CategoryElementTitleInputStub } from '@/features/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.stub'
import SelfKnowledgeElementDetails from '@/features/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a SelfKnowledgeElementDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementDetails>>

  const stubs = {
    CategoryElementTitleInput: CategoryElementTitleInputStub,
    CategoryElementDescriptionTextarea: CategoryElementDescriptionTextareaStub,
    Rating: RatingStub,
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  const defaultElement: SelfKnowledgeElementDetailsDTO = {
    ...mockedSelfKnowledgeElementDetails
  }

  BddTest().when('the component is mounted with element data', () => {
    beforeEach(() => {
      wrapper = mount(SelfKnowledgeElementDetails, {
        props: {
          element: defaultElement
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.self-knowledge-element-details').exists()).toBe(true)
    })

    BddTest().then('it should render the title input with correct props', () => {
      const titleInput = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(titleInput.exists()).toBe(true)
      expect(titleInput.props('modelValue')).toBe('Créativité')
      expect(titleInput.props('required')).toBe(false)
    })

    BddTest().then('it should render the description textarea with correct value', () => {
      const descriptionTextarea = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      expect(descriptionTextarea.exists()).toBe(true)
      expect(descriptionTextarea.props('modelValue')).toBe('Je suis capable de trouver des solutions originales et innovantes aux problèmes')
    })

    BddTest().then('it should render the rating label in French', () => {
      expect(wrapper.find('.b2-light').text()).toBe('Degré d\'importance')
    })

    BddTest().then('it should render the rating component with correct props', () => {
      const rating = wrapper.findComponent({ name: 'Rating' })
      expect(rating.exists()).toBe(true)
      expect(rating.props('rating')).toBe(4)
    })

    BddTest().then('it should render the creation and update date details', () => {
      const dateDetails = wrapper.findComponent({ name: 'CreationUpdateDateDetails' })
      expect(dateDetails.exists()).toBe(true)
      expect(dateDetails.props('updatedAt')).toBe('2023-10-15T12:00:00Z')
      expect(dateDetails.props('createdAtPrefix')).toContain('Élément')
      expect(dateDetails.props('createdAt')).toContain('2023-10-10T10:00:00Z')
    })

    BddTest().then('it should have left and right columns', () => {
      expect(wrapper.find('.self-knowledge-element-details__left-column').exists()).toBe(true)
      expect(wrapper.find('.self-knowledge-element-details__right-column').exists()).toBe(true)
    })

    BddTest().then('it should render the valorized badge with false when element has no valorized field', () => {
      const badge = wrapper.findComponent({ name: 'ValorizedBadge' })
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })

  BddTest().and('the element is valorized', () => {
    beforeEach(() => {
      wrapper = mount(SelfKnowledgeElementDetails, {
        props: {
          element: { ...defaultElement, valorized: true }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the valorized badge with true', () => {
      const badge = wrapper.findComponent({ name: 'ValorizedBadge' })
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(true)
    })
  })

  BddTest().and('the element is explicitly not valorized', () => {
    beforeEach(() => {
      wrapper = mount(SelfKnowledgeElementDetails, {
        props: {
          element: { ...defaultElement, valorized: false }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the valorized badge with false', () => {
      const badge = wrapper.findComponent({ name: 'ValorizedBadge' })
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })

  BddTest().and('the element has no rating', () => {
    beforeEach(() => {
      const elementWithoutRating: SelfKnowledgeElementDetailsDTO = {
        ...defaultElement,
        rating: undefined
      }
      wrapper = mount(SelfKnowledgeElementDetails, {
        props: {
          element: elementWithoutRating
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render rating as 0', () => {
      const rating = wrapper.findComponent({ name: 'Rating' })
      expect(rating.props('rating')).toBe(0)
    })
  })

  BddTest().and('the element has a different rating value', () => {
    beforeEach(() => {
      const elementWithDifferentRating: SelfKnowledgeElementDetailsDTO = {
        ...defaultElement,
        rating: 5
      }
      wrapper = mount(SelfKnowledgeElementDetails, {
        props: {
          element: elementWithDifferentRating
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the updated rating', () => {
      const rating = wrapper.findComponent({ name: 'Rating' })
      expect(rating.props('rating')).toBe(5)
    })
  })

  BddTest().and('the element has different title and description', () => {
    beforeEach(() => {
      const customElement: SelfKnowledgeElementDetailsDTO = {
        id: 'element-456',
        title: 'Test Title',
        description: 'Test Description',
        rating: 3,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-02T12:00:00Z'
      }
      wrapper = mount(SelfKnowledgeElementDetails, {
        props: {
          element: customElement
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the custom title', () => {
      const titleInput = wrapper.findComponent({ name: 'CategoryElementTitleInput' })
      expect(titleInput.props('modelValue')).toBe('Test Title')
    })

    BddTest().then('it should render the custom description', () => {
      const descriptionTextarea = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      expect(descriptionTextarea.props('modelValue')).toBe('Test Description')
    })

    BddTest().then('it should render the custom rating', () => {
      const rating = wrapper.findComponent({ name: 'Rating' })
      expect(rating.props('rating')).toBe(3)
    })
  })
})
