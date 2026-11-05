import type { VueWrapper } from '@vue/test-utils'
import type { AlertActiveToggleProps } from '@/features/global-alert/components/interactions/inputs/AlertActiveToggle/AlertActiveToggle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ToggleStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import AlertActiveToggle from '@/features/global-alert/components/interactions/inputs/AlertActiveToggle/AlertActiveToggle.vue'

const ACTIVE_TEXT = 'Activée'
const DESCRIPTION = 'Activer manuellement l\'alerte'
const INACTIVE_TEXT = 'Désactivée'

const DEFAULT_PROPS: AlertActiveToggleProps = {
  id: 'alert-active',
  name: 'alert-active',
  modelValue: false,
}

BddTest().given('an AlertActiveToggle component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AlertActiveToggle>>

  const onUpdateModelValue = vi.fn()

  const stubs = {
    Toggle: ToggleStub,
  }

  const getToggle = () => wrapper.findComponent(ToggleStub)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(AlertActiveToggle, {
      props: DEFAULT_PROPS,
      attrs: { 'onUpdate:modelValue': onUpdateModelValue },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should configure Toggle', () => {
      expect(getToggle().props()).toMatchObject({
        description: DESCRIPTION,
        activeText: ACTIVE_TEXT,
        inactiveText: INACTIVE_TEXT,
      })
    })

    BddTest().then('it should forward its props to Toggle', () => {
      expect(getToggle().props()).toMatchObject(DEFAULT_PROPS)
    })
  })

  BddTest().when('the model value changes', () => {
    beforeEach(async () => {
      await wrapper.setProps({ modelValue: true })
    })

    BddTest().then('it should pass the new value to Toggle', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })
  })

  BddTest().when('Toggle emits a new value', () => {
    beforeEach(async () => {
      getToggle().vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should forward the new value to the parent', () => {
      expect(onUpdateModelValue).toHaveBeenCalledWith(true)
    })
  })
})
