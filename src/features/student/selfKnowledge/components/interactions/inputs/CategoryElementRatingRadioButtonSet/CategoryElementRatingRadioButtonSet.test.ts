import { RatingStub } from '@/common/components'
import CategoryElementRatingRadioButtonSet from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementRatingRadioButtonSet/CategoryElementRatingRadioButtonSet.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const AvRadioButtonSetStub = defineComponent({
  name: 'AvRadioButtonSet',
  props: {
    modelValue: [Number, String, Boolean],
    legend: String,
    errorMessage: String,
    name: String
  },
  emits: ['update:modelValue'],
  template: '<fieldset data-testid="radio-button-set"><slot /></fieldset>'
})

const AvRadioButtonStub = defineComponent({
  name: 'AvRadioButton',
  props: {
    value: [Number, String, Boolean]
  },
  template: '<div data-testid="radio-button" :data-value="value"><slot /></div>'
})

const stubs = {
  AvRadioButtonSet: AvRadioButtonSetStub,
  AvRadioButton: AvRadioButtonStub,
  Rating: RatingStub
}

BddTest().given('a self knowledge category element rating input', () => {
  let wrapper: VueWrapper<InstanceType<typeof CategoryElementRatingRadioButtonSet>>

  BddTest().when('the component is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the radio button set', () => {
      const radioSet = wrapper.find('[data-testid="radio-button-set"]')
      expect(radioSet.exists()).toBe(true)
    })

    BddTest().then('it should use the default legend from i18n', () => {
      const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
      expect(radioSet.props('legend')).toBe('Évaluer l\'importance de votre élément')
    })

    BddTest().then('it should use the default name', () => {
      const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
      expect(radioSet.props('name')).toBe('elementRating')
    })

    BddTest().then('it should render all 6 rating levels', () => {
      const radioButtons = wrapper.findAll('[data-testid="radio-button"]')
      expect(radioButtons).toHaveLength(6)
    })

    BddTest().then('it should render rating levels in correct order', () => {
      const radioButtons = wrapper.findAll('[data-testid="radio-button"]')
      expect(radioButtons[0].attributes('data-value')).toBe('5')
      expect(radioButtons[1].attributes('data-value')).toBe('4')
      expect(radioButtons[2].attributes('data-value')).toBe('3')
      expect(radioButtons[3].attributes('data-value')).toBe('2')
      expect(radioButtons[4].attributes('data-value')).toBe('1')
      expect(radioButtons[5].attributes('data-value')).toBe('0')
    })

    BddTest().then('it should display rating component for levels 1-5', () => {
      const ratingComponents = wrapper.findAllComponents(RatingStub)
      expect(ratingComponents).toHaveLength(5)
    })

    BddTest().then('it should not display rating component for level 0', () => {
      const lastButton = wrapper.findAll('[data-testid="radio-button"]')[5]
      const rating = lastButton.findComponent(RatingStub)
      expect(rating.exists()).toBe(false)
    })

    BddTest().then('it should display correct text for essential level', () => {
      expect(wrapper.text()).toContain('Essentiel')
    })

    BddTest().then('it should display correct text for very important level', () => {
      expect(wrapper.text()).toContain('Très important')
    })

    BddTest().then('it should display correct text for important level', () => {
      expect(wrapper.text()).toContain('Important')
    })

    BddTest().then('it should display correct text for less important level', () => {
      expect(wrapper.text()).toContain('Peu important')
    })

    BddTest().then('it should display correct text for not important level', () => {
      expect(wrapper.text()).toContain('Pas important')
    })

    BddTest().then('it should display correct text for not evaluated level', () => {
      expect(wrapper.text()).toContain('Non évalué')
    })
  })

  BddTest().when('the component is mounted with a custom legend', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        props: {
          legend: 'Custom Legend Text'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom legend', () => {
      const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
      expect(radioSet.props('legend')).toBe('Custom Legend Text')
    })
  })

  BddTest().when('the component is mounted with a custom name', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        props: {
          name: 'customName'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should use the custom name', () => {
      const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
      expect(radioSet.props('name')).toBe('customName')
    })
  })

  BddTest().when('the component is mounted with an error message', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        props: {
          errorMessage: 'This field is required'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to the radio button set', () => {
      const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
      expect(radioSet.props('errorMessage')).toBe('This field is required')
    })
  })

  BddTest().when('the component is mounted with a modelValue', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        props: {
          modelValue: 4
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the modelValue to the radio button set', () => {
      const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
      expect(radioSet.props('modelValue')).toBe(4)
    })
  })

  BddTest().when('the user selects a rating value', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        global: { stubs }
      })
    })

    BddTest().and('the selected value is a number', () => {
      beforeEach(async () => {
        const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
        await radioSet.vm.$emit('update:modelValue', 3)
      })

      BddTest().then('it should emit the update:modelValue event with the number', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
      })
    })

    BddTest().and('the selected value is a string', () => {
      beforeEach(async () => {
        const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
        await radioSet.vm.$emit('update:modelValue', '3')
      })

      BddTest().then('it should not emit the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      })
    })

    BddTest().and('the selected value is a boolean', () => {
      beforeEach(async () => {
        const radioSet = wrapper.findComponent(AvRadioButtonSetStub)
        await radioSet.vm.$emit('update:modelValue', true)
      })

      BddTest().then('it should not emit the update:modelValue event', () => {
        expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      })
    })
  })

  BddTest().when('rating components are rendered', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        global: { stubs }
      })
    })

    BddTest().then('it should pass correct rating value for level 5', () => {
      const ratings = wrapper.findAllComponents(RatingStub)
      expect(ratings[0].props('rating')).toBe(5)
      expect(ratings[0].props('maxRating')).toBe(5)
    })

    BddTest().then('it should pass correct rating value for level 4', () => {
      const ratings = wrapper.findAllComponents(RatingStub)
      expect(ratings[1].props('rating')).toBe(4)
      expect(ratings[1].props('maxRating')).toBe(5)
    })

    BddTest().then('it should pass correct rating value for level 3', () => {
      const ratings = wrapper.findAllComponents(RatingStub)
      expect(ratings[2].props('rating')).toBe(3)
      expect(ratings[2].props('maxRating')).toBe(5)
    })

    BddTest().then('it should pass correct rating value for level 2', () => {
      const ratings = wrapper.findAllComponents(RatingStub)
      expect(ratings[3].props('rating')).toBe(2)
      expect(ratings[3].props('maxRating')).toBe(5)
    })

    BddTest().then('it should pass correct rating value for level 1', () => {
      const ratings = wrapper.findAllComponents(RatingStub)
      expect(ratings[4].props('rating')).toBe(1)
      expect(ratings[4].props('maxRating')).toBe(5)
    })
  })

  BddTest().when('the component layout is rendered', () => {
    beforeEach(() => {
      wrapper = mount(CategoryElementRatingRadioButtonSet, {
        global: { stubs }
      })
    })

    BddTest().then('it should have the correct root class', () => {
      expect(wrapper.classes()).toContain('self-knowledge-category-element-rating-input')
    })

    BddTest().then('it should have the flex column layout class', () => {
      expect(wrapper.classes()).toContain('av-col')
      expect(wrapper.classes()).toContain('av-gap-sm')
    })
  })
})
