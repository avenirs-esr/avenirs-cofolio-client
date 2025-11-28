import { type AddElementFormData, useAddElementForm } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/composables/use-add-element-form/use-add-element-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockOnConfirm = vi.fn()

BddTest().given('the useAddElementForm composable', () => {
  let composableResult: ReturnType<typeof useAddElementForm>

  const createInvalidFormData = (): AddElementFormData => ({
    title: '',
    description: '',
    rating: undefined
  } as unknown as AddElementFormData)

  const getOnSubmitValidator = () => {
    const validator = composableResult.form.options.validators?.onSubmit
    expect(validator).toBeDefined()
    return validator!
  }

  const getOnSubmitHandler = () => {
    const handler = composableResult.form.options.onSubmit
    expect(handler).toBeDefined()
    return handler!
  }

  const invalidData = createInvalidFormData()
  const validData: AddElementFormData = {
    title: 'Test Title',
    description: 'Test Description',
    rating: 5
  }
  let validationResult: ReturnType<ReturnType<typeof getOnSubmitValidator>>
  let onSubmitHandler: ReturnType<ReturnType<typeof getOnSubmitHandler>>

  BddTest().when('the composable is initialized', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      composableResult = mountComposable(() => useAddElementForm(mockOnConfirm), { useI18n: true }).result
    })

    BddTest().then('it should return a form instance', () => {
      expect(composableResult.form).toBeDefined()
    })

    BddTest().then('it should return a isModified computed property', () => {
      expect(composableResult.isModified).toBeDefined()
    })

    BddTest().then('isModified should be false initially', () => {
      expect(composableResult.isModified.value).toBe(false)
    })

    BddTest().then('it should return a isValid computed property', () => {
      expect(composableResult.isValid).toBeDefined()
    })

    BddTest().then('isValid should be true initially', () => {
      expect(composableResult.isValid.value).toBe(true)
    })

    BddTest().then('it should return a resetForm function', () => {
      expect(composableResult.resetForm).toBeDefined()
    })

    BddTest().and('data are set in the form', () => {
      beforeEach(() => {
        composableResult.form.setFieldValue('title', validData.title)
        composableResult.form.setFieldValue('description', validData.description)
        composableResult.form.setFieldValue('rating', validData.rating)
      })

      BddTest().then('isModified should be true', () => {
        expect(composableResult.isModified.value).toBe(true)
      })

      BddTest().and('the form is reset', () => {
        beforeEach(() => {
          composableResult.resetForm()
        })

        BddTest().then('isModified should be false', () => {
          expect(composableResult.isModified.value).toBe(false)
        })
      })
    })

    BddTest().and('the form is validated with invalid data', () => {
      beforeEach(() => {
        const validator = getOnSubmitValidator()
        validationResult = validator({ value: invalidData })
      })

      BddTest().then('it should return validation errors for title and description fields', () => {
        expect(validationResult.fields.title).toBeDefined()
        expect(validationResult.fields.description).toBeDefined()
        expect(validationResult.fields.title).toBe('Ce champ est requis.')
        expect(validationResult.fields.description).toBe('Ce champ est requis.')
      })
    })

    BddTest().and('the form is validated with valid data', () => {
      beforeEach(() => {
        const validator = getOnSubmitValidator()
        validationResult = validator({ value: validData })
      })

      BddTest().then('it should not return any validation errors', () => {
        expect(validationResult.fields.title).toBeUndefined()
        expect(validationResult.fields.description).toBeUndefined()
      })
    })

    BddTest().and('the form is submitted with valid data', () => {
      beforeEach(async () => {
        onSubmitHandler = getOnSubmitHandler()
        await onSubmitHandler({ value: validData })
      })

      BddTest().then('it should call the onConfirm callback with the form data', () => {
        expect(mockOnConfirm).toHaveBeenCalledTimes(1)
        expect(mockOnConfirm).toHaveBeenCalledWith(validData)
      })
    })
  })
})
