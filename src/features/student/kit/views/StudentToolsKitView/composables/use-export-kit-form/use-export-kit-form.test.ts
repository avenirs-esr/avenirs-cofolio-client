import { KIT_NAME_MAX_LENGTH } from '@/features/student/kit/config'
import {
  ExportKitOptions,
  useExportKitForm,
  type UseExportKitFormData
} from '@/features/student/kit/views/StudentToolsKitView/composables/use-export-kit-form/use-export-kit-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an export kit form composable', () => {
  let composableResult: ReturnType<typeof useExportKitForm>
  let mockOnSuccess: ReturnType<typeof vi.fn>

  const mountForm = () => {
    const result = mountComposable(
      () => useExportKitForm(mockOnSuccess),
      {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      }
    )

    composableResult = result.result
  }

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()

    return validator!
  }

  const setFormValues = (data: Partial<UseExportKitFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        composableResult.form.setFieldValue(
          key as keyof UseExportKitFormData,
          value
        )
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockOnSuccess = vi.fn()

    mountForm()
  })

  BddTest().when('the form is initialized', () => {
    BddTest().then('it should return the expected structure', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.form).toBeDefined()
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.resetForm).toBeDefined()
    })

    BddTest().then('it should have default values', () => {
      expect(composableResult.form.state.values).toEqual({
        exportOptions: [],
        kitName: ''
      })
    })

    BddTest().then('it should not be dirty', () => {
      expect(composableResult.form.state.isDirty).toBe(false)
    })

    BddTest().then('it should not be valid', () => {
      expect(composableResult.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('validating export options', () => {
    BddTest().and('no export option is selected', () => {
      BddTest().then('it should return a required error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [],
            kitName: 'Mon kit'
          }
        })

        expect(result?.fields?.exportOptions).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('an export option is selected', () => {
      BddTest().then('it should not return a validation error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [ExportKitOptions.TEXT_CONTENT],
            kitName: 'Mon kit'
          }
        })

        expect(result?.fields?.exportOptions).toBeUndefined()
      })
    })

    BddTest().and('both export options are selected', () => {
      BddTest().then('it should not return a validation error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [
              ExportKitOptions.TEXT_CONTENT,
              ExportKitOptions.MEDIA_CONTENT
            ],
            kitName: 'Mon kit'
          }
        })

        expect(result?.fields?.exportOptions).toBeUndefined()
      })
    })
  })

  BddTest().when('validating kit name', () => {
    BddTest().and('kit name is empty', () => {
      BddTest().then('it should return a required error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [ExportKitOptions.TEXT_CONTENT],
            kitName: ''
          }
        })

        expect(result?.fields?.kitName).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('kit name exceeds maximum length', () => {
      BddTest().then('it should return a max length error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [ExportKitOptions.TEXT_CONTENT],
            kitName: 'a'.repeat(KIT_NAME_MAX_LENGTH + 1)
          }
        })

        expect(result?.fields?.kitName).toBe(
          `Veuillez limiter votre saisie à ${KIT_NAME_MAX_LENGTH} caractères`
        )
      })
    })

    BddTest().and('kit name is exactly at maximum length', () => {
      BddTest().then('it should not return a validation error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [ExportKitOptions.TEXT_CONTENT],
            kitName: 'a'.repeat(KIT_NAME_MAX_LENGTH)
          }
        })

        expect(result?.fields?.kitName).toBeUndefined()
      })
    })

    BddTest().and('kit name is valid', () => {
      BddTest().then('it should not return a validation error', () => {
        const validator = getOnSubmitValidator()

        const result = validator({
          value: {
            exportOptions: [ExportKitOptions.TEXT_CONTENT],
            kitName: 'Mon kit'
          }
        })

        expect(result?.fields?.kitName).toBeUndefined()
      })
    })
  })

  BddTest().when('checking form validity', () => {
    BddTest().and('the form is untouched', () => {
      BddTest().then('it should not be valid', () => {
        expect(composableResult.isFormValid.value).toBe(false)
      })
    })

    BddTest().and('the kit name is valid but no export option is selected', () => {
      beforeEach(() => {
        setFormValues({
          kitName: 'Mon kit'
        })
      })

      BddTest().then('it should not be valid', () => {
        expect(composableResult.form.state.isDirty).toBe(true)
        expect(composableResult.isFormValid.value).toBe(false)
      })
    })

    BddTest().and('all required fields are valid', () => {
      beforeEach(() => {
        setFormValues({
          exportOptions: [ExportKitOptions.TEXT_CONTENT],
          kitName: 'Mon kit'
        })
      })

      BddTest().then('it should be valid', async () => {
        await vi.waitFor(() => {
          expect(composableResult.isFormValid.value).toBe(true)
        })
      })
    })
  })

  BddTest().when('submitting the form', () => {
    BddTest().and('the form is valid', () => {
      const formData: UseExportKitFormData = {
        exportOptions: [
          ExportKitOptions.TEXT_CONTENT,
          ExportKitOptions.MEDIA_CONTENT
        ],
        kitName: 'Mon kit'
      }

      beforeEach(() => {
        setFormValues(formData)
      })

      BddTest().then('it should call onSuccess with the form data', async () => {
        await composableResult.form.handleSubmit()

        await vi.waitFor(() => {
          expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        })

        expect(mockOnSuccess).toHaveBeenCalledWith(formData)
      })
    })

    BddTest().and('the form is invalid', () => {
      beforeEach(() => {
        setFormValues({
          kitName: ''
        })
      })

      BddTest().then('it should not call onSuccess', async () => {
        await composableResult.form.handleSubmit()

        expect(mockOnSuccess).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('resetting the form', () => {
    BddTest().and('the form contains values', () => {
      beforeEach(() => {
        setFormValues({
          exportOptions: [ExportKitOptions.TEXT_CONTENT],
          kitName: 'Mon kit'
        })
      })

      BddTest().then('it should restore the default values', () => {
        composableResult.resetForm()

        expect(composableResult.form.state.values).toEqual({
          exportOptions: [],
          kitName: ''
        })
      })

      BddTest().then('it should clear the dirty state', () => {
        composableResult.resetForm()

        expect(composableResult.form.state.isDirty).toBe(false)
      })

      BddTest().then('it should make the form invalid again', () => {
        composableResult.resetForm()

        expect(composableResult.isFormValid.value).toBe(false)
      })
    })
  })
})
