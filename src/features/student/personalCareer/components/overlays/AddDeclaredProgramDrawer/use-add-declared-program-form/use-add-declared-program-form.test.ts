import type { DeclaredProgramFormData } from '@/features/student/personalCareer/types/forms.types'
import { declaredProgramViewDTOFixture } from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import { associateErrorHandler, createAssociateHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { createDeclaredProgramErrorHandler, createDeclaredProgramHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import {
  useAddDeclaredProgramForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

interface AssociationRequest {
  contextType: EAssociationContextType
  elementId: string
  associatedContextType: EAssociationContextType
  idsToAssociate: string[]
}

const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'

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

BddTest().given('an add declared program form', () => {
  let composableResult: ReturnType<typeof useAddDeclaredProgramForm>
  let mockOnProgramAdded: ReturnType<typeof vi.fn>
  const associationRequests: AssociationRequest[] = []

  const createAssociationRequest = (associatedContextType: EAssociationContextType, idsToAssociate: string[]): AssociationRequest => ({
    contextType: EAssociationContextType.DECLARED_PROGRAM,
    elementId: declaredProgramViewDTOFixture.id,
    associatedContextType,
    idsToAssociate
  })

  const validData: DeclaredProgramFormData = {
    title: 'Master en Informatique',
    description: 'Description of the program',
    organization: 'University Paris-Saclay',
    result: 'Mention Très Bien',
    sourceOfInformation: 'University website',
    startDate: '2024-01',
    endDate: '2025-12',
    isOngoing: false,
    valorized: false,
    associationSelections: {}
  }

  const mountForm = (onProgramAdded?: () => void) => {
    const result = mountComposable(() => useAddDeclaredProgramForm(onProgramAdded), {
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

  const setFormValues = (data: Partial<DeclaredProgramFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        composableResult.form.setFieldValue(key as keyof DeclaredProgramFormData, value)
      }
    })
  }

  const submitForm = (value: DeclaredProgramFormData) => {
    composableResult.form.options.onSubmit?.({ value, formApi: composableResult.form, meta: {} })
  }

  beforeEach(() => {
    associationRequests.length = 0
    server.use(
      createDeclaredProgramHandler(),
      createAssociateHandler(({ contextType, elementId, associatedContextType }, { idsToAssociate }) => {
        associationRequests.push({ contextType, elementId, associatedContextType, idsToAssociate })
      })
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
      expect(composableResult.hasDefinitionItemsError).toBeDefined()
    })

    BddTest().then('it should have default values', () => {
      const expectedDefaults: DeclaredProgramFormData = {
        title: '',
        description: '',
        organization: '',
        result: '',
        sourceOfInformation: '',
        startDate: '',
        endDate: '',
        isOngoing: false,
        valorized: false,
        associationSelections: {}
      }

      Object.entries(expectedDefaults).forEach(([key, expectedValue]) => {
        if (typeof expectedValue === 'object' && expectedValue !== null) {
          expect(composableResult.form.state.values[key as keyof DeclaredProgramFormData]).toStrictEqual(expectedValue)
          return
        }

        expect(composableResult.form.state.values[key as keyof DeclaredProgramFormData]).toBe(expectedValue)
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
        mockOnProgramAdded = vi.fn()
        mountForm(mockOnProgramAdded)
      })

      BddTest().then('it should accept onProgramAdded callback', () => {
        expect(composableResult).toBeDefined()
        expect(mockOnProgramAdded).toBeDefined()
      })
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
          isOngoing: false,
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
          title: DECLARED_PROGRAM_TITLE_MAX_LENGTH,
          description: DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
          organization: DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
          result: DECLARED_PROGRAM_RESULT_MAX_LENGTH,
          sourceOfInformation: DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH
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
        const invalidData: DeclaredProgramFormData = {
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
        const ongoingProgram: DeclaredProgramFormData = {
          ...validData,
          endDate: '',
          isOngoing: true
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: ongoingProgram })

        expect(result?.fields?.title).toBeUndefined()
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
        expect(result?.fields?.description).toBeUndefined()
        expect(result?.fields?.organization).toBeUndefined()
        expect(result?.fields?.result).toBeUndefined()
        expect(result?.fields?.sourceOfInformation).toBeUndefined()
        expect(result?.fields?.startDate).toBeUndefined()
        expect(result?.fields?.endDate).toBeUndefined()
      })
    })
  })

  BddTest().when('submitting the form', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
    })

    BddTest().and('data is valid', () => {
      beforeEach(() => {
        setFormValues(validData)
      })

      BddTest().then('it should call onProgramAdded callback on success', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
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
          expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
        })
      })
    })

    BddTest().and('submission fails', () => {
      beforeEach(() => {
        server.use(createDeclaredProgramErrorHandler)
        setFormValues(validData)
      })

      BddTest().then('it should not call onProgramAdded callback', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(composableResult.isSubmitting.value).toBe(false)
        })

        expect(mockOnProgramAdded).not.toHaveBeenCalled()
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
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
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

    BddTest().then('it should associate selected declared skills with the created program in one request', async () => {
      await vi.waitFor(() => {
        expect(associationRequests).toStrictEqual([
          createAssociationRequest(EAssociationContextType.DECLARED_SKILL, ['skill-1', 'skill-2'])
        ])
      })
    })

    BddTest().then('it should call onProgramAdded callback after association', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
      expect(associationRequests).toHaveLength(1)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('submitting the form with trace associations', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
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

    BddTest().then('it should associate selected traces with the created program in one request', async () => {
      await vi.waitFor(() => {
        expect(associationRequests).toStrictEqual([
          createAssociationRequest(EAssociationContextType.TRACE, ['trace-1', 'trace-2'])
        ])
      })
    })

    BddTest().then('it should call onProgramAdded callback after association', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
      expect(associationRequests).toHaveLength(1)
    })
  })

  BddTest().when('submitting the form with declared skill and trace associations', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
          [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
        }
      })
    })

    BddTest().then('it should send one association request per selected context type', async () => {
      await vi.waitFor(() => {
        expect(associationRequests).toHaveLength(2)
      })

      expect(associationRequests).toEqual(expect.arrayContaining([
        createAssociationRequest(EAssociationContextType.DECLARED_SKILL, ['skill-1']),
        createAssociationRequest(EAssociationContextType.TRACE, ['trace-1'])
      ]))
    })
  })

  BddTest().when('submitting the form with an empty selection for a context type', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [],
          [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
        }
      })
    })

    BddTest().then('it should only associate the context types having selected elements', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })

      expect(associationRequests).toStrictEqual([
        createAssociationRequest(EAssociationContextType.TRACE, ['trace-1'])
      ])
    })
  })

  BddTest().when('submitting the form with a non associable context type', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_ACTIVITY]: [{ id: 'activity-1', title: 'Activity 1' }],
          [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
        }
      })
    })

    BddTest().then('it should ignore the non associable context type', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })

      expect(associationRequests).toStrictEqual([
        createAssociationRequest(EAssociationContextType.TRACE, ['trace-1'])
      ])
    })
  })

  BddTest().when('submitting the form with empty association selections', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      submitForm({
        ...validData,
        associationSelections: {}
      })
    })

    BddTest().then('it should not call the association endpoint', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
      expect(associationRequests).toStrictEqual([])
    })
  })

  BddTest().when('submitting the form without association selections', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      const { associationSelections, ...formData } = validData
      submitForm(formData)
    })

    BddTest().then('it should not call the association endpoint', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
      expect(associationRequests).toStrictEqual([])
    })
  })

  BddTest().when('declared skill association fails', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      server.use(associateErrorHandler)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }]
        }
      })
    })

    BddTest().then('it should display a generic error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
      })
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: GENERIC_ERROR_TITLE,
        description: expect.any(String)
      })
    })

    BddTest().then('it should call onProgramAdded callback after settled associations', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('declared skill and trace associations fail', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      mountForm(mockOnProgramAdded)
      server.use(associateErrorHandler)
      submitForm({
        ...validData,
        associationSelections: {
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
          [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
        }
      })
    })

    BddTest().then('it should display one generic error message per failed association request', async () => {
      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalledTimes(2)
      expect(mockAddErrorMessage).toHaveBeenNthCalledWith(1, { title: GENERIC_ERROR_TITLE, description: expect.any(String) })
      expect(mockAddErrorMessage).toHaveBeenNthCalledWith(2, { title: GENERIC_ERROR_TITLE, description: expect.any(String) })
    })
  })
})
