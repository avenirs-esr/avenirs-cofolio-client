import { mockedTraceDetailed } from '@/__mocks__/fixtures/student/traces.fixtures'
import { ELanguage, type TraceDetailDTO } from '@/api/avenir-esr'
import * as avenirEsrApi from '@/api/avenir-esr'
import { useUpdateTraceForm } from '@/features/student/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { type MockInstance, vi } from 'vitest'

const mockTrace: TraceDetailDTO = {
  ...mockedTraceDetailed,
  aiUseJustification: ''
}

BddTest().given('the useUpdateTraceForm composable', () => {
  let composableResult: ReturnType<typeof useUpdateTraceForm>
  let updateTraceSpy: MockInstance<typeof avenirEsrApi.updateTrace>
  let uploadAttachmentSpy: MockInstance<typeof avenirEsrApi.uploadAttachment>

  beforeEach(() => {
    updateTraceSpy = vi.spyOn(avenirEsrApi, 'updateTrace')
    uploadAttachmentSpy = vi.spyOn(avenirEsrApi, 'uploadAttachment')

    const result = mountComposable(() => useUpdateTraceForm(mockTrace), {
      useI18n: true,
      useTanstack: true,
      usePinia: true
    })
    composableResult = result.result
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return a form instance', () => {
      expect(composableResult.form).toBeDefined()
      expect(typeof composableResult.form.useStore).toBe('function')
    })

    BddTest().then('it should initialize form with trace data', () => {
      const state = composableResult.form.useStore(state => state)

      expect(state.value.values.traceName).toBe('Développement d\'un ePortfolio')
      expect(state.value.values.personalNote).toBe('An awesome personal note')
      expect(state.value.values.isGroup).toBe(false)
      expect(state.value.values.isAuthentic).toBe(true)
      expect(state.value.values.useIA).toBe(false)
      expect(state.value.values.iaJustification).toBe('')
    })

    BddTest().then('it should return isFormValid as false initially', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isFormValid.value).toBe(false)
    })

    BddTest().then('it should return isSubmitting as false initially', () => {
      expect(composableResult.isSubmitting).toBeDefined()
      expect(composableResult.isSubmitting.value).toBe(false)
    })
  })

  BddTest().when('form is initialized with trace having AI justification', () => {
    BddTest().then('it should set useIA to true', () => {
      const traceWithIA = {
        ...mockTrace,
        aiUseJustification: 'Used AI for assistance'
      }

      const result = mountComposable(() => useUpdateTraceForm(traceWithIA), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })

      const state = result.result.form.useStore(state => state)
      expect(state.value.values.useIA).toBe(true)
      expect(state.value.values.iaJustification).toBe('Used AI for assistance')
    })
  })

  BddTest().when('form is validated with invalid data', () => {
    BddTest().then('it should return validation errors for empty title', () => {
      const invalidData = {
        file: null,
        traceName: '',
        personalNote: '',
        isAuthentic: false,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: invalidData })

      expect(validationResult?.fields?.traceName).toBe('Ce champ est requis.')
      expect(validationResult?.fields?.isAuthentic).toBe('Vous devez accepter de soumettre une production authentique et personnelle')
    })

    BddTest().then('it should return validation error when useIA is true but justification is empty', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const invalidData = {
        file: mockFile,
        traceName: 'Valid Title',
        personalNote: 'Note',
        isAuthentic: true,
        isGroup: false,
        useIA: true,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      const validationResult = onSubmitValidator!({ value: invalidData })

      expect(validationResult?.fields?.iaJustification).toBe('Ce champ est requis.')
    })
  })

  BddTest().when('form is validated with valid data', () => {
    BddTest().then('it should return no validation errors', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const validData = {
        file: mockFile,
        traceName: 'Updated Title',
        personalNote: 'Updated note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: validData })

      expect(validationResult?.fields?.traceName).toBeUndefined()
      expect(validationResult?.fields?.file).toBeUndefined()
      expect(validationResult?.fields?.isAuthentic).toBeUndefined()
    })
  })

  BddTest().when('form is submitted', () => {
    BddTest().then('it should have onSubmit function defined', () => {
      expect(composableResult.form.options.onSubmit).toBeDefined()
      expect(typeof composableResult.form.options.onSubmit).toBe('function')
    })

    BddTest().then('it should call updateTrace API with correct data', async () => {
      const formData = {
        file: null,
        traceName: 'Updated Title',
        personalNote: 'Updated note',
        isAuthentic: true,
        isGroup: true,
        useIA: false,
        iaJustification: ''
      }

      const onSubmit = composableResult.form.options.onSubmit
      expect(onSubmit).toBeDefined()
      onSubmit!({ value: formData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(updateTraceSpy).toHaveBeenCalledWith('trace1', {
          title: 'Updated Title',
          personalNote: 'Updated note',
          isGroup: true,
          iaJustification: undefined,
          language: ELanguage.FRENCH
        })
      })
    })

    BddTest().then('it should call updateTrace without personalNote when empty', async () => {
      const formData = {
        file: null,
        traceName: 'Updated Title',
        personalNote: '',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(updateTraceSpy).toHaveBeenCalledWith('trace1', {
          title: 'Updated Title',
          personalNote: undefined,
          isGroup: false,
          iaJustification: undefined,
          language: ELanguage.FRENCH
        })
      })
    })

    BddTest().then('it should handle form submission with AI usage and justification', async () => {
      const formData = {
        file: null,
        traceName: 'Updated Title',
        personalNote: 'Note',
        isAuthentic: true,
        isGroup: false,
        useIA: true,
        iaJustification: 'Used AI for research'
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(updateTraceSpy).toHaveBeenCalledWith('trace1', {
          title: 'Updated Title',
          personalNote: 'Note',
          isGroup: false,
          iaJustification: 'Used AI for research',
          language: ELanguage.FRENCH
        })
      })
    })

    BddTest().then('it should handle file field dirty state check', () => {
      const fileField = composableResult.form.useField({ name: 'file' })

      expect(fileField.state.value.meta.isDirty).toBe(false)
    })

    BddTest().then('it should not upload file when file field is not dirty', async () => {
      const formData = {
        file: new File(['original'], 'test.pdf', { type: 'application/pdf' }),
        traceName: 'Updated Title',
        personalNote: 'Note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })

      await vi.waitFor(() => {
        expect(updateTraceSpy).toHaveBeenCalled()
      })

      await vi.waitFor(() => {
        expect(uploadAttachmentSpy).not.toHaveBeenCalled()
      }, { timeout: 1000 })
    })

    BddTest().then('it should handle onTraceUpdated callback when provided', async () => {
      const onTraceUpdated = vi.fn()

      const result = mountComposable(() => useUpdateTraceForm(mockTrace, onTraceUpdated), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })

      const formData = {
        file: null,
        traceName: 'Updated Title',
        personalNote: 'Note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      result.result.form.options.onSubmit?.({ value: formData, formApi: result.result.form, meta: {} })

      await vi.waitFor(() => {
        expect(updateTraceSpy).toHaveBeenCalled()
      })

      await vi.waitFor(() => {
        expect(onTraceUpdated).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('validating file on change', () => {
    BddTest().then('it should validate file field', () => {
      const onChangeValidator = composableResult.form.options.validators?.onChange
      expect(onChangeValidator).toBeDefined()

      const invalidData = {
        file: null,
        traceName: 'Title',
        personalNote: 'Note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      const validationResult = onChangeValidator!({ value: invalidData })
      expect(validationResult?.fields?.file).toBe('Ce champ est requis.')
    })
  })
})
