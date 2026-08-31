import type { FileDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EFileType } from '@/api/avenir-esr'
import FeedbackAttachmentsFormField from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackAttachmentsFormField/FeedbackAttachmentsFormField.vue'
import { AvFileUploadStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const remoteAttachment: FileDTO = {
  id: 'attachment-1',
  fileName: 'existing.pdf',
  fileType: EFileType.PDF,
  fileSize: 1024,
  url: 'https://example.com/existing.pdf',
  uploadedAt: '2026-01-01T10:00:00Z'
}

const localFile = new File(['content'], 'new-report.pdf', { type: 'application/pdf' })

function createForm (attachments: (File | FileDTO)[], attachmentsError?: string) {
  return useForm({
    defaultValues: { feedback: '', attachments },
    validators: attachmentsError
      ? {
          onChange: () => ({
            fields: {
              attachments: attachmentsError
            }
          })
        }
      : undefined
  })
}

let hostForm: ReturnType<typeof createForm>

function buildTestHost (attachments: (File | FileDTO)[], readonly = false, attachmentsError?: string) {
  return defineComponent({
    name: 'FeedbackAttachmentsFormFieldTestHost',
    components: { FeedbackAttachmentsFormField },
    setup () {
      const form = createForm(attachments, attachmentsError)
      hostForm = form

      return { form, readonly }
    },
    template: '<FeedbackAttachmentsFormField :form="form" :readonly="readonly" @autosave="$emit(\'autosave\')" />'
  })
}

BddTest().given('a feedback attachments form field', () => {
  let wrapper: VueWrapper

  const stubs = { AvFileUpload: AvFileUploadStub }

  const mountField = (attachments: (File | FileDTO)[] = [], readonly = false, attachmentsError?: string) => {
    wrapper = mountComponent(buildTestHost(attachments, readonly, attachmentsError), { global: { stubs } })
  }

  const getFileUpload = () => wrapper.findComponent(AvFileUploadStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('there is no attachment', () => {
    beforeEach(() => {
      mountField()
    })

    BddTest().then('it should render the file upload in compact multiple mode', () => {
      expect(getFileUpload().exists()).toBe(true)
      expect(getFileUpload().props('compact')).toBe(true)
      expect(getFileUpload().props('enableMultiple')).toBe(true)
    })

    BddTest().then('it should pass a null model value', () => {
      expect(getFileUpload().props('modelValue')).toBeNull()
    })

    BddTest().then('it should restrict formats and size', () => {
      expect(getFileUpload().props('accept')).toContain('application/pdf')
      expect(getFileUpload().props('accept')).toContain('image/png')
      expect(getFileUpload().props('maxFileSizeMb')).toBe(10)
    })
  })

  BddTest().when('the attachments field has a validation error', () => {
    beforeEach(() => {
      mountField([], false, 'Too many files')
    })

    BddTest().then('it should not emit autosave even though the change makes the form dirty', async () => {
      await getFileUpload().vm.$emit('update:modelValue', [localFile])

      expect(hostForm.state.values.attachments).toEqual([localFile])
      expect(wrapper.emitted('autosave')).toBeUndefined()
    })
  })

  BddTest().when('attachments mix uploaded and local files', () => {
    beforeEach(() => {
      mountField([remoteAttachment, localFile])
    })

    BddTest().then('it should expose every attachment as a file', () => {
      const files = getFileUpload().props('modelValue') as File[]
      expect(files.map(file => file.name)).toEqual(['existing.pdf', 'new-report.pdf'])
    })

    BddTest().then('it should keep the local file when the uploaded one is removed', async () => {
      const displayedFiles = getFileUpload().props('modelValue') as File[]
      await getFileUpload().vm.$emit('update:modelValue', [displayedFiles[1]])

      expect(hostForm.state.values.attachments).toEqual([localFile])
    })

    BddTest().then('it should append a newly selected file without touching the uploaded one', async () => {
      const displayedFiles = getFileUpload().props('modelValue') as File[]
      const addedFile = new File(['content'], 'added.png', { type: 'image/png' })
      await getFileUpload().vm.$emit('update:modelValue', [...displayedFiles, addedFile])

      expect(hostForm.state.values.attachments).toEqual([remoteAttachment, localFile, addedFile])
    })

    BddTest().and('a file is removed', () => {
      BddTest().then('it should map the remaining files back to attachments', async () => {
        const files = getFileUpload().props('modelValue') as File[]
        await getFileUpload().vm.$emit('update:modelValue', [files[0]])

        expect(hostForm.state.values.attachments).toEqual([remoteAttachment])
      })

      BddTest().then('it should emit autosave once the form becomes dirty', async () => {
        await getFileUpload().vm.$emit('update:modelValue', null)

        expect(wrapper.emitted('autosave')).toHaveLength(1)
      })

      BddTest().then('it should emit autosave again on a subsequent change', async () => {
        const displayedFiles = getFileUpload().props('modelValue') as File[]
        await getFileUpload().vm.$emit('update:modelValue', [displayedFiles[0]])
        await getFileUpload().vm.$emit('update:modelValue', null)

        expect(wrapper.emitted('autosave')).toHaveLength(2)
      })

      BddTest().then('it should clear the attachments when the model value is null', async () => {
        await getFileUpload().vm.$emit('update:modelValue', null)

        expect(hostForm.state.values.attachments).toEqual([])
      })
    })
  })

  BddTest().when('a rejected file is selected', () => {
    beforeEach(() => {
      mountField()
    })

    BddTest().then('it should display an accepted type error', async () => {
      await getFileUpload().vm.$emit('acceptTypeError')

      expect(getFileUpload().props('error')).toBe('Le fichier ne respecte pas le format attendu.')
    })

    BddTest().then('it should display a size error', async () => {
      await getFileUpload().vm.$emit('fileSizeError')

      expect(getFileUpload().props('error')).toBe('La taille du fichier dépasse la limite autorisée.')
    })

    BddTest().then('it should clear the error on a successful selection', async () => {
      await getFileUpload().vm.$emit('fileSizeError')
      await getFileUpload().vm.$emit('update:modelValue', [localFile])

      expect(getFileUpload().props('error')).toBe('')
    })
  })

  BddTest().when('the field is readonly', () => {
    beforeEach(() => {
      mountField([remoteAttachment], true)
    })

    BddTest().then('it should disable the file upload', () => {
      expect(getFileUpload().props('disabled')).toBe(true)
    })
  })
})
