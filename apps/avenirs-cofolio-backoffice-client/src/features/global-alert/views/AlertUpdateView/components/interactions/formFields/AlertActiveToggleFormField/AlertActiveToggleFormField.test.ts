import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { AlertUpdateFormData } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createFormFieldTestWrapper } from '@avenirs-esr/shared/test-utils/unit'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { AlertActiveToggleStub } from '@/features/global-alert/components/interactions/inputs/AlertActiveToggle/AlertActiveToggle.stub'
import AlertActiveToggleFormField from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertActiveToggleFormField/AlertActiveToggleFormField.vue'

type MountingOptions = ComponentMountingOptions<typeof AlertActiveToggleFormField>
type FieldProps = Omit<MountingOptions['props'], 'form'>

function createTestWrapper (extraProps?: FieldProps) {
  return createFormFieldTestWrapper<AlertUpdateFormData, 'active'>({
    formFieldComponent: AlertActiveToggleFormField,
    fieldName: 'active',
    defaultValue: false,
    extraProps,
  })
}

BddTest().given('an AlertActiveToggleFormField component', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    AlertActiveToggle: AlertActiveToggleStub
  }

  const mountWith = (extraProps?: FieldProps) => {
    wrapper = mount(createTestWrapper(extraProps), {
      global: { stubs }
    })
  }

  const getToggle = () => wrapper.findComponent(AlertActiveToggleStub)

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should configure the toggle', () => {
      expect(getToggle().props()).toMatchObject({
        id: 'active',
        name: 'active',
        modelValue: false,
      })
    })
  })

  BddTest().when('the component receives attributes', () => {
    beforeEach(() => {
      mountWith({
        disabled: true
      })
    })

    BddTest().then('it should forward them to the toggle', () => {
      expect(getToggle().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the toggle emits a new value', () => {
    beforeEach(() => {
      getToggle().vm.$emit('update:modelValue', true)
    })

    BddTest().then('it should update the field value', async () => {
      await vi.waitFor(() => {
        expect(getToggle().props('modelValue')).toBe(true)
      })
    })
  })
})
