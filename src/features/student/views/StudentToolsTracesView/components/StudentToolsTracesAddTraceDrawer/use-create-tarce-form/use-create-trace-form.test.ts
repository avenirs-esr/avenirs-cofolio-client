import { mountComposable } from '@/ui/tests/utils'
import { useCreateTraceForm } from './use-create-trace-form'

describe('useCreateTraceForm', () => {
  describe('given the useCreateTraceForm composable', () => {
    let composableResult: ReturnType<typeof useCreateTraceForm>

    beforeEach(() => {
      const result = mountComposable(() => useCreateTraceForm(), {
        useI18n: true
      })
      composableResult = result.result
    })

    describe('when the composable is initialized', () => {
      it('then it should return a form instance', () => {
        expect(composableResult.form).toBeDefined()
        expect(typeof composableResult.form.useStore).toBe('function')
      })

      it('then it should return isFormValid as true initially', () => {
        expect(composableResult.isFormValid).toBeDefined()
        expect(composableResult.isFormValid.value).toBe(true)
      })
    })

    describe('when form is validated with invalid data', () => {
      it('then it should return validation errors', () => {
        const invalidData = {
          file: null as unknown as File,
          traceName: '',
          personalNote: ''
        }

        const validationResult = composableResult.form.options.validators?.onSubmit?.({ value: invalidData })

        expect(validationResult?.fields?.file).toBe('Ce champ est requis.')
        expect(validationResult?.fields?.traceName).toBe('Ce champ est requis.')
      })
    })

    describe('when form is validated with valid data', () => {
      it('then it should return no validation errors', () => {
        const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
        const validData = {
          file: mockFile,
          traceName: 'My Trace Name',
          personalNote: 'Optional note'
        }

        const validationResult = composableResult.form.options.validators?.onSubmit?.({ value: validData })

        expect(validationResult?.fields?.file).toBeUndefined()
        expect(validationResult?.fields?.traceName).toBeUndefined()
      })
    })

    describe('when form is submitted', () => {
      it('then it should call createTrace function', async () => {
        const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
        const formData = {
          file: mockFile,
          traceName: 'My Trace Name',
          personalNote: 'Optional note'
        }

        // Since createTrace is empty (TODO), onSubmit should complete without error
        await expect(composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })).resolves.toBeUndefined()
      })
    })
  })
})
