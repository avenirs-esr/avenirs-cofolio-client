import { mockedSelfKnowledgeElementDetails } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { ESelfKnowledgeCategory, type SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { RatingStub } from '@/common/components/Rating/Rating.stub'
import { CategoryElementDescriptionTextareaStub } from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.stub'
import { CategoryElementTitleInputStub } from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementTitleInput/CategoryElementTitleInput.stub'
import SelfKnowledgeElementDetails, { type SelfKnowledgeElementDetailsProps } from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/components/SelfKnowledgeElementDetails/SelfKnowledgeElementDetails.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const NOT_RATED_LABEL = 'Non évalué'
const RATING_LABEL = 'Degré d\'importance'

const defaultProps: SelfKnowledgeElementDetailsProps = {
  element: mockedSelfKnowledgeElementDetails,
  category: ESelfKnowledgeCategory.STRENGTHS,
}

BddTest().given('a SelfKnowledgeElementDetails component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementDetails>>

  const stubs = {
    CategoryElementTitleInput: CategoryElementTitleInputStub,
    CategoryElementDescriptionTextarea: CategoryElementDescriptionTextareaStub,
    Rating: RatingStub,
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
    ValorizedBadge: ValorizedBadgeStub
  }

  const mountWith = (props: Partial<SelfKnowledgeElementDetailsProps> = {}) => {
    wrapper = mount(SelfKnowledgeElementDetails, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs }
    })
  }

  const getCategoryElementDescriptionTextarea = () => wrapper.findComponent(CategoryElementDescriptionTextareaStub)
  const getCategoryElementTitleInput = () => wrapper.findComponent(CategoryElementTitleInputStub)
  const getCreationUpdateDateDetails = () => wrapper.findComponent(CreationUpdateDateDetailsStub)
  const getRating = () => wrapper.findComponent(RatingStub)
  const getValorizedBadge = () => wrapper.findComponent(ValorizedBadgeStub)

  const getLeftColumn = () => wrapper.find('.self-knowledge-element-details__left-column')
  const getRightColumn = () => wrapper.find('.self-knowledge-element-details__right-column')
  const getRatingLabels = () => wrapper.findAll('.b2-light')
  const getRoot = () => wrapper.find('.self-knowledge-element-details')

  BddTest().when('the component is mounted with element data', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
      expect(getRoot().exists()).toBe(true)
    })

    BddTest().then('it should render the title input with correct props', () => {
      const titleInput = getCategoryElementTitleInput()
      expect(titleInput.exists()).toBe(true)
      expect(titleInput.props('modelValue')).toBe(defaultProps.element.title)
      expect(titleInput.props('required')).toBe(false)
      expect(titleInput.props('category')).toBe(ESelfKnowledgeCategory.STRENGTHS)
    })

    BddTest().then('it should render the description textarea with correct value', () => {
      const descriptionTextarea = getCategoryElementDescriptionTextarea()
      expect(descriptionTextarea.exists()).toBe(true)
      expect(descriptionTextarea.props('modelValue')).toBe(defaultProps.element.description)
    })

    BddTest().then('it should render the rating label in French', () => {
      const ratingLabels = getRatingLabels()
      expect(ratingLabels.length).toBeGreaterThan(0)
      expect(ratingLabels[0].text()).toBe(RATING_LABEL)
    })

    BddTest().then('it should render the rating component with correct props', () => {
      const rating = getRating()
      expect(rating.exists()).toBe(true)
      expect(rating.props('rating')).toBe(defaultProps.element.rating)
    })

    BddTest().then('it should not render the not rated label', () => {
      expect(wrapper.text()).not.toContain(NOT_RATED_LABEL)
    })

    BddTest().then('it should render the creation and update date details', () => {
      const dateDetails = getCreationUpdateDateDetails()
      expect(dateDetails.exists()).toBe(true)
      expect(dateDetails.props('updatedAt')).toBe(defaultProps.element.updatedAt)
      expect(dateDetails.props('createdAt')).toContain(defaultProps.element.createdAt)
    })

    BddTest().then('it should have left and right columns', () => {
      expect(getLeftColumn().exists()).toBe(true)
      expect(getRightColumn().exists()).toBe(true)
    })

    BddTest().then('it should render the valorized badge with false when element has no valorized field', () => {
      const badge = getValorizedBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })

  BddTest().and('the element is valorized', () => {
    const element: SelfKnowledgeElementDetailsDTO = {
      ...defaultProps.element,
      valorized: true
    }

    beforeEach(() => {
      mountWith({ element })
    })

    BddTest().then('it should render the valorized badge with true', () => {
      const badge = getValorizedBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(true)
    })
  })

  BddTest().and('the element is explicitly not valorized', () => {
    const element: SelfKnowledgeElementDetailsDTO = {
      ...defaultProps.element,
      valorized: false
    }

    beforeEach(() => {
      mountWith({ element })
    })

    BddTest().then('it should render the valorized badge with false', () => {
      const badge = getValorizedBadge()
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })

  BddTest().and('the element has no rating', () => {
    const element: SelfKnowledgeElementDetailsDTO = {
      ...defaultProps.element,
      rating: undefined
    }

    beforeEach(() => {
      mountWith({ element })
    })

    BddTest().then('it should not render the rating component', () => {
      expect(getRating().exists()).toBe(false)
    })

    BddTest().then('it should render the not rated label', () => {
      const labels = getRatingLabels()
      expect(labels).toHaveLength(2)
      expect(labels[1].text()).toBe(NOT_RATED_LABEL)
    })
  })

  BddTest().and('the element has a rating of 0', () => {
    const element: SelfKnowledgeElementDetailsDTO = {
      ...defaultProps.element,
      rating: 0
    }

    beforeEach(() => {
      mountWith({ element })
    })

    BddTest().then('it should not render the rating component', () => {
      expect(getRating().exists()).toBe(false)
    })

    BddTest().then('it should render the not rated label', () => {
      const labels = getRatingLabels()
      expect(labels).toHaveLength(2)
      expect(labels[1].text()).toBe(NOT_RATED_LABEL)
    })
  })

  BddTest().and('the element has a different rating value', () => {
    const element: SelfKnowledgeElementDetailsDTO = {
      ...defaultProps.element,
      rating: 5
    }

    beforeEach(() => {
      mountWith({ element })
    })

    BddTest().then('it should render the updated rating', () => {
      expect(getRating().props('rating')).toBe(element.rating)
    })
  })

  BddTest().and('the element has different title and description', () => {
    const element: SelfKnowledgeElementDetailsDTO = {
      id: 'element-456',
      title: 'Test Title',
      description: 'Test Description',
      rating: 3,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-02T12:00:00Z'
    }

    beforeEach(() => {
      mountWith({ element })
    })

    BddTest().then('it should render the custom title', () => {
      expect(getCategoryElementTitleInput().props('modelValue')).toBe(element.title)
    })

    BddTest().then('it should render the custom description', () => {
      expect(getCategoryElementDescriptionTextarea().props('modelValue')).toBe(element.description)
    })

    BddTest().then('it should render the custom rating', () => {
      expect(getRating().props('rating')).toBe(element.rating)
    })
  })
})
