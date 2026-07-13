import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import type { WriteFeedbackFormData } from '@/features/staff/feedbacks/types/forms.types'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { FEEDBACK_MAX_LENGTH } from '@/features/staff/feedbacks/config'
import { useWriteFeedbackForm } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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

BddTest().given('a write feedback form', () => {
  let composableResult: ReturnType<typeof useWriteFeedbackForm>
  let mockOnFeedbackSaved: ReturnType<typeof vi.fn>
  const feedbackRef = ref({ id: 'feedback-123', feedback: '', activity: mockedActivityContent } as FeedbackDetailsDTO)

  const mountForm = (onFeedbackSaved?: () => void) => {
    const result = mountComposable(() => useWriteFeedbackForm({ feedback: feedbackRef, onFeedbackSaved }), {
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

  beforeEach(() => {
    vi.clearAllMocks()
    mountForm()
  })

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should return the expected structure', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.form).toBeDefined()
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isSubmitting).toBeDefined()
      expect(composableResult.hasErrors).toBeDefined()
    })

    BddTest().then('it should have default values', () => {
      expect(composableResult.form.state.values.feedback).toBe('')
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
          feedback: ''
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.feedback).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('feedback exceeds max length', () => {
      BddTest().then('it should return max length error', () => {
        const invalidData: WriteFeedbackFormData = {
          feedback: 'a'.repeat(FEEDBACK_MAX_LENGTH + 1)
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.feedback).toBe(`Veuillez limiter votre saisie à ${FEEDBACK_MAX_LENGTH} caractères`)
      })
    })

    BddTest().and('feedback is at max length', () => {
      BddTest().then('it should not return validation errors', () => {
        const validData: WriteFeedbackFormData = {
          feedback: 'a'.repeat(FEEDBACK_MAX_LENGTH)
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.feedback).toBeUndefined()
      })
    })

    BddTest().and('feedback is valid', () => {
      BddTest().then('it should not return validation errors', () => {
        const validData: WriteFeedbackFormData = {
          feedback: 'Feedback valide'
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.feedback).toBeUndefined()
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
    })
  })
})
