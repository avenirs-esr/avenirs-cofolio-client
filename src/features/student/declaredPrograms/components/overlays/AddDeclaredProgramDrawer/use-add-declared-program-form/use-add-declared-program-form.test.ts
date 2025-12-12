import type { DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import { createDeclaredProgramErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { useAddDeclaredProgramForm } from '@/features/student/declaredPrograms/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import {
  DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH,
  DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH,
  DECLARED_PROGRAM_RESULT_MAX_LENGTH,
  DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH,
  DECLARED_PROGRAM_TITLE_MAX_LENGTH
} from '@/features/student/declaredPrograms/config'
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

  BddTest().when('the form is initialized without callback', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

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
      expect(composableResult.form.state.values.link).toBe('')
      expect(composableResult.form.state.values.startDate).toBe('')
      expect(composableResult.form.state.values.endDate).toBe('')
      expect(composableResult.form.state.values.isOngoing).toBe(false)
    })

    BddTest().then('it should not be submitting initially', () => {
      expect(composableResult.isSubmitting.value).toBe(false)
    })

    BddTest().then('it should not be valid initially', () => {
      expect(composableResult.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('the form is initialized with callback', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      const result = mountComposable(() => useAddDeclaredProgramForm(mockOnProgramAdded), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should accept onProgramAdded callback', () => {
      expect(composableResult).toBeDefined()
      expect(mockOnProgramAdded).toBeDefined()
    })
  })

  BddTest().when('validating with all required fields empty', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should return validation errors for required fields', () => {
      const invalidData: DeclaredProgramFormData = {
        title: '',
        description: '',
        organization: '',
        result: '',
        sourceOfInformation: '',
        link: '',
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

  BddTest().when('validating fields exceeding max length', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should return title max length error', () => {
      const invalidData: DeclaredProgramFormData = {
        title: 'a'.repeat(DECLARED_PROGRAM_TITLE_MAX_LENGTH + 1),
        description: '',
        organization: 'University',
        result: '',
        sourceOfInformation: '',
        link: '',
        startDate: '2024-01',
        endDate: '2024-12',
        isOngoing: false
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: invalidData })

      expect(result?.fields?.title).toBe('Veuillez limiter votre saisie à 80 caractères')
    })

    BddTest().then('it should return description max length error', () => {
      const invalidData: DeclaredProgramFormData = {
        title: 'Valid Title',
        description: 'a'.repeat(DECLARED_PROGRAM_DESCRIPTION_MAX_LENGTH + 1),
        organization: 'University',
        result: '',
        sourceOfInformation: '',
        link: '',
        startDate: '2024-01',
        endDate: '2024-12',
        isOngoing: false
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: invalidData })

      expect(result?.fields?.description).toBe('Veuillez limiter votre saisie à 400 caractères')
    })

    BddTest().then('it should return organization max length error', () => {
      const invalidData: DeclaredProgramFormData = {
        title: 'Valid Title',
        description: '',
        organization: 'a'.repeat(DECLARED_PROGRAM_ORGANIZATION_MAX_LENGTH + 1),
        result: '',
        sourceOfInformation: '',
        link: '',
        startDate: '2024-01',
        endDate: '2024-12',
        isOngoing: false
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: invalidData })

      expect(result?.fields?.organization).toBe('Veuillez limiter votre saisie à 50 caractères')
    })

    BddTest().then('it should return result max length error', () => {
      const invalidData: DeclaredProgramFormData = {
        title: 'Valid Title',
        description: '',
        organization: 'University',
        result: 'a'.repeat(DECLARED_PROGRAM_RESULT_MAX_LENGTH + 1),
        sourceOfInformation: '',
        link: '',
        startDate: '2024-01',
        endDate: '2024-12',
        isOngoing: false
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: invalidData })

      expect(result?.fields?.result).toBe('Veuillez limiter votre saisie à 50 caractères')
    })

    BddTest().then('it should return sourceOfInformation max length error', () => {
      const invalidData: DeclaredProgramFormData = {
        title: 'Valid Title',
        description: '',
        organization: 'University',
        result: '',
        sourceOfInformation: 'a'.repeat(DECLARED_PROGRAM_SOURCE_OF_INFORMATION_MAX_LENGTH + 1),
        link: '',
        startDate: '2024-01',
        endDate: '2024-12',
        isOngoing: false
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: invalidData })

      expect(result?.fields?.sourceOfInformation).toBe('Veuillez limiter votre saisie à 200 caractères')
    })
  })

  BddTest().when('validating with endDate missing when not ongoing', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should return endDate required error', () => {
      const invalidData: DeclaredProgramFormData = {
        title: 'Valid Title',
        description: '',
        organization: 'University',
        result: '',
        sourceOfInformation: '',
        link: '',
        startDate: '2024-01',
        endDate: '',
        isOngoing: false
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: invalidData })

      expect(result?.fields?.endDate).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('validating with all required fields and isOngoing true', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should not require endDate', () => {
      const validData: DeclaredProgramFormData = {
        title: 'Valid Title',
        description: '',
        organization: 'University',
        result: '',
        sourceOfInformation: '',
        link: '',
        startDate: '2024-01',
        endDate: '',
        isOngoing: true
      }

      const validator = getOnSubmitValidator()
      const result = validator({ value: validData })

      expect(result?.fields?.title).toBeUndefined()
      expect(result?.fields?.organization).toBeUndefined()
      expect(result?.fields?.startDate).toBeUndefined()
      expect(result?.fields?.endDate).toBeUndefined()
    })
  })

  BddTest().when('validating with valid data', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should not return validation errors', () => {
      const validData: DeclaredProgramFormData = {
        title: 'Master en Informatique',
        description: 'Description of the program',
        organization: 'University Paris-Saclay',
        result: 'Mention Très Bien',
        sourceOfInformation: 'University website',
        link: 'https://example.com',
        startDate: '2024-01',
        endDate: '2025-12',
        isOngoing: false
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

  BddTest().when('submitting the form with valid data', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      const result = mountComposable(() => useAddDeclaredProgramForm(mockOnProgramAdded), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should call onProgramAdded callback on success', async () => {
      setFormValues({
        title: 'Master en Informatique',
        organization: 'University Paris-Saclay',
        startDate: '2024-01',
        endDate: '2025-12',
        isOngoing: false
      })

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('submitting the form with isOngoing true', () => {
    beforeEach(() => {
      mockOnProgramAdded = vi.fn()
      const result = mountComposable(() => useAddDeclaredProgramForm(mockOnProgramAdded), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should not send endDate in the request', async () => {
      setFormValues({
        title: 'Master en Informatique',
        organization: 'University Paris-Saclay',
        startDate: '2024-01',
        endDate: '2025-12',
        isOngoing: true
      })

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(mockOnProgramAdded).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('the form submission fails', () => {
    beforeEach(() => {
      server.use(createDeclaredProgramErrorHandler)

      mockOnProgramAdded = vi.fn()
      const result = mountComposable(() => useAddDeclaredProgramForm(mockOnProgramAdded), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('it should not call onProgramAdded callback', async () => {
      setFormValues({
        title: 'Master en Informatique',
        organization: 'University Paris-Saclay',
        startDate: '2024-01',
        endDate: '2025-12',
        isOngoing: false
      })

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(composableResult.isSubmitting.value).toBe(false)
      })

      expect(mockOnProgramAdded).not.toHaveBeenCalled()
    })

    BddTest().then('it should set isSubmitting back to false', async () => {
      setFormValues({
        title: 'Master en Informatique',
        organization: 'University Paris-Saclay',
        startDate: '2024-01',
        endDate: '2025-12',
        isOngoing: false
      })

      await composableResult.form.handleSubmit()

      await vi.waitFor(() => {
        expect(composableResult.isSubmitting.value).toBe(false)
      })
    })
  })

  BddTest().when('the form becomes valid', () => {
    beforeEach(() => {
      const result = mountComposable(() => useAddDeclaredProgramForm(), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })
      composableResult = result.result
    })

    BddTest().then('isFormValid should be true when all conditions met', async () => {
      setFormValues({
        title: 'Master en Informatique',
        organization: 'University Paris-Saclay',
        startDate: '2024-01',
        endDate: '2025-12',
        isOngoing: false
      })

      await vi.waitFor(() => {
        expect(composableResult.isFormValid.value).toBe(true)
      })
    })
  })
})
