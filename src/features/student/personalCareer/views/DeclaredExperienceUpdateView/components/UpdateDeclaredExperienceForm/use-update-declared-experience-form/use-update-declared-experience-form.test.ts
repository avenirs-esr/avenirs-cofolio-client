import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { type DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import {
  DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH,
  DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH,
  DECLARED_EXPERIENCE_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { useUpdateDeclaredExperienceForm } from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/use-update-declared-experience-form/use-update-declared-experience-form'
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

function createMockedDeclaredExperienceDetailedDTO (
  overrides: Partial<DeclaredExperienceViewDTO> = {}
): DeclaredExperienceViewDTO {
  return {
    id: 'declared-experience-1',
    title: 'Formation déclarée 1',
    experienceType: EExperienceType.PROFESSIONAL,
    description: 'Description',
    organization: 'University Paris-Saclay',
    location: 'Paris',
    sourceOfInformation: 'Website',
    externalLink: 'https://example.com',
    startDate: '2024-01-01',
    endDate: '2025-12-01',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T10:00:00Z',
    ...overrides
  } as DeclaredExperienceViewDTO
}

BddTest().given('an update declared experience form', () => {
  let composableResult: ReturnType<typeof useUpdateDeclaredExperienceForm>
  let mockOnExperienceUpdated: ReturnType<typeof vi.fn>

  let declaredExperience: DeclaredExperienceViewDTO

  const mountForm = (onExperienceUpdated?: () => void) => {
    const result = mountComposable(
      () => useUpdateDeclaredExperienceForm(declaredExperience, onExperienceUpdated),
      { useI18n: true, useTanstack: true, usePinia: true }
    )
    composableResult = result.result
  }

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }

  const setFormValues = (data: Partial<DeclaredExperienceFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        composableResult.form.setFieldValue(key as keyof DeclaredExperienceFormData, value)
      }
    })
  }

  beforeEach(() => {
    declaredExperience = createMockedDeclaredExperienceDetailedDTO()

    mountForm()
  })

  const validData: DeclaredExperienceFormData = {
    title: 'Software Engineer',
    type: EExperienceType.PROFESSIONAL,
    organization: 'Tech Company',
    activitySector: 'Technology',
    location: 'Paris, France',
    startDate: '2024-01',
    endDate: '2025-12',
    isOngoing: false,
    sourceOfInformation: 'LinkedIn',
    description: 'Description of the experience',
    summary: 'A positive summary',
    externalLink: 'https://example.com'
  }

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should return the expected structure', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.form).toBeDefined()
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isSubmitting).toBeDefined()
    })

    BddTest().then('it should initialize default values from the DTO', () => {
      const v = composableResult.form.state.values

      expect(v.title).toBe(declaredExperience.title)
      expect(v.description).toBe(declaredExperience.description ?? '')
      expect(v.organization).toBe(declaredExperience.organization)
      expect(v.summary).toBe(declaredExperience.summary ?? '')
      expect(v.sourceOfInformation).toBe(declaredExperience.sourceOfInformation ?? '')
      expect(v.externalLink).toBe(declaredExperience.externalLink ?? '')
      expect(v.location).toBe(declaredExperience.location ?? '')

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
        const invalidData: DeclaredExperienceFormData = {
          title: '',
          description: '',
          organization: '',
          externalLink: '',
          sourceOfInformation: '',
          summary: '',
          startDate: '',
          endDate: '',
          isOngoing: false,
          type: '',
          activitySector: '',
          location: ''
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
        const maxLengthFields = {
          title: DECLARED_EXPERIENCE_TITLE_MAX_LENGTH,
          organization: DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
          activitySector: DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
          location: DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
          sourceOfInformation: DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
          description: DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
          summary: DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH,
          externalLink: DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH
        } as const

        const dataExceedingMaxLength = Object.entries(maxLengthFields).reduce(
          (acc, [field, maxLength]) => ({ ...acc, [field]: 'a'.repeat(maxLength + 1) }),
          { ...validData }
        )

        const validator = getOnSubmitValidator()
        const result = validator({ value: dataExceedingMaxLength })

        Object.entries(maxLengthFields).forEach(([field, maxLength]) => {
          expect(result?.fields?.[field as keyof typeof maxLengthFields]).toBe(
            `Veuillez limiter votre saisie à ${maxLength} caractères`
          )
        })
      })
    })

    BddTest().and('externalLink is not a valid URL', () => {
      BddTest().then('it should return an error for externalLink', () => {
        const invalidData: DeclaredExperienceFormData = {
          ...validData,
          externalLink: 'invalid-url'
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.externalLink).toBe('Veuillez renseigner une URL valide (ex. : http://www.exemple.com)')
      })
    })
  })

  BddTest().when('submitting the form', () => {
    beforeEach(() => {
      mockOnExperienceUpdated = vi.fn()
      mountForm(mockOnExperienceUpdated)
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

      BddTest().then('it should call onExperienceUpdated callback on success', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(mockOnExperienceUpdated).toHaveBeenCalledTimes(1)
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

      BddTest().then('it should display an error message and not call onExperienceUpdated', async () => {
        await composableResult.form.handleSubmit()

        expect(mockOnExperienceUpdated).not.toHaveBeenCalled()
      })
    })
  })
})
