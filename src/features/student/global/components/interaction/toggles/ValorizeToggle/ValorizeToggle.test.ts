import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ValorizeToggle from '@/features/student/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a valorize toggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizeToggle>>

  const stubs = {
    Toggle: ToggleStub,
    ValorizedBadge: ValorizedBadgeStub
  }

  const getToggle = () => wrapper.findComponent(ToggleStub)
  const setToggleValue = async (value: boolean) => {
    const toggle = getToggle()
    const checkbox = toggle.find('input[type="checkbox"]')
    await checkbox.setValue(value)
    await wrapper.vm.$nextTick()
  }
  const getValorizedBadge = () => wrapper.findComponent(ValorizedBadgeStub)
  const getValorizedProp = () => getValorizedBadge().props('valorized')

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(ValorizeToggle, {
      props: {
        id: 'valorize-toggle',
        name: 'valorize-toggle',
        modelValue: false,
      },
      global: {
        stubs,
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the Toggle component', () => {
      expect(getToggle().exists()).toBe(true)
    })

    BddTest().then('it should render the ValorizedBadge component', () => {
      expect(getValorizedBadge().exists()).toBe(true)
    })

    BddTest().then('it should have the default valorized badge', () => {
      expect(getValorizedProp()).toBe(false)
    })

    BddTest().then('it should pass through id prop', () => {
      expect(getToggle().props('id')).toBe('valorize-toggle')
    })

    BddTest().then('it should pass through name prop', () => {
      expect(getToggle().props('name')).toBe('valorize-toggle')
    })

    BddTest().then('it should pass through modelValue prop', () => {
      expect(getToggle().props('modelValue')).toBe(false)
    })
  })

  BddTest().when('the toggle checkbox is changed', () => {
    BddTest().then('it should emit update:modelValue event', async () => {
      const toggle = getToggle()
      await setToggleValue(true)

      expect(toggle.emitted('update:modelValue')).toBeTruthy()
      expect(toggle.emitted('update:modelValue')?.[0]).toEqual([true])
    })
  })

  BddTest().when('modelValue prop changes', () => {
    BddTest().then('it should update the toggle state', async () => {
      await wrapper.setProps({ modelValue: true })
      await wrapper.vm.$nextTick()

      expect(getToggle().props('modelValue')).toBe(true)
    })
  })
})
