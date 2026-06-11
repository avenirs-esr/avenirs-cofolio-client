import Card from '@/common/components/cards/Card/Card.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('a Card component', () => {
  let wrapper: ReturnType<typeof mount<typeof Card>>

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(Card, {
        global: {
          stubs: { AvCard: AvCardStub }
        }
      })
    })

    BddTest().then('it should render an AvCard with correct translated labels', () => {
      expect(wrapper.findComponent(AvCardStub).props('collapseLabel')).toBe('Réduire')
      expect(wrapper.findComponent(AvCardStub).props('expandLabel')).toBe('Développer')
    })
  })
})
