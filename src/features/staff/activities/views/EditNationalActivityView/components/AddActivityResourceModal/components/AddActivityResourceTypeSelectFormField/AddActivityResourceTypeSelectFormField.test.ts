import type { AddActivityResourceFormData } from '@/features/staff/activities/types/forms.types'
import { ActivityResourceType } from '@/features/staff/activities/types/resource.types'
import AddActivityResourceTypeSelectFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceTypeSelectFormField/AddActivityResourceTypeSelectFormField.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddActivityResourceFormData, 'resourceType'>({
  formFieldComponent: AddActivityResourceTypeSelectFormField,
  fieldName: 'resourceType',
  defaultValue: ActivityResourceType.FILE,
})

BddTest().given('an AddActivityResourceTypeSelectFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { AvSelect: AvSelectStub }

  const getSelect = () => wrapper.findComponent(AvSelectStub) as VueWrapper<InstanceType<typeof AvSelectStub>>
  const getFormField = () => wrapper.findComponent(AddActivityResourceTypeSelectFormField)

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvSelect', () => {
      expect(getSelect().exists()).toBe(true)
    })

    BddTest().then('it should preselect the FILE option', () => {
      expect(getSelect().props('selectedItem')).toEqual({ itemId: ActivityResourceType.FILE })
    })

    BddTest().then('it should render the localized label', () => {
      expect(getSelect().props('label')).toBe('Ajouter')
    })

    BddTest().then('it should render the localized placeholder', () => {
      expect(getSelect().props('placeholder')).toBe('un document')
    })

    BddTest().then('it should render the two type options with localized labels', () => {
      expect(getSelect().props('options')).toEqual([
        { id: ActivityResourceType.FILE, label: 'un document' },
        { id: ActivityResourceType.LINK, label: 'un lien' },
      ])
    })
  })

  BddTest().when('the user selects the LINK option', () => {
    beforeEach(async () => {
      await getSelect().find('select').setValue(ActivityResourceType.LINK)
    })

    BddTest().then('it should emit change with the LINK type', () => {
      expect(getFormField().emitted('change')).toEqual([[ActivityResourceType.LINK]])
    })
  })

  BddTest().when('the user selects the FILE option', () => {
    beforeEach(async () => {
      await getSelect().find('select').setValue(ActivityResourceType.FILE)
    })

    BddTest().then('it should emit change with the FILE type', () => {
      expect(getFormField().emitted('change')).toEqual([[ActivityResourceType.FILE]])
    })
  })
})
