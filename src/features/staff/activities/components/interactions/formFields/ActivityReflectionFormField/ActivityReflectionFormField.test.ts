import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<EditActivityFormData, EditActivityFormData, 'enableReflection'>({
  formFieldComponent: ActivityReflectionFormField,
  fieldName: 'enableReflection',
  defaultValue: true,
  useValidator: () => () => undefined,
})

BddTest().given('an ActivityReflectionFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { Toggle: ToggleStub }

  const getToggle = () => wrapper.findComponent(ToggleStub) as VueWrapper<InstanceType<typeof ToggleStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the toggle', () => {
      expect(getToggle().exists()).toBe(true)
    })

    BddTest().then('it should have the toggle enabled by default', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the toggle is disabled', () => {
    beforeEach(async () => {
      await getToggle().find('input').setValue(false)
    })

    BddTest().then('it should set the toggle to unchecked', async () => {
      await vi.waitFor(() => expect(getToggle().props('modelValue')).toBe(false))
    })
  })

  BddTest().when('the toggle is enabled after being disabled', () => {
    beforeEach(async () => {
      await getToggle().find('input').setValue(false)
      await getToggle().find('input').setValue(true)
    })

    BddTest().then('it should set the toggle back to checked', async () => {
      await vi.waitFor(() => expect(getToggle().props('modelValue')).toBe(true))
    })
  })
})
