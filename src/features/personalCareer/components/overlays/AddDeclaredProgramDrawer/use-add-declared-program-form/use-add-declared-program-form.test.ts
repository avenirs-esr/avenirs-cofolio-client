import type { DeclaredProgramFormData } from '@/features/personalCareer/types/forms.types'
import { createDeclaredProgramErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { useAddDeclaredProgramForm } from '@/features/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/personalCareer/config'
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

BddTest().given('an add declared program form', () => {
  let composableResult: ReturnType<typeof useAddDeclaredProgramForm>
  let mockOnProgramAdded: ReturnType<typeof vi.fn>

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
      expect(composableResult.form.state.values.title).toBe('')
      expect(composableResult.form.state.values.description).toBe('')
      expect(composableResult.form.state.values.organization).toBe('')
      expect(composableResult.form.state.values.result).toBe('')
      expect(composableResult.form.state.values.sourceOfInformation).toBe('')
      expect(composableResult.form.state.values.startDate).toBe('')
      expect(composableResult.form.state.values.endDate).toBe('')
      expect(composableResult.form.state.values.isOngoing).toBe(false)
      expect(composableResult.form.state.values.valorized).toBe(false)
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

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.title).toBe('Ce champ est requis.')
        expect(result?.fields?.organization).toBe('Ce champ est requis.')
        expect(result?.fields?.startDate).toBe('Ce champ est requis.')
        expect(result?.fields?.endDate).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('fields exceed max length', () => {
      BddTest().then('it should return title max length error', () => {
        const invalidData: DeclaredProgramFormData = {
          title: 'a'.repeat(DECLARED_PROGRAM_TITLE_MAX_LENGTH + 1),
          description: 'a'.repeat(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH + 1),
          organization: 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH + 1),
          result: 'a'.repeat(DECLARED_PROGRAM_RESULT_MAX_LENGTH + 1),
          sourceOfInformation: 'a'.repeat(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH + 1),
          startDate: '2024-01',
          endDate: '2024-12',
          isOngoing: false,
          valorized: false
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

    BddTest().and('endDate is missing when not ongoing', () => {
      BddTest().then('it should return endDate required error', () => {
        const invalidData: DeclaredProgramFormData = {
          title: 'Valid Title',
          description: '',
          organization: 'University',
          result: '',
          sourceOfInformation: '',
          startDate: '2024-01',
          endDate: '',
          isOngoing: false,
          valorized: false
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: invalidData })

        expect(result?.fields?.endDate).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('all required fields are filled and isOngoing is true', () => {
      BddTest().then('it should not require endDate', () => {
        const validData: DeclaredProgramFormData = {
          title: 'Valid Title',
          description: '',
          organization: 'University',
          result: '',
          sourceOfInformation: '',
          startDate: '2024-01',
          endDate: '',
          isOngoing: true,
          valorized: false
        }

        const validator = getOnSubmitValidator()
        const result = validator({ value: validData })

        expect(result?.fields?.title).toBeUndefined()
        expect(result?.fields?.organization).toBeUndefined()
        expect(result?.fields?.startDate).toBeUndefined()
        expect(result?.fields?.endDate).toBeUndefined()
      })
    })

    BddTest().and('data is valid', () => {
      BddTest().then('it should not return validation errors', () => {
        const validData: DeclaredProgramFormData = {
          title: 'Master en Informatique',
          description: 'Description of the program',
          organization: 'University Paris-Saclay',
          result: 'Mention Très Bien',
          sourceOfInformation: 'University website',
          startDate: '2024-01',
          endDate: '2025-12',
          isOngoing: false,
          valorized: false
        }

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
        setFormValues({
          title: 'Master en Informatique',
          organization: 'University Paris-Saclay',
          startDate: '2024-01',
          endDate: '2025-12',
          isOngoing: false
        })
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
          title: 'Master en Informatique',
          organization: 'University Paris-Saclay',
          startDate: '2024-01',
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
        setFormValues({
          title: 'Master en Informatique',
          organization: 'University Paris-Saclay',
          startDate: '2024-01',
          endDate: '2025-12',
          isOngoing: false
        })
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
})
