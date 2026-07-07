import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ActivityReflectionFormField from '@/features/staff/activities/components/interactions/formFields/ActivityReflectionFormField/ActivityReflectionFormField.vue'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

function createTestWrapper (initialValue = true) {
  return createFormFieldTestWrapper<EditActivityFormData, 'enableReflection'>({
    formFieldComponent: ActivityReflectionFormField,
    fieldName: 'enableReflection',
    defaultValue: initialValue,
    useValidator: () => () => undefined,
  })
}

BddTest().given('an ActivityReflectionFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityReflectionFormField>>

  const stubs = {
    Toggle: ToggleStub,
    AvMessage: AvMessageStub,
  }

  const mountField = (initialValue = true) => {
    const TestWrapper = createTestWrapper(initialValue)

    wrapper = mount(TestWrapper, {
      global: { stubs },
    }) as unknown as VueWrapper<InstanceType<typeof ActivityReflectionFormField>>
  }

  const getToggle = () => wrapper.findComponent(ToggleStub) as VueWrapper<InstanceType<typeof ToggleStub>>
  const getMessage = () => wrapper.findComponent(AvMessageStub) as VueWrapper<InstanceType<typeof AvMessageStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    mountField()
  })

  BddTest().when('the component is mounted with reflection enabled', () => {
    BddTest().then('it should render the toggle', () => {
      expect(getToggle().exists()).toBe(true)
    })

    BddTest().then('it should have the toggle checked', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should keep the toggle enabled', () => {
      expect(getToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the information message', () => {
      expect(getMessage().exists()).toBe(true)
    })

    BddTest().then('it should render the information message as info', () => {
      expect(getMessage().props('type')).toBe('info')
    })

    BddTest().then('it should pass the disabled information message', () => {
      expect(getMessage().props('message')).toEqual({
        title: 'Ce paramètre ne peut plus être modifié car des étudiants sont déjà inscrits à cette activité.',
      })
    })
  })

  BddTest().when('the component is mounted with reflection disabled by value', () => {
    beforeEach(() => {
      mountField(false)
    })

    BddTest().then('it should render the toggle', () => {
      expect(getToggle().exists()).toBe(true)
    })

    BddTest().then('it should have the toggle unchecked', () => {
      expect(getToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should keep the toggle enabled', () => {
      expect(getToggle().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the information message', () => {
      expect(getMessage().exists()).toBe(true)
    })
  })
})
