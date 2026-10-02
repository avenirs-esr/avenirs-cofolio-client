import type { AddActivityResourceFileFormData } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES } from '@/features/staff/activities/config'
import AddActivityResourceFileUploadFormField from '@/features/staff/activities/views/EditNationalActivityView/components/AddActivityResourceModal/components/AddActivityResourceFileUploadFormField/AddActivityResourceFileUploadFormField.vue'
import { AvFileUploadStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const ACCEPT_TYPE_ERROR_MESSAGE = 'Le fichier ne respecte pas le format attendu.'
const FILE_FORMAT_LABEL = 'Format\u00A0:'
const FILE_FORMAT_VALUE = 'PDF, DOC, DOCX, ODT, JPG, PNG'
const FILE_SIZE_ERROR_MESSAGE = 'La taille du fichier dépasse la limite autorisée.'
const FILE_SIZE_LABEL = 'Poids\u00A0:'
const FILE_SIZE_VALUE = '10 Mo max'
const FILE_UPLOAD_DESCRIPTION = 'ou glisser et déposer ici'
const FILE_UPLOAD_TITLE = 'Ajouter un fichier'

const TestWrapper = createFormFieldTestWrapper<AddActivityResourceFileFormData, 'file'>({
  formFieldComponent: AddActivityResourceFileUploadFormField,
  fieldName: 'file',
  defaultValue: null,
})

BddTest().given('an AddActivityResourceFileUploadFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    AvFileUpload: AvFileUploadStub,
  }

  const mountWith = () => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, { global: { stubs } })
  }

  const getFileUpload = () => wrapper.findComponent(AvFileUploadStub)
  const getFormField = () => wrapper.findComponent(AddActivityResourceFileUploadFormField)

  const getFileUploadFormats = () => wrapper.find('[data-testid="add-activity-resource-file-upload-formats"]')

  const expectFileUploadModelValue = (expectedValue: File[] | null) => {
    expect(getFileUpload().props('modelValue')).toStrictEqual(expectedValue)
  }

  const expectFileUploadError = (expectedError: string) => {
    expect(getFileUpload().props('error')).toBe(expectedError)
  }

  const expectFileUploadFormat = () => {
    const expectedFormat = [
      `${FILE_FORMAT_LABEL} ${FILE_FORMAT_VALUE}`,
      `${FILE_SIZE_LABEL} ${FILE_SIZE_VALUE}`,
    ].join(' • ')

    expect(getFileUploadFormats().text()).toBe(expectedFormat)
  }

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvFileUpload', () => {
      expect(getFileUpload().exists()).toBe(true)
    })

    BddTest().then('it should have a null initial model value', () => {
      expectFileUploadModelValue(null)
    })

    BddTest().then('it should pass the accepted file types', () => {
      expect(getFileUpload().props('accept')).toEqual([
        ...ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES,
      ])
    })

    BddTest().then('it should pass the localized title', () => {
      expect(getFileUpload().props('title')).toBe(FILE_UPLOAD_TITLE)
    })

    BddTest().then('it should pass the localized description', () => {
      expect(getFileUpload().props('description')).toBe(FILE_UPLOAD_DESCRIPTION)
    })

    BddTest().then('it should render the file format and size information', () => {
      expectFileUploadFormat()
    })
  })

  BddTest().when('the user selects a file via the change event', () => {
    const pdfFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    })

    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [pdfFile])
    })

    BddTest().then('it should update the field value with the selected file', async () => {
      await vi.waitFor(() => {
        expectFileUploadModelValue([pdfFile])
      })
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
      expectFileUploadModelValue(null)
    })

    BddTest().then('it should not emit fileSelected', () => {
      expect(getFormField().emitted('fileSelected')).toBeUndefined()
    })
  })

  BddTest().when('a file is rejected because of its type', () => {
    BddTest().then('it should display an accepted type error', async () => {
      await getFileUpload().vm.$emit('acceptTypeError')

      expectFileUploadError(ACCEPT_TYPE_ERROR_MESSAGE)
    })
  })

  BddTest().when('a file is rejected because of its size', () => {
    BddTest().then('it should display a size error', async () => {
      await getFileUpload().vm.$emit('fileSizeError')

      expectFileUploadError(FILE_SIZE_ERROR_MESSAGE)
    })
  })

  BddTest().when('a file was selected and then removed via update:modelValue', () => {
    const pdfFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    })

    beforeEach(async () => {
      await getFileUpload().vm.$emit('change', [pdfFile])

      await vi.waitFor(() => {
        expectFileUploadModelValue([pdfFile])
      })

      await getFileUpload().vm.$emit('update:modelValue', null)
    })

    BddTest().then('it should clear the field value', async () => {
      await vi.waitFor(() => {
        expectFileUploadModelValue(null)
      })
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
