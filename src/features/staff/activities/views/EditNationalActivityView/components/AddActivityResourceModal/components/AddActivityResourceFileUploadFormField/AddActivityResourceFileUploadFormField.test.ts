import type { AddActivityResourceFileFormData } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES } from '@/features/staff/activities/config'
import AddActivityResourceFileUploadFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceFileUploadFormField/AddActivityResourceFileUploadFormField.vue'
import { AvFileUploadStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = createFormFieldTestWrapper<AddActivityResourceFileFormData, 'file'>({
  formFieldComponent: AddActivityResourceFileUploadFormField,
  fieldName: 'file',
  defaultValue: null,
})

BddTest().given('an AddActivityResourceFileUploadFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = { AvFileUpload: AvFileUploadStub }

  const getFileUpload = () => wrapper.findComponent(AvFileUploadStub) as VueWrapper<InstanceType<typeof AvFileUploadStub>>
  const getFormField = () => wrapper.findComponent(AddActivityResourceFileUploadFormField)

  const pdfFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvFileUpload', () => {
      expect(getFileUpload().exists()).toBe(true)
    })

    BddTest().then('it should have a null initial model value', () => {
      expect(getFileUpload().props('modelValue')).toBeNull()
    })

    BddTest().then('it should pass the accepted file types', () => {
      expect(getFileUpload().props('accept')).toEqual([...ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES])
    })

    BddTest().then('it should pass the localized title', () => {
      expect(getFileUpload().props('title')).toBe('Ajouter un Document')
    })

    BddTest().then('it should pass the localized description', () => {
      expect(getFileUpload().props('description')).toBe('ou glisser et déposer ici')
    })

    BddTest().then('it should render the format hint', () => {
      expect(wrapper.text()).toContain('Format :')
      expect(wrapper.text()).toContain('PDF, JPG, JPEG, PNG')
    })

    BddTest().then('it should render the size hint', () => {
      expect(wrapper.text()).toContain('Poids :')
      expect(wrapper.text()).toContain('10 Mo max')
    })
  })

  BddTest().when('the user selects a file via the change event', () => {
    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [pdfFile])
    })

    BddTest().then('it should update the field value with the selected file', async () => {
      await vi.waitFor(() => expect(getFileUpload().props('modelValue')).toBe(pdfFile))
    })

    BddTest().then('it should emit fileSelected with the selected file', () => {
      expect(getFormField().emitted('fileSelected')).toEqual([[pdfFile]])
    })
  })

  BddTest().when('the change event is fired with an empty file list', () => {
    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [])
    })

    BddTest().then('it should keep the field value null', () => {
      expect(getFileUpload().props('modelValue')).toBeNull()
    })

    BddTest().then('it should not emit fileSelected', () => {
      expect(getFormField().emitted('fileSelected')).toBeUndefined()
    })
  })

  BddTest().when('a file was selected and then removed via update:modelValue', () => {
    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [pdfFile])
      await vi.waitFor(() => expect(getFileUpload().props('modelValue')).toBe(pdfFile))
      await getFileUpload().vm.$emit('update:modelValue', null)
    })

    BddTest().then('it should clear the field value', async () => {
      await vi.waitFor(() => expect(getFileUpload().props('modelValue')).toBeNull())
    })

    BddTest().then('it should emit fileDeleted with the previous file name', () => {
      expect(getFormField().emitted('fileDeleted')).toEqual([[pdfFile.name]])
    })
  })

  BddTest().when('update:modelValue is fired while the field is already empty', () => {
    beforeEach(async () => {
      await getFileUpload().vm.$emit('update:modelValue', null)
    })

    BddTest().then('it should not emit fileDeleted', () => {
      expect(getFormField().emitted('fileDeleted')).toBeUndefined()
    })
  })
})
