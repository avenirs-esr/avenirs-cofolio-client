import type { FeedbackDetailsDTO, FileDTO } from '@/api/avenir-esr'
import type { WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { mockedFeedbackAttachment } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { server } from '@/__mocks__/msw/server'
import { getDeleteFeedbackAttachmentUrl, getUploadFeedbackAttachmentUrl } from '@/api/avenir-esr'
import { FEEDBACK_ATTACHMENT_MAX_FILE_SIZE, FEEDBACK_MAX_LENGTH } from '@/features/staff/feedbacks/config'
import { useWriteFeedbackForm } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterAll, beforeAll, beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn()
    }))
  }
})

vi.mock('@/common/composables/use-task-loading/use-task-loading', () => ({
  useTaskLoading: vi.fn(() => ({
    isLoading: { value: false },
    withTaskLoading: vi.fn(fn => fn())
  }))
}))

vi.mock('@/common/utils/file/file', async () => {
  const actual = await vi.importActual<typeof import('@/common/utils/file/file')>('@/common/utils/file/file')
  return {
    ...actual,
    dtoToFile: vi.fn((dto: FileDTO) => new File(['restored-content'], dto.fileName ?? 'restored-file', { type: 'application/octet-stream' }))
  }
})

BddTest().given('a write feedback form', () => {
  let composableResult: ReturnType<typeof useWriteFeedbackForm>
  let mockOnFeedbackSaved: ReturnType<typeof vi.fn>
  let mockOnCancel: ReturnType<typeof vi.fn>
  const remoteAttachment: FileDTO = mockedFeedbackAttachment
  const feedbackId = 'feedback-123'
  const attachmentsUrl = getUploadFeedbackAttachmentUrl(feedbackId)
  const attachmentRequests: { method: string, path: string }[] = []

  const recordAttachmentRequest = ({ request }: { request: Request }) => {
    const path = new URL(request.url).pathname
    if (path.endsWith(attachmentsUrl) || path.includes(`${attachmentsUrl}/`)) {
      attachmentRequests.push({ method: request.method, path })
    }
  }
  const buildFeedback = (attachments: FileDTO[] = []): FeedbackDetailsDTO =>
    ({ id: feedbackId, feedback: '', activity: mockedActivityContent, attachments } as FeedbackDetailsDTO)

  let feedbackRef = ref(buildFeedback())

  const mountForm = (onFeedbackSaved?: () => void, onCancel?: () => void) => {
    const result = mountComposable(() => useWriteFeedbackForm({ feedback: feedbackRef, onFeedbackSaved, onCancel }), {
      useI18n: true,
      useTanstack: true,
      usePinia: true
    })
    composableResult = result.result
  }

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }

  const setFormValues = (data: Partial<WriteFeedbackFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        composableResult.form.setFieldValue(key as keyof WriteFeedbackFormData, value)
      }
    })
  }

  beforeAll(() => {
    server.events.on('request:start', recordAttachmentRequest)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    attachmentRequests.length = 0
    feedbackRef = ref(buildFeedback())
    mountForm()
  })

  afterAll(() => {
    server.events.removeListener('request:start', recordAttachmentRequest)
  })

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should return the expected structure', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.form).toBeDefined()
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isSubmitting).toBeDefined()
      expect(composableResult.hasErrors).toBeDefined()
      expect(composableResult.isDirty).toBeDefined()
      expect(composableResult.handleCancel).toBeDefined()
      expect(composableResult.queueAutoSave).toBeDefined()
    })

    BddTest().then('it should have default values', () => {
      expect(composableResult.form.state.values.feedback).toBe('')
    })

    BddTest().then('it should not be dirty', () => {
      expect(composableResult.isDirty.value).toBe(false)
    })

    BddTest().and('callback is provided', () => {
      beforeEach(() => {
        mockOnFeedbackSaved = vi.fn()
        mountForm(mockOnFeedbackSaved)
      })

      BddTest().then('it should accept onFeedbackSaved callback', () => {
        expect(composableResult).toBeDefined()
        expect(mockOnFeedbackSaved).toBeDefined()
      })
    })
  })

  BddTest().when('validating form fields', () => {
    BddTest().and('feedback is empty', () => {
      BddTest().then('it should return validation error', () => {
        const invalidData: WriteFeedbackFormData = {
          feedback: '',
          attachments: []
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.feedback).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('feedback exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const invalidData: WriteFeedbackFormData = {
          feedback: 'a'.repeat(FEEDBACK_MAX_LENGTH + 1),
          attachments: []
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.feedback).toBe(`Veuillez limiter votre saisie à ${FEEDBACK_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('feedback is at max length', () => {
      BddTest().then('it should not return validation errors', () => {
        const validData: WriteFeedbackFormData = {
          feedback: 'a'.repeat(FEEDBACK_MAX_LENGTH),
          attachments: []
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.feedback).toBeUndefined()
      })
    })

    BddTest().and('feedback is valid', () => {
      BddTest().then('it should not return validation errors', () => {
        const validData: WriteFeedbackFormData = {
          feedback: 'Feedback valide',
          attachments: []
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.feedback).toBeUndefined()
      })
    })
  })

  BddTest().when('validating attachments', () => {
    const buildFile = (name: string, type: string, size: number) => {
      const file = new File(['content'], name, { type })
      Object.defineProperty(file, 'size', { value: size })
      return file
    }

    BddTest().and('an attachment has an unsupported format', () => {
      BddTest().then('it should return an accepted type error', () => {
        const validator = getOnSubmitValidator()
        const result = validator({
          value: { feedback: 'Feedback valide', attachments: [buildFile('archive.zip', 'application/zip', 1024)] }
        })

        expect(result?.fields?.attachments).toBe('Le fichier ne respecte pas le format attendu.')
      })
    })

    BddTest().and('an attachment exceeds the maximum size', () => {
      BddTest().then('it should return a size error', () => {
        const validator = getOnSubmitValidator()
        const result = validator({
          value: {
            feedback: 'Feedback valide',
            attachments: [buildFile('big.pdf', 'application/pdf', FEEDBACK_ATTACHMENT_MAX_FILE_SIZE + 1)]
          }
        })

        expect(result?.fields?.attachments).toBe('La taille du fichier dépasse la limite autorisée.')
      })
    })

    BddTest().and('attachments are valid files', () => {
      BddTest().then('it should not return validation errors', () => {
        const validator = getOnSubmitValidator()
        const result = validator({
          value: {
            feedback: 'Feedback valide',
            attachments: [buildFile('doc.pdf', 'application/pdf', 1024), buildFile('image.png', 'image/png', 2048)]
          }
        })

        expect(result?.fields?.attachments).toBeUndefined()
      })
    })

    BddTest().and('attachments are already uploaded files', () => {
      BddTest().then('it should not validate them', () => {
        const validator = getOnSubmitValidator()
        const result = validator({ value: { feedback: 'Feedback valide', attachments: [remoteAttachment] } })

        expect(result?.fields?.attachments).toBeUndefined()
      })
    })
  })

  BddTest().when('submitting the form', () => {
    beforeEach(() => {
      mockOnFeedbackSaved = vi.fn()
      mountForm(mockOnFeedbackSaved)
    })

    BddTest().and('feedback is valid', () => {
      beforeEach(() => {
        setFormValues({
          feedback: 'Excellent feedback'
        })
      })

      BddTest().then('it should accept submission with valid feedback', async () => {
        await composableResult.form.handleSubmit()
        await vi.waitFor(() => {
          expect(mockOnFeedbackSaved).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().then('it should not sync attachments when none changed', async () => {
        await composableResult.form.handleSubmit()
        await vi.waitFor(() => {
          expect(mockOnFeedbackSaved).toHaveBeenCalledTimes(1)
        })

        expect(attachmentRequests).toHaveLength(0)
      })

      BddTest().then('it should mark the form as clean after a successful submit', async () => {
        expect(composableResult.isDirty.value).toBe(true)

        await composableResult.form.handleSubmit()
        await vi.waitFor(() => {
          expect(mockOnFeedbackSaved).toHaveBeenCalledTimes(1)
        })

        expect(composableResult.isDirty.value).toBe(false)
      })
    })

    BddTest().and('a new file is attached', () => {
      const newFile = new File(['content'], 'report.pdf', { type: 'application/pdf' })

      beforeEach(() => {
        setFormValues({ feedback: 'Excellent feedback', attachments: [newFile] })
      })

      BddTest().then('it should upload the new file', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(attachmentRequests).toHaveLength(1)
        })
        expect(attachmentRequests[0].method).toBe('POST')
        expect(attachmentRequests[0].path.endsWith(attachmentsUrl)).toBe(true)
      })
    })

    BddTest().and('an existing attachment is removed', () => {
      beforeEach(() => {
        feedbackRef = ref(buildFeedback([remoteAttachment]))
        mountForm(mockOnFeedbackSaved)
        setFormValues({ feedback: 'Excellent feedback', attachments: [] })
      })

      BddTest().then('it should delete the removed attachment', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(attachmentRequests).toHaveLength(1)
        })
        expect(attachmentRequests[0].method).toBe('DELETE')
        expect(attachmentRequests[0].path.endsWith(getDeleteFeedbackAttachmentUrl(feedbackId, remoteAttachment.id))).toBe(true)
      })
    })
  })

  BddTest().when('cancelling the form', () => {
    beforeEach(() => {
      mockOnCancel = vi.fn()
    })

    BddTest().and('nothing was changed', () => {
      beforeEach(() => {
        mountForm(undefined, mockOnCancel)
      })

      BddTest().then('it should call onCancel without any network call', async () => {
        await composableResult.handleCancel()

        expect(attachmentRequests).toHaveLength(0)
        expect(mockOnCancel).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('only the feedback text was changed locally', () => {
      beforeEach(() => {
        mountForm(undefined, mockOnCancel)
        setFormValues({ feedback: 'Brouillon non sauvegardé' })
      })

      BddTest().then('it should revert the feedback field and clear isDirty', async () => {
        await composableResult.handleCancel()

        expect(composableResult.form.state.values.feedback).toBe('')
        expect(composableResult.isDirty.value).toBe(false)
        expect(mockOnCancel).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not trigger any attachment request', async () => {
        await composableResult.handleCancel()

        expect(attachmentRequests).toHaveLength(0)
      })
    })

    BddTest().and('an attachment was removed locally but not yet persisted', () => {
      beforeEach(() => {
        feedbackRef = ref(buildFeedback([remoteAttachment]))
        mountForm(undefined, mockOnCancel)
        setFormValues({ attachments: [] })
      })

      BddTest().then('it should restore the attachment locally without any network call', async () => {
        await composableResult.handleCancel()

        expect(composableResult.form.state.values.attachments).toEqual([remoteAttachment])
        expect(attachmentRequests).toHaveLength(0)
      })
    })

    BddTest().and('an attachment removal was already persisted by a previous auto-save', () => {
      beforeEach(() => {
        feedbackRef = ref(buildFeedback([remoteAttachment]))
        mountForm(undefined, mockOnCancel)
        setFormValues({ attachments: [] })
        feedbackRef.value = buildFeedback([])
      })

      BddTest().then('it should re-upload the attachment removed by the previous auto-save', async () => {
        await composableResult.handleCancel()

        await vi.waitFor(() => {
          expect(attachmentRequests.some(request => request.method === 'POST')).toBe(true)
        })
      })
    })

    BddTest().and('an attachment addition was already persisted by a previous auto-save', () => {
      const newFile = new File(['content'], 'draft.pdf', { type: 'application/pdf' })
      const autoSavedAttachment: FileDTO = { ...remoteAttachment, id: 'auto-saved-file' }

      beforeEach(() => {
        mountForm(undefined, mockOnCancel)
        setFormValues({ attachments: [newFile] })
        feedbackRef.value = buildFeedback([autoSavedAttachment])
      })

      BddTest().then('it should discard the attachment added by the previous auto-save', async () => {
        await composableResult.handleCancel()

        await vi.waitFor(() => {
          expect(attachmentRequests.some(request => request.method === 'DELETE')).toBe(true)
        })
        expect(
          attachmentRequests.some(request => request.path.endsWith(getDeleteFeedbackAttachmentUrl(feedbackId, autoSavedAttachment.id)))
        ).toBe(true)
      })
    })
  })

  BddTest().when('the parent feedback data changes externally', () => {
    BddTest().and('the form has no local changes', () => {
      BddTest().then('it should resync the form to the new data', async () => {
        feedbackRef.value = buildFeedback([remoteAttachment])
        feedbackRef.value.feedback = 'Mis à jour par un autre utilisateur'

        await vi.waitFor(() => {
          expect(composableResult.form.state.values.feedback).toBe('Mis à jour par un autre utilisateur')
        })
        expect(composableResult.form.state.values.attachments).toEqual([remoteAttachment])
        expect(composableResult.isDirty.value).toBe(false)
      })
    })

    BddTest().and('the form has unsaved local changes', () => {
      beforeEach(() => {
        setFormValues({ feedback: 'Saisie en cours...' })
      })

      BddTest().then('it should not overwrite the local input', async () => {
        feedbackRef.value = buildFeedback([])
        feedbackRef.value.feedback = 'Mis à jour par un autre utilisateur'

        await vi.waitFor(() => {
          expect(composableResult.form.state.values.feedback).toBe('Saisie en cours...')
        })
      })
    })
  })
})
