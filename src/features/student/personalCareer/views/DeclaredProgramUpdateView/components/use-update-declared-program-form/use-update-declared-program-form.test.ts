import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import type { DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { useUpdateDeclaredProgramForm } from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/use-update-declared-program-form/use-update-declared-program-form'
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

function createMockedDeclaredProgramDetailedDTO (
  overrides: Partial<DeclaredProgramDetailedDTO> = {}
): DeclaredProgramDetailedDTO {
  return {
    id: 'declared-program-1',
    title: 'Formation déclarée 1',
    description: 'Description',
    organization: 'University Paris-Saclay',
    result: 'Mention',
    sourceOfInformation: 'Website',
    startDate: '2024-01-01',
    endDate: '2025-12-01',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T10:00:00Z',
    ...overrides
  } as DeclaredProgramDetailedDTO
}

BddTest().given('an update declared program form', () => {
  let composableResult: ReturnType<typeof useUpdateDeclaredProgramForm>
  let mockOnProgramUpdated: ReturnType<typeof vi.fn>

  let declaredProgramDetailed: DeclaredProgramDetailedDTO

  const mountForm = (onProgramUpdated?: () => void) => {
    const result = mountComposable(
      () => useUpdateDeclaredProgramForm(declaredProgramDetailed, onProgramUpdated),
      { useI18n: true, useTanstack: true, usePinia: true }
    )
    composableResult = result.result
  }

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }

  const setFormValues = (data: Partial<DeclaredProgramFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        composableResult.form.setFieldValue(key as keyof DeclaredProgramFormData, value)
      }
    })
  }

  beforeEach(() => {
    declaredProgramDetailed = createMockedDeclaredProgramDetailedDTO()

    mountForm()
  })

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should return the expected structure', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.form).toBeDefined()
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isSubmitting).toBeDefined()
    })

    BddTest().then('it should initialize default values from the DTO', () => {
      const v = composableResult.form.state.values

      expect(v.title).toBe(declaredProgramDetailed.title)
      expect(v.description).toBe(declaredProgramDetailed.description ?? '')
      expect(v.organization).toBe(declaredProgramDetailed.organization)
      expect(v.result).toBe(declaredProgramDetailed.result ?? '')
      expect(v.sourceOfInformation).toBe(declaredProgramDetailed.sourceOfInformation ?? '')

      expect(v.startDate).toBe('2024-01')
      expect(v.endDate).toBe('2025-12')
      expect(v.isOngoing).toBe(false)
    })

    BddTest().then('it should not be submitting initially', () => {
      expect(composableResult.isSubmitting.value).toBe(false)
    })

    BddTest().then('it should not be valid initially because it is not dirty', () => {
      expect(composableResult.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('validating form fields', () => {
    BddTest().and('all required fields are empty', () => {
      BddTest().then('it should return validation errors for required fields', () => {
        const invalidData: DeclaredProgramFormData = {
          title: '',
          description: '',
          organization: '',
          result: '',
          sourceOfInformation: '',
          startDate: '',
          endDate: '',
          isOngoing: false
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.title).toBe('Ce champ est requis.')
        expect(result?.fields?.organization).toBe('Ce champ est requis.')
        expect(result?.fields?.startDate).toBe('Ce champ est requis.')
        expect(result?.fields?.endDate).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('fields exceed max length', () => {
      BddTest().then('it should return max length errors', () => {
        const invalidData: DeclaredProgramFormData = {
          title: 'a'.repeat(DECLARED_PROGRAM_TITLE_MAX_LENGTH + 1),
          description: 'a'.repeat(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH + 1),
          organization: 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH + 1),
          result: 'a'.repeat(DECLARED_PROGRAM_RESULT_MAX_LENGTH + 1),
          sourceOfInformation: 'a'.repeat(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH + 1),
          startDate: '2024-01',
          endDate: '2024-12',
          isOngoing: false
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.title).toBe('Veuillez limiter votre saisie à 80 caractères')
        expect(result?.fields?.description).toBe('Veuillez limiter votre saisie à 400 caractères')
        expect(result?.fields?.organization).toBe('Veuillez limiter votre saisie à 50 caractères')
        expect(result?.fields?.result).toBe('Veuillez limiter votre saisie à 50 caractères')
        expect(result?.fields?.sourceOfInformation).toBe('Veuillez limiter votre saisie à 200 caractères')
      })
    })
  })

  BddTest().when('submitting the form', () => {
    beforeEach(() => {
      mockOnProgramUpdated = vi.fn()
      mountForm(mockOnProgramUpdated)
    })

    BddTest().and('data is valid', () => {
      beforeEach(() => {
        setFormValues({
          title: 'Master en Informatique (updated)',
          organization: 'University Paris-Saclay',
          startDate: '2024-01',
          endDate: '2025-12',
          isOngoing: false
        })
      })

      BddTest().then('it should call onProgramUpdated callback on success', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(mockOnProgramUpdated).toHaveBeenCalledTimes(1)
        })
      })
    })

    BddTest().and('submission fails', () => {
      beforeEach(() => {
        setFormValues({
          title: 'Master en Informatique (updated)',
          organization: 'University Paris-Saclay',
          startDate: '2024-01',
          endDate: '2025-12',
          isOngoing: false
        })
      })

      BddTest().then('it should display an error message and not call onProgramUpdated', async () => {
        await composableResult.form.handleSubmit()

        expect(mockOnProgramUpdated).not.toHaveBeenCalled()
      })
    })
  })
})
