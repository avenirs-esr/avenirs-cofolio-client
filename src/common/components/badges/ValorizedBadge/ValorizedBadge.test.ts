import type { VueWrapper } from '@vue/test-utils'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the trace is valorized', () => {
    beforeEach(() => {
      wrapper = mountComponent(ValorizedBadge, {
        props: {
          valorized: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the valorized badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('Valorisée dans mon kit')
    })
  })

  BddTest().when('the trace is not valorized', () => {
    beforeEach(() => {
      wrapper = mountComponent(ValorizedBadge, {
        props: {
          valorized: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the non valorized badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('Non valorisée dans mon kit')
    })
  })
})
