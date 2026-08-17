import type { AssociationsCreationRequest } from '@/api/avenir-esr'
import type { DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import { associateDeclaredExperienceWithDeclaredSkillsErrorHandler, associateDeclaredExperienceWithTracesErrorHandler, createAssociateDeclaredExperienceWithDeclaredSkillsHandler, createAssociateDeclaredExperienceWithTracesHandler, createDeclaredExperienceErrorHandler, createDeclaredExperienceHandler } from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType, EExperienceType } from '@/api/avenir-esr'
import {
  useAddDeclaredExperienceForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import {
  DECLARED_EXPERIENCE_ACTIVITY_SECTOR_MAX_LENGTH,
  DECLARED_EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  DECLARED_EXPERIENCE_LOCATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_ORGANIZATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH,
  DECLARED_EXPERIENCE_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const mockAddErrorMessage = vi.fn()
const mockAddSuccessMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: mockAddErrorMessage,
      addSuccessMessage: mockAddSuccessMessage
    }))
  }
})

BddTest().given('an add declared experience form', () => {
  let composableResult: ReturnType<typeof useAddDeclaredExperienceForm>
  let mockOnExperienceAdded: ReturnType<typeof vi.fn>
  const declaredSkillAssociationRequests: AssociationsCreationRequest[] = []
  const traceAssociationRequests: AssociationsCreationRequest[] = []

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
    externalLink: 'https://example.com',
    valorized: false,
    associationSelections: {}
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

  const submitForm = (value: DeclaredExperienceFormData) => {
    composableResult.form.options.onSubmit?.({ value, formApi: composableResult.form, meta: {} })
  }

  beforeEach(() => {
    declaredSkillAssociationRequests.length = 0
    traceAssociationRequests.length = 0
    server.use(
      createDeclaredExperienceHandler(),
      createAssociateDeclaredExperienceWithDeclaredSkillsHandler(request => declaredSkillAssociationRequests.push(request)),
      createAssociateDeclaredExperienceWithTracesHandler(request => traceAssociationRequests.push(request))
    )
    mountForm()
  })

  afterEach(() => {
    vi.clearAllMocks()
    server.resetHandlers()
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
        summary: '',
        externalLink: '',
        valorized: false,
        associationSelections: {}
      }

      Object.entries(expectedDefaults).forEach(([key, expectedValue]) => {
        if (typeof expectedValue === 'object' && expectedValue !== null) {
          expect(composableResult.form.state.values[key as keyof DeclaredExperienceFormData]).toStrictEqual(expectedValue)
          return
        }

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
          summary: '',
          externalLink: '',
          valorized: false
        }

        const requiredFields = ['title', 'organization', 'startDate', 'endDate'] as const
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
          summary: DECLARED_EXPERIENCE_SUMMARY_MAX_LENGTH
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
        expect(result?.fields?.organization).toBeUndefined()
        expect(result?.fields?.startDate).toBeUndefined()
        expect(result?.fields?.endDate).toBeUndefined()
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

        expect(result?.fields?.externalLink).toBe('Veuillez renseigner une URL valide (ex. : http://www.exemple.com). N\'oubliez pas d\'inclure le protocole (http:// ou https://).')
      })
    })

    BddTest().and('data is valid', () => {
      BddTest().then('it should not return validation errors', () => {
        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.title).toBeUndefined()
        expect(result?.fields?.organization).toBeUndefined()
        expect(result?.fields?.activitySector).toBeUndefined()
        expect(result?.fields?.location).toBeUndefined()
        expect(result?.fields?.startDate).toBeUndefined()
        expect(result?.fields?.endDate).toBeUndefined()
        expect(result?.fields?.sourceOfInformation).toBeUndefined()
        expect(result?.fields?.description).toBeUndefined()
        expect(result?.fields?.summary).toBeUndefined()
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

  BddTest().when('submitting the form with declared skill associations', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [
            { id: 'skill-1', title: 'Skill 1' },
            { id: 'skill-2', title: 'Skill 2' }
          ]
        }
      })
    })

    BddTest().then('it should associate selected declared skills with the created experience', async () => {
      await vi.waitFor(() => {
        expect(declaredSkillAssociationRequests).toStrictEqual([{ idsToAssociate: ['skill-1', 'skill-2'] }])
      })
    })

    BddTest().then('it should call onExperienceAdded callback after association', async () => {
      await vi.waitFor(() => {
        expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('submitting the form with trace associations', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.TRACE]: [
            { id: 'trace-1', title: 'Trace 1' },
            { id: 'trace-2', title: 'Trace 2' }
          ]
        }
      })
    })

    BddTest().then('it should associate selected traces with the created experience', async () => {
      await vi.waitFor(() => {
        expect(traceAssociationRequests).toStrictEqual([{ idsToAssociate: ['trace-1', 'trace-2'] }])
      })
    })

    BddTest().then('it should call onExperienceAdded callback after association', async () => {
      await vi.waitFor(() => {
        expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('submitting the form with declared skill and trace associations', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
          [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
        }
      })
    })

    BddTest().then('it should associate each selected association type with the created experience', async () => {
      await vi.waitFor(() => {
        expect(declaredSkillAssociationRequests).toStrictEqual([{ idsToAssociate: ['skill-1'] }])
        expect(traceAssociationRequests).toStrictEqual([{ idsToAssociate: ['trace-1'] }])
      })
    })
  })

  BddTest().when('submitting the form with empty association selections', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      submitForm({
        ...validData,
        associationSelections: {}
      })
    })

    BddTest().then('it should not call the association endpoint', async () => {
      await vi.waitFor(() => {
        expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
      })
      expect(declaredSkillAssociationRequests).toStrictEqual([])
      expect(traceAssociationRequests).toStrictEqual([])
    })
  })

  BddTest().when('submitting the form without association selections', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      const { associationSelections, ...formData } = validData
      submitForm(formData)
    })

    BddTest().then('it should not call the association endpoint', async () => {
      await vi.waitFor(() => {
        expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
      })
      expect(declaredSkillAssociationRequests).toStrictEqual([])
      expect(traceAssociationRequests).toStrictEqual([])
    })
  })

  BddTest().when('declared skill association fails', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      server.use(
        associateDeclaredExperienceWithDeclaredSkillsErrorHandler
      )
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }]
        }
      })
    })

    BddTest().then('it should display an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should call onExperienceAdded callback after settled associations', async () => {
      await vi.waitFor(() => {
        expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('trace association fails', () => {
    beforeEach(() => {
      mockOnExperienceAdded = vi.fn()
      mountForm(mockOnExperienceAdded)
      server.use(
        associateDeclaredExperienceWithTracesErrorHandler
      )
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
        }
      })
    })

    BddTest().then('it should display an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })

    BddTest().then('it should call onExperienceAdded callback after settled associations', async () => {
      await vi.waitFor(() => {
        expect(mockOnExperienceAdded).toHaveBeenCalledTimes(1)
      })
    })
  })
})
