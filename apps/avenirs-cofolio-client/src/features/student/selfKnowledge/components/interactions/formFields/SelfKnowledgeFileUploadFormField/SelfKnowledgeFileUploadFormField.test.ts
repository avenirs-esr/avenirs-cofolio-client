import type { VueWrapper } from '@vue/test-utils'
import type { SelfKnowledgeCategoryElementFormDataFile } from '@/features/student/selfKnowledge/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createFormFieldTestWrapper } from '@avenirs-esr/shared/test-utils/unit'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedUploadAttachment } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { FileUploadStub } from '@/common/components/interaction/files/FileUpload/FileUpload.stub'
import SelfKnowledgeFileUploadFormField from '@/features/student/selfKnowledge/components/interactions/formFields/SelfKnowledgeFileUploadFormField/SelfKnowledgeFileUploadFormField.vue'
import { SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_ACCEPTED_FILE_TYPES } from '@/features/student/selfKnowledge/config'

const FILE_FORMAT_LABEL = 'Format\u00A0:'
const FILE_FORMAT_VALUE = 'PDF, DOC, DOCX, ODT, JPG, PNG'
const FILE_SIZE_LABEL = 'Poids\u00A0:'
const FILE_SIZE_VALUE = '10 Mo max'
const FILE_UPLOAD_DESCRIPTION = 'ou glisser et déposer ici'
const FILE_UPLOAD_TITLE = 'Ajouter un fichier'

const TestWrapper = createFormFieldTestWrapper<SelfKnowledgeCategoryElementFormDataFile, 'file'>({
  formFieldComponent: SelfKnowledgeFileUploadFormField,
  fieldName: 'file',
  defaultValue: [],
})

const TestWrapperWithAttachment = createFormFieldTestWrapper<SelfKnowledgeCategoryElementFormDataFile, 'file'>({
  formFieldComponent: SelfKnowledgeFileUploadFormField,
  fieldName: 'file',
  defaultValue: [mockedUploadAttachment],
})

BddTest().given('the SelfKnowledgeFileUploadFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    FileUpload: FileUploadStub,
  }

  const mountWith = (component: typeof TestWrapper = TestWrapper) => {
    vi.clearAllMocks()
    wrapper = mount(component, { global: { stubs } })
  }

  const getFileUpload = () => wrapper.findComponent(FileUploadStub)
  const getFileUploadFormats = () => wrapper.find('[data-testid="self-knowledge-file-upload-formats"]')

  const expectFileUploadModelValue = (expectedValue: File[] | null) => {
    expect(getFileUpload().props('modelValue')).toStrictEqual(expectedValue)
  }

  const expectFileUploadFormat = () => {
    const expectedFormat = [
      `${FILE_FORMAT_LABEL} ${FILE_FORMAT_VALUE}`,
      `${FILE_SIZE_LABEL} ${FILE_SIZE_VALUE}`,
    ].join(' • ')

    expect(getFileUploadFormats().text()).toContain(expectedFormat)
  }
  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the files form field container', () => {
      expect(wrapper.find('[data-testid="self-knowledge-file-upload-formats"]').exists()).toBe(true)
    })

    BddTest().then('it should render the AvFileUpload', () => {
      expect(getFileUpload().exists()).toBe(true)
    })

    BddTest().then('it should have a null initial model value', () => {
      expectFileUploadModelValue(null)
    })

    BddTest().then('it should pass the accepted file types', () => {
      expect(getFileUpload().props('accept')).toEqual([
        ...SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_ACCEPTED_FILE_TYPES,
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

  BddTest().when('the field is initialized with an existing attachment', () => {
    beforeEach(() => {
      mountWith(TestWrapperWithAttachment)
    })

    BddTest().then('it should convert the FileDTO into a displayable File', () => {
      const value = getFileUpload().props('modelValue')
      expect(value).toHaveLength(1)
      expect(value![0]!.name).toBe('compte-rendu.pdf')
    })
  })

  BddTest().when('the user selects a new file via update:modelValue', () => {
    const newFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    })

    beforeEach(async () => {
      await getFileUpload().vm.$emit('update:modelValue', [newFile])
    })

    BddTest().then('it should expose the selected File through the model value', async () => {
      await vi.waitFor(() => {
        const value = getFileUpload().props('modelValue')
        expect(value).toHaveLength(1)
        expect(value![0]!).toBeInstanceOf(File)
        expect(value![0]!.name).toBe('document.pdf')
      })
    })
  })

  BddTest().when('the user removes all files via update:modelValue', () => {
    beforeEach(async () => {
      mountWith(TestWrapperWithAttachment)
      await getFileUpload().vm.$emit('update:modelValue', [])
    })

    BddTest().then('it should clear the model value', async () => {
      await vi.waitFor(() => {
        expectFileUploadModelValue(null)
      })
    })
  })

  BddTest().when('an existing attachment is kept after an update', () => {
    beforeEach(async () => {
      mountWith(TestWrapperWithAttachment)
      const displayed = getFileUpload().props('modelValue')![0]!
      await getFileUpload().vm.$emit('update:modelValue', [displayed])
    })

    BddTest().then('it should keep the attachment in the model value', async () => {
      await vi.waitFor(() => {
        const value = getFileUpload().props('modelValue')
        expect(value).toHaveLength(1)
        expect(value![0]!).toBeInstanceOf(File)
      })
    })
  })
})
