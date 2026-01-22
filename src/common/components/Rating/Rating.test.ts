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
      const ratingValue = wrapper.find('[data-testid="rating__value"]')
      expect(ratingValue.text()).toBe('3/5')
    })

    BddTest().then('it should have the rating class', () => {
      expect(wrapper.find('.rating').exists()).toBe(true)
    })

    BddTest().then('it should have the rating__value class with b2-bold', () => {
      const ratingValue = wrapper.find('[data-testid="rating__value"]')
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
      const ratingValue = wrapper.find('[data-testid="rating__value"]')
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
      const ratingValue = wrapper.find('[data-testid="rating__value"]')
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
      const ratingValue = wrapper.find('[data-testid="rating__value"]')
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

        const ratingValue = wrapper.find('[data-testid="rating__value"]')
        expect(ratingValue.text()).toBe(expectedText)
      })
    })
  })

  BddTest().when('the component is rendered with starsFirst set to true (default)', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 3,
          starsFirst: true
        }
      })
    })

    BddTest().then('it should render stars before the rating value', () => {
      const ratingDiv = wrapper.find('.rating')
      const text = ratingDiv.text()

      const starPosition = text.indexOf('⭐')
      const ratingPosition = text.indexOf('3/5')

      expect(starPosition).toBeLessThan(ratingPosition)
    })
  })

  BddTest().when('the component is rendered with starsFirst set to false', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 3,
          starsFirst: false
        }
      })
    })

    BddTest().then('it should render the rating value before stars', () => {
      const ratingDiv = wrapper.find('.rating')
      const text = ratingDiv.text()

      const ratingPosition = text.indexOf('3/5')
      const starPosition = text.indexOf('⭐')

      expect(ratingPosition).toBeLessThan(starPosition)
    })

    BddTest().then('it should still render 3 star emojis', () => {
      const stars = wrapper.findAll('span').filter(span => span.text() === '⭐')
      expect(stars).toHaveLength(3)
    })

    BddTest().then('it should still display the rating value as "3/5"', () => {
      const ratingValue = wrapper.find('[data-testid="rating__value"]')
      expect(ratingValue.text()).toBe('3/5')
    })
  })

  BddTest().when('the component is rendered without starsFirst prop', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 2
        }
      })
    })

    BddTest().then('it should default to starsFirst=true and render stars before the rating value', () => {
      const ratingDiv = wrapper.find('.rating')
      const text = ratingDiv.text()

      const starPosition = text.indexOf('⭐')
      const ratingPosition = text.indexOf('2/5')

      expect(starPosition).toBeLessThan(ratingPosition)
    })
  })

  BddTest().when('the component is rendered with withBackground set to false', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 3,
          withBackground: false
        }
      })
    })

    BddTest().then('it should not have the rating--with-background class', () => {
      expect(wrapper.find('.rating--with-background').exists()).toBe(false)
    })

    BddTest().then('it should have the rating class', () => {
      expect(wrapper.find('.rating').exists()).toBe(true)
    })
  })

  BddTest().when('the component is rendered with withBackground set to true', () => {
    let wrapper: VueWrapper<InstanceType<typeof Rating>>

    beforeEach(() => {
      wrapper = mount(Rating, {
        props: {
          rating: 3,
          withBackground: true
        }
      })
    })

    BddTest().then('it should have the rating--with-background class', () => {
      expect(wrapper.find('.rating--with-background').exists()).toBe(true)
    })
  })
})
