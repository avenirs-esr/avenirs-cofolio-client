import type { VueWrapper } from '@vue/test-utils'
import ValorizedBadge from '@/common/components/ValorizedBadge/ValorizedBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedBadge>>

  const stubs = { AvBadge: AvBadgeStub }
  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(ValorizedBadge, { global: { stubs } })
    })

    BddTest().then('it should render the valorized badge', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('Valoriser dans mes CV')
    })
  })
})
