import type { FileDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { Mock } from 'vitest'
import type { SelfKnowledgeCategoryElementFormData, SelfKnowledgFormData } from '@/features/student/selfKnowledge/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ESelfKnowledgeCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { QueryClient } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedUploadAttachment } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { createSelfKnowledgeElementErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { useAddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/use-add-self-knowledge-category-element-form/use-add-self-knowledge-category-element-form'
import { SelfKnowledgeElementType } from '@/features/student/selfKnowledge/types/forms.types'

BddTest().given('the useAddSelfKnowledgeCategoryElementForm composable', () => {
  let composableResult: ReturnType<typeof useAddSelfKnowledgeCategoryElementForm>
  let mockOnElementCreated: Mock<() => void>
  let setQueryDataSpy: ReturnType<typeof vi.spyOn>
  const mockCategoryId = ESelfKnowledgeCategory.STRENGTHS
  const remoteAttachment: FileDTO = mockedUploadAttachment

  const attachmentRequests: { method: string, path: string }[] = []

  const recordAttachmentRequest = ({ request }: { request: Request }) => {
    const path = new URL(request.url).pathname.replace(/^\/apim/, '')
    if (path.includes('/self-knowledge/') && path.includes('/attachments')) {
      attachmentRequests.push({ method: request.method, path })
    }
  }

  const isAttachmentPost = (r: { method: string, path: string }) =>
    r.method === 'POST' && /\/me\/self-knowledge\/[^/]+\/attachments$/.test(r.path)

  const isAttachmentDelete = (attachmentId: string) => (r: { method: string, path: string }) =>
    r.method === 'DELETE' && r.path.endsWith(`/attachments/${attachmentId}`)

  const createValidFormData = (rating: number | null = 3, files: (File | FileDTO)[] = []): SelfKnowledgFormData => ({
    title: 'My Strength',
    description: 'This is a detailed description',
    rating,
    valorized: false,
    selfKnowledgeElementType: SelfKnowledgeElementType.FILE,
    file: files
  })

  const createInvalidFormData = (): SelfKnowledgFormData => ({
    title: '',
    description: '',
    rating: null,
    valorized: false,
    selfKnowledgeElementType: SelfKnowledgeElementType.FILE,
    file: []
  })

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }

  const setFormValues = (data: SelfKnowledgeCategoryElementFormData) => {
    composableResult.form.setFieldValue('title', data.title)
    composableResult.form.setFieldValue('description', data.description)
    composableResult.form.setFieldValue('rating', data.rating)
    composableResult.form.setFieldValue('valorized', data.valorized)
    composableResult.form.setFieldValue('file', data.file ?? [])
  }

  beforeAll(() => {
    server.events.on('request:start', recordAttachmentRequest)
  })

  beforeEach(() => {
    attachmentRequests.length = 0
    mockOnElementCreated = vi.fn()
    setQueryDataSpy = vi.spyOn(QueryClient.prototype, 'setQueryData')

    const result = mountComposable(
      () => useAddSelfKnowledgeCategoryElementForm(mockCategoryId, mockOnElementCreated),
      { useI18n: true, useTanstack: true, usePinia: true }
    )
    composableResult = result.result
  })

  afterEach(() => {
    vi.clearAllMocks()
    setQueryDataSpy.mockRestore()
    server.resetHandlers()
  })

  afterAll(() => {
    server.events.removeListener('request:start', recordAttachmentRequest)
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return a form instance', () => {
      expect(composableResult.form).toBeDefined()
      expect(typeof composableResult.form.useStore).toBe('function')
    })

    BddTest().then('it should return isFormValid computed property', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isFormValid.value).toBe(true)
    })

    BddTest().then('it should return isSubmitting computed property', () => {
      expect(composableResult.isSubmitting).toBeDefined()
      expect(composableResult.isSubmitting.value).toBe(false)
    })

    BddTest().then('it should initialize form with default values', () => {
      const state = composableResult.form.useStore(state => state.values)
      expect(state.value.title).toBe('')
      expect(state.value.description).toBe('')
      expect(state.value.rating).toBe(null)
    })
  })

  BddTest().when('form is validated with invalid data', () => {
    BddTest().then('it should return validation error for empty title', () => {
      const invalidData = createInvalidFormData()
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.title).toBe('Ce champ est requis.')
    })

    BddTest().then('it should return validation error for empty description', () => {
      const invalidData = createInvalidFormData()
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.description).toBe('Ce champ est requis.')
    })

    BddTest().then('it should return validation errors for title with only whitespace', () => {
      const invalidData = { ...createValidFormData(), title: '   ' }
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.title).toBe('Ce champ est requis.')
    })

    BddTest().then('it should return validation errors for description with only whitespace', () => {
      const invalidData = { ...createValidFormData(), description: '   ' }
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.description).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('form is validated with valid data', () => {
    BddTest().then('it should not return validation errors', () => {
      const validData = createValidFormData()
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.title).toBeUndefined()
      expect(validationResult?.fields?.description).toBeUndefined()
    })

    BddTest().then('it should accept valid data with rating', () => {
      const validData = createValidFormData(5)
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.title).toBeUndefined()
      expect(validationResult?.fields?.description).toBeUndefined()
    })

    BddTest().then('it should accept valid data without rating', () => {
      const validData = createValidFormData(null)
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.title).toBeUndefined()
      expect(validationResult?.fields?.description).toBeUndefined()
    })

    BddTest().then('it should accept valid data without files', () => {
      const validationResult = getOnSubmitValidator()({ value: createValidFormData(3, []) })
      expect(validationResult?.fields?.title).toBeUndefined()
    })

    BddTest().then('it should accept valid data with existing files', () => {
      const validationResult = getOnSubmitValidator()({ value: createValidFormData(3, [mockedUploadAttachment]) })
      expect(validationResult?.fields?.title).toBeUndefined()
    })

    BddTest().then('it should accept valid data with new files', () => {
      const file = new File(['test'], 'document.pdf', { type: 'application/pdf' })
      const validationResult = getOnSubmitValidator()({ value: createValidFormData(3, [file]) })
      expect(validationResult?.fields?.title).toBeUndefined()
    })
  })

  BddTest().when('form is submitted with valid data', () => {
    BddTest().then('it should call onElementCreated once on success', async () => {
      setFormValues(createValidFormData(3))
      await composableResult.form.handleSubmit()
      await flushPromises()

      await vi.waitFor(() => {
        expect(mockOnElementCreated).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().then('it should submit successfully without files', async () => {
      setFormValues(createValidFormData(3, []))
      await composableResult.form.handleSubmit()
      await flushPromises()

      await vi.waitFor(() => {
        expect(mockOnElementCreated).toHaveBeenCalledTimes(1)
      })
      expect(attachmentRequests).toHaveLength(0)
    })

    BddTest().then('it should upload a new file', async () => {
      const file = new File(['test content'], 'document.pdf', { type: 'application/pdf' })
      setFormValues(createValidFormData(3, [file]))
      await composableResult.form.handleSubmit()
      await flushPromises()

      await vi.waitFor(() => {
        expect(attachmentRequests.some(isAttachmentPost)).toBe(true)
      })
      await vi.waitFor(() => {
        expect(mockOnElementCreated).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().then('it should upload multiple new files', async () => {
      const files = [
        new File(['content 1'], 'document-1.pdf', { type: 'application/pdf' }),
        new File(['content 2'], 'document-2.pdf', { type: 'application/pdf' })
      ]
      setFormValues(createValidFormData(3, files))
      await composableResult.form.handleSubmit()
      await flushPromises()

      await vi.waitFor(() => {
        expect(attachmentRequests.filter(isAttachmentPost)).toHaveLength(2)
      })
      await vi.waitFor(() => {
        expect(mockOnElementCreated).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().then('it should delete existing files', async () => {
      setFormValues(createValidFormData(3, [remoteAttachment]))
      await composableResult.form.handleSubmit()
      await flushPromises()

      await vi.waitFor(() => {
        expect(attachmentRequests.some(isAttachmentDelete(remoteAttachment.id))).toBe(true)
      })
      await vi.waitFor(() => {
        expect(mockOnElementCreated).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('form is submitted with reactive category ID', () => {
    BddTest().then('it should use the current value of categoryId', async () => {
      const reactiveCategoryId = ref(ESelfKnowledgeCategory.VALUES)

      const result = mountComposable(() => useAddSelfKnowledgeCategoryElementForm(reactiveCategoryId, mockOnElementCreated), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })

      const reactiveComposableResult = result.result
      reactiveComposableResult.form.setFieldValue('title', 'My Strength')
      reactiveComposableResult.form.setFieldValue('description', 'This is a detailed description')
      reactiveComposableResult.form.setFieldValue('rating', 3)

      await reactiveComposableResult.form.handleSubmit()
    })
  })

  BddTest().when('form submission fails', () => {
    BddTest().then('it should set isSubmitting back to false', async () => {
      server.use(createSelfKnowledgeElementErrorHandler)

      setFormValues(createValidFormData(3))

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(composableResult.isSubmitting.value).toBe(false)
      })
    })

    BddTest().then('it should not call onElementCreated callback', async () => {
      server.use(createSelfKnowledgeElementErrorHandler)

      setFormValues(createValidFormData(3))

      await composableResult.form.handleSubmit()

      expect(mockOnElementCreated).not.toHaveBeenCalled()
    })
  })

  BddTest().when('isFormValid computed property is accessed', () => {
    BddTest().then('it should return true when form is valid initially', () => {
      expect(composableResult.isFormValid.value).toBe(true)
    })

    BddTest().then('it should return false when form is not validating', () => {
      const state = composableResult.form.useStore(state => state)
      expect(state.value.isValidating).toBe(false)
    })
  })
})
