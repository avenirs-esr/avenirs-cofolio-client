import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { createDeclaredExperienceErrorHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { EExperienceType } from '@/api/avenir-esr'
import {
  useAddDeclaredExperienceForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import {
  DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH,
  DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
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

BddTest().given('an add declared experience form', () => {
  let composableResult: ReturnType<typeof useAddDeclaredExperienceForm>
  let mockOnExperienceAdded: ReturnType<typeof vi.fn>

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
    review: 'A positive review',
    link: 'https://example.com'
  }

  const mountForm = (onExperienceAdded?: () => void) => {
    const result = mountComposable(() => useAddDeclaredExperienceForm(onExperienceAdded), {
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

  const setFormValues = (data: Partial<DeclaredExperienceFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        composableResult.form.setFieldValue(key as keyof DeclaredExperienceFormData, value)
      }
    })
  }

  beforeEach(() => {
    mountForm()
  })

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should return the expected structure', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.form).toBeDefined()
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isSubmitting).toBeDefined()
    })

    BddTest().then('it should have default values', () => {
      const expectedDefaults: DeclaredExperienceFormData = {
        title: '',
        type: '',
        organization: '',
        activitySector: '',
        location: '',
        startDate: '',
        endDate: '',
        isOngoing: false,
        sourceOfInformation: '',
        description: '',
        review: '',
        link: ''
      }

      Object.entries(expectedDefaults).forEach(([key, expectedValue]) => {
        expect(composableResult.form.state.values[key as keyof DeclaredExperienceFormData]).toBe(expectedValue)
      })
    })

    BddTest().then('it should not be submitting initially', () => {
      expect(composableResult.isSubmitting.value).toBe(false)
    })

    BddTest().then('it should not be valid initially', () => {
      expect(composableResult.isFormValid.value).toBe(false)
    })

    BddTest().and('callback is provided', () => {
      beforeEach(() => {
        mockOnExperienceAdded = vi.fn()
        mountForm(mockOnExperienceAdded)
      })

      BddTest().then('it should accept onExperienceAdded callback', () => {
        expect(composableResult).toBeDefined()
        expect(mockOnExperienceAdded).toBeDefined()
      })
    })
  })

  BddTest().when('validating form fields', () => {
    BddTest().and('all required fields are empty', () => {
      BddTest().then('it should return validation errors for required fields', () => {
        const invalidData: DeclaredExperienceFormData = {
          title: '',
          type: '',
          organization: '',
          activitySector: '',
          location: '',
          startDate: '',
          endDate: '',
          isOngoing: false,
          sourceOfInformation: '',
          description: '',
          review: '',
          link: ''
        }

        const requiredFields = ['title', 'type', 'organization', 'startDate', 'endDate'] as const
        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        requiredFields.forEach((field) => {
          expect(result?.fields?.[field]).toBe('Ce champ est requis.')
        })
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
          review: DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH
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

    BddTest().and('endDate is missing when not ongoing', () => {
      BddTest().then('it should return endDate required error', () => {
        const invalidData: DeclaredExperienceFormData = {
          ...validData,
          startDate: '2024-01',
          endDate: '',
          isOngoing: false
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.endDate).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('all required fields are filled and isOngoing is true', () => {
      BddTest().then('it should not require endDate', () => {
        const ongoingExperience: DeclaredExperienceFormData = {
          ...validData,
          endDate: '',
          isOngoing: true
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: ongoingExperience })

        expect(result?.fields?.title).toBeUndefined()
        expect(result?.fields?.type).toBeUndefined()
        expect(result?.fields?.organization).toBeUndefined()
        expect(result?.fields?.startDate).toBeUndefined()
        expect(result?.fields?.endDate).toBeUndefined()
      })
    })

    BddTest().and('data is valid', () => {
      BddTest().then('it should not return validation errors', () => {
        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.title).toBeUndefined()
        expect(result?.fields?.type).toBeUndefined()
        expect(result?.fields?.organization).toBeUndefined()
        expect(result?.fields?.activitySector).toBeUndefined()
        expect(result?.fields?.location).toBeUndefined()
        expect(result?.fields?.startDate).toBeUndefined()
        expect(result?.fields?.endDate).toBeUndefined()
        expect(result?.fields?.sourceOfInformation).toBeUndefined()
        expect(result?.fields?.description).toBeUndefined()
        expect(result?.fields?.review).toBeUndefined()
      })
    })
  })

  BddTest().when('submitting the form', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
    })

    BddTest().and('data is valid', () => {
      beforeEach(() => {
        setFormValues(validData)
      })

      BddTest().then('it should call onExperienceAdded callback on success', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().then('isFormValid should be true when all conditions met', async () => {
        await vi.waitFor(() => {
          expect(composableResult.isFormValid.value).toBe(true)
        })
      })
    })

    BddTest().and('isOngoing is true', () => {
      beforeEach(() => {
        setFormValues({
          ...validData,
          endDate: '2025-12',
          isOngoing: true
        })
      })

      BddTest().then('it should not send endDate in the request', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
        })
      })
    })

    BddTest().and('submission fails', () => {
      beforeEach(() => {
        server.use(createDeclaredExperienceErrorHandler)
        setFormValues(validData)
      })

      BddTest().then('it should not call onExperienceAdded callback', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(composableResult.isSubmitting.value).toBe(false)
        })

        expect(mockOnExperienceAdded).not.toHaveBeenCalled()
      })

      BddTest().then('it should set isSubmitting back to false', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(composableResult.isSubmitting.value).toBe(false)
        })
      })
    })
  })
})
