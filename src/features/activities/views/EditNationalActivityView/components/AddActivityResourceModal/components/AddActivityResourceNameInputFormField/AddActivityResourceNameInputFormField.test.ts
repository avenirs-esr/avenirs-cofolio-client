import type { AddActivityResourceFileFormData } from '@/features/activities/types/forms.types'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ACTIVITY_RESOURCE_NAME_MAX_LENGTH } from '@/features/activities/config'
import AddActivityResourceNameInputFormField from '@/features/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceNameInputFormField/AddActivityResourceNameInputFormField.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddActivityResourceFileFormData, 'resourceName'>({
  formFieldComponent: AddActivityResourceNameInputFormField,
  fieldName: 'resourceName',
  defaultValue: '',
})

BddTest().given('an AddActivityResourceNameInputFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { Input: InputStub }

  const getInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvInput', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should have an empty initial model value', () => {
      expect(getInput().props('modelValue')).toBe('')
    })

    BddTest().then('it should render the localized label', () => {
      expect(getInput().props('label')).toBe('Nom de mon document')
    })

    BddTest().then('it should apply the maxlength from config', () => {
      expect(getInput().props('maxlength')).toBe(ACTIVITY_RESOURCE_NAME_MAX_LENGTH)
    })

    BddTest().then('it should use the attach file prefix icon', () => {
      expect(getInput().props('prefixIcon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the user types a value', () => {
    beforeEach(async () => {
      await getInput().find('input').setValue('Mon document')
    })

    BddTest().then('it should update the field value', async () => {
      await vi.waitFor(() => expect(getInput().props('modelValue')).toBe('Mon document'))
    })
  })
})
