import type { SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import type { SelfKnowledgeCategoryElementFormData } from '@/features/student/selfKnowledge/types/forms.types'
import { putUpdateSelfKnowledgeElementErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  useUpdateSelfKnowledgeElementForm
} from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useUpdateSelfKnowledgeElementForm composable', () => {
  let composableResult: ReturnType<typeof useUpdateSelfKnowledgeElementForm>
  let mockOnElementUpdated: ReturnType<typeof vi.fn>

  const mockElement: SelfKnowledgeElementDetailsDTO = {
    id: 'element-123',
    title: 'My Strength',
    description: 'This is a detailed description',
    rating: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as SelfKnowledgeElementDetailsDTO

  const createValidFormData = (overrides?: Partial<SelfKnowledgeCategoryElementFormData>): SelfKnowledgeCategoryElementFormData => ({
    title: 'My Updated Strength',
    description: 'Updated description',
    rating: 4,
    ...overrides
  })

  const createInvalidFormData = (): SelfKnowledgeCategoryElementFormData => ({
    title: '',
    description: '',
    rating: null
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
  }

  beforeEach(() => {
    mockOnElementUpdated = vi.fn()

    const result = mountComposable(
      () => useUpdateSelfKnowledgeElementForm(mockElement, mockOnElementUpdated),
      {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      }
    )

    composableResult = result.result
  })

  afterEach(() => {
    vi.clearAllMocks()
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

    BddTest().then('it should initialize form with element default values', () => {
      const state = composableResult.form.useStore(state => state.values)
      expect(state.value.title).toBe(mockElement.title)
      expect(state.value.description).toBe(mockElement.description)
      expect(state.value.rating).toBe(mockElement.rating)
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
      const invalidData = createValidFormData({ title: '   ' })
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: invalidData })

      expect(validationResult?.fields?.title).toBe('Ce champ est requis.')
    })

    BddTest().then('it should return validation errors for description with only whitespace', () => {
      const invalidData = createValidFormData({ description: '   ' })
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
      const validData = createValidFormData({ rating: 5 })
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.title).toBeUndefined()
      expect(validationResult?.fields?.description).toBeUndefined()
    })

    BddTest().then('it should accept valid data without rating', () => {
      const validData = createValidFormData({ rating: null })
      const validator = getOnSubmitValidator()
      const validationResult = validator({ value: validData })

      expect(validationResult?.fields?.title).toBeUndefined()
      expect(validationResult?.fields?.description).toBeUndefined()
    })
  })

  BddTest().when('form is submitted with valid data', () => {
    BddTest().then('it should call onElementUpdated callback on success', async () => {
      const validData = createValidFormData()
      setFormValues(validData)

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(mockOnElementUpdated).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('form submission fails', () => {
    BddTest().then('it should set isSubmitting back to false', async () => {
      server.use(putUpdateSelfKnowledgeElementErrorHandler)

      const validData = createValidFormData()
      setFormValues(validData)

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(composableResult.isSubmitting.value).toBe(false)
      })
    })

    BddTest().then('it should not call onElementUpdated callback', async () => {
      server.use(putUpdateSelfKnowledgeElementErrorHandler)

      const validData = createValidFormData()
      setFormValues(validData)

      await composableResult.form.handleSubmit()

      expect(mockOnElementUpdated).not.toHaveBeenCalled()
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
