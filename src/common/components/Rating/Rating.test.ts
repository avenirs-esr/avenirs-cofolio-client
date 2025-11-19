import Rating from '@/common/components/Rating/Rating.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a rating component', () => {
  BddTest().when('the component is rendered with a rating of 3', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 3
        }
      })
    })

    BddTest().then('it should render 3 star emojis', () => {
      const stars = wrapper.findAll('span').filter(span => span.text() === '⭐')
      expect(stars).toHaveLength(3)
    })

    BddTest().then('it should display the rating value as "3/5"', () => {
      const ratingValue = wrapper.find('.rating__value')
      expect(ratingValue.text()).toBe('3/5')
    })

    BddTest().then('it should have the rating class', () => {
      expect(wrapper.find('.rating').exists()).toBe(true)
    })

    BddTest().then('it should have the rating__value class with b2-bold', () => {
      const ratingValue = wrapper.find('.rating__value')
      expect(ratingValue.exists()).toBe(true)
      expect(ratingValue.classes()).toContain('b2-bold')
    })
  })

  BddTest().when('the component is rendered with a rating of 5 and maxRating of 10', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 5,
          maxRating: 10
        }
      })
    })

    BddTest().then('it should render 5 star emojis', () => {
      const stars = wrapper.findAll('span').filter(span => span.text() === '⭐')
      expect(stars).toHaveLength(5)
    })

    BddTest().then('it should display the rating value as "5/10"', () => {
      const ratingValue = wrapper.find('.rating__value')
      expect(ratingValue.text()).toBe('5/10')
    })
  })

  BddTest().when('the component is rendered with a rating of 0', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 0
        }
      })
    })

    BddTest().then('it should not render any star emojis', () => {
      const stars = wrapper.findAll('span').filter(span => span.text() === '⭐')
      expect(stars).toHaveLength(0)
    })

    BddTest().then('it should display the rating value as "0/5"', () => {
      const ratingValue = wrapper.find('.rating__value')
      expect(ratingValue.text()).toBe('0/5')
    })
  })

  BddTest().when('the component is rendered with maxRating not provided', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 4
        }
      })
    })

    BddTest().then('it should use 5 as the default maxRating', () => {
      const ratingValue = wrapper.find('.rating__value')
      expect(ratingValue.text()).toBe('4/5')
    })
  })

  BddTest().when('the component is rendered with different rating values', () => {
    BddTest().then('it should render correctly for various combinations', () => {
      const testCases = [
        { rating: 1, maxRating: 5, expectedStars: 1, expectedText: '1/5' },
        { rating: 2, maxRating: 5, expectedStars: 2, expectedText: '2/5' },
        { rating: 4, maxRating: 5, expectedStars: 4, expectedText: '4/5' },
        { rating: 5, maxRating: 5, expectedStars: 5, expectedText: '5/5' },
        { rating: 3, maxRating: 10, expectedStars: 3, expectedText: '3/10' },
        { rating: 7, maxRating: 10, expectedStars: 7, expectedText: '7/10' }
      ]

      testCases.forEach(({ rating, maxRating, expectedStars, expectedText }) => {
        const wrapper = mount(Rating, {
          props: {
            rating,
            maxRating
          }
        })

        const stars = wrapper.findAll('span').filter(span => span.text() === '⭐')
        expect(stars).toHaveLength(expectedStars)

        const ratingValue = wrapper.find('.rating__value')
        expect(ratingValue.text()).toBe(expectedText)
      })
    })
  })
})
