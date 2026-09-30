import type { VueWrapper } from '@vue/test-utils'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ValorizeToggle, { type ValorizeToggleProps } from '@/features/student/global/components/interaction/toggles/ValorizeToggle/ValorizeToggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'

const defaultProps = {
  id: 'valorize-toggle',
  name: 'valorize-toggle',
  modelValue: false,
}

const UNVALORIZE_TOOLTIP = 'Ne plus valoriser dans mon kit'
const VALORIZE_TOOLTIP = 'Valoriser dans mon kit'

BddTest().given('a ValorizeToggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizeToggle>>

  const stubs = {
    Toggle: ToggleStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  const mountWith = (props: Partial<ValorizeToggleProps> = {}) => {
    wrapper = mount(ValorizeToggle, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs,
      },
    })
  }

  const getToggle = () => wrapper.findComponent(ToggleStub)
  const getBadge = () => wrapper.findComponent(ValorizedBadgeStub)

  const setModelValue = async (value: boolean) => await wrapper.setProps({ modelValue: value })

  BddTest().when('the component is mounted with modelValue false', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render Toggle with forwarded props', () => {
      expect(getToggle().props()).toMatchObject(defaultProps)
    })

    BddTest().then('it should render ValorizedBadge as inactive', () => {
      expect(getBadge().props('valorized')).toBe(false)
    })

    BddTest().then('it should provide the valorize tooltip', () => {
      expect(getToggle().props('tooltip')).toBe(VALORIZE_TOOLTIP)
    })
  })

  BddTest().when('the component is mounted with modelValue true', () => {
    beforeEach(() => {
      mountWith({
        modelValue: true,
      })
    })

    BddTest().then('it should render ValorizedBadge as active', () => {
      expect(getBadge().props('valorized')).toBe(true)
    })

    BddTest().then('it should provide the unvalorize tooltip', () => {
      expect(getToggle().props('tooltip')).toBe(UNVALORIZE_TOOLTIP)
    })
  })

  BddTest().when('the component receives a tooltip', () => {
    const tooltip = 'Custom tooltip'

    beforeEach(() => {
      mountWith({ tooltip })
    })

    BddTest().then('it should keep the provided tooltip', () => {
      expect(getToggle().props('tooltip')).toBe(tooltip)
    })
  })

  BddTest().when('the component modelValue changes', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should update the ValorizedBadge state', async () => {
      await setModelValue(true)

      expect(getBadge().props('valorized')).toBe(true)

      await setModelValue(false)

      expect(getBadge().props('valorized')).toBe(false)
    })

    BddTest().then('it should update Toggle modelValue', async () => {
      await setModelValue(true)

      expect(getToggle().props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the Toggle emits a value change', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should emit update:modelValue', async () => {
      await getToggle().vm.$emit('update:modelValue', true)
      expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    })
  })
})
