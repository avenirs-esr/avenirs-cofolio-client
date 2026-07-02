import type { AddActivityResourceLinkFormData } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_RESOURCE_LINK_MAX_LENGTH } from '@/features/staff/activities/config'
import AddActivityResourceLinkInputFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceLinkInputFormField/AddActivityResourceLinkInputFormField.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddActivityResourceLinkFormData, 'link'>({
  formFieldComponent: AddActivityResourceLinkInputFormField,
  fieldName: 'link',
  defaultValue: '',
})

BddTest().given('an AddActivityResourceLinkInputFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { AvInput: AvInputStub }

  const getInput = () => wrapper.findComponent(AvInputStub) as VueWrapper<InstanceType<typeof AvInputStub>>

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

    BddTest().then('it should use the url input type', () => {
      expect(getInput().props('type')).toBe('url')
    })

    BddTest().then('it should render the localized label', () => {
      expect(getInput().props('label')).toBe('Ajouter un lien')
    })

    BddTest().then('it should render the localized placeholder', () => {
      expect(getInput().props('placeholder')).toBe('Ajouter un lien…')
    })

    BddTest().then('it should apply the maxlength from config', () => {
      expect(getInput().props('maxlength')).toBe(ACTIVITY_RESOURCE_LINK_MAX_LENGTH)
    })

    BddTest().then('it should use the link prefix icon', () => {
      expect(getInput().props('prefixIcon')).toBe(MDI_ICONS.LINK)
    })

    BddTest().then('it should render the counter suffix with the current length in the maxLengthCaption slot', () => {
      expect(wrapper.text()).toContain('0/')
      expect(wrapper.text()).toContain('caractères espaces inclus')
    })
  })

  BddTest().when('the user types a link', () => {
    beforeEach(async () => {
      await getInput().find('input').setValue('https://example.com')
    })

    BddTest().then('it should update the field value', async () => {
      await vi.waitFor(() => expect(getInput().props('modelValue')).toBe('https://example.com'))
    })

    BddTest().then('it should update the counter to the typed length', async () => {
      await vi.waitFor(() => expect(wrapper.text()).toContain('19/'))
    })
  })
})
