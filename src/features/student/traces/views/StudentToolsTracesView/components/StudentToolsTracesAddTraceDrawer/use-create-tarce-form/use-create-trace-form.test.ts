import {
  type AttachmentUploadDTO,
  type CreateTraceDTO,
  ELanguage,
  type TracesCreationResponse,
  type UploadAttachmentBody
} from '@/api/avenir-esr'
import * as avenirEsrApi from '@/api/avenir-esr'
import { useCreateTraceForm } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { waitFor } from 'storybook/test'
import { mountComposable } from 'tests/utils'
import { type MockInstance, vi } from 'vitest'

BddTest().given('the useCreateTraceForm composable', () => {
  let composableResult: ReturnType<typeof useCreateTraceForm>
  let createTraceSpy: MockInstance<(createTraceDTO: CreateTraceDTO, options?: RequestInit | undefined) => Promise<TracesCreationResponse>>
  let uploadAttachmentSpy: MockInstance<(traceId: string, uploadAttachmentBody: UploadAttachmentBody, options?: RequestInit | undefined) => Promise<AttachmentUploadDTO>>

  beforeEach(() => {
    createTraceSpy = vi.spyOn(avenirEsrApi, 'createTrace')
    uploadAttachmentSpy = vi.spyOn(avenirEsrApi, 'uploadAttachment')

    const result = mountComposable(() => useCreateTraceForm(), {
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

    BddTest().then('it should return isFormValid as true initially', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isFormValid.value).toBe(true)
    })
  })

  BddTest().when('form is validated with invalid data', () => {
    BddTest().then('it should return validation errors', () => {
      const invalidData = {
        file: null as unknown as File,
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

      expect(validationResult?.fields?.file).toEqual('Ce champ est requis.')
      expect(validationResult?.fields?.traceName).toContain('Ce champ est requis.')
      expect(validationResult?.fields?.isAuthentic).toEqual('Vous devez accepter de soumettre une production authentique et personnelle')
    })
  })

  BddTest().when('form is validated with valid data', () => {
    BddTest().then('it should return no validation errors', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const validData = {
        file: mockFile,
        traceName: 'My Trace Name',
        personalNote: 'Optional note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: validData })

      expect(validationResult?.fields?.file).toBeUndefined()
      expect(validationResult?.fields?.traceName).toBeUndefined()
    })
  })

  BddTest().when('form is submitted', () => {
    BddTest().then('it should have onSubmit function defined', () => {
      expect(composableResult.form.options.onSubmit).toBeDefined()
      expect(typeof composableResult.form.options.onSubmit).toBe('function')
    })

    BddTest().then('it should validate form before submission', () => {
      const validFormData = {
        file: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
        traceName: 'My Trace Name',
        personalNote: 'Optional note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }
      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()
      const validationResult = onSubmitValidator!({ value: validFormData })
      expect(validationResult?.fields?.file).toBeUndefined()
      expect(validationResult?.fields?.traceName).toBeUndefined()
    })

    BddTest().then('it should validate required fields before submission', () => {
      const invalidFormData = {
        file: null,
        traceName: '',
        personalNote: 'Optional note',
        isAuthentic: false,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: invalidFormData })
      expect(validationResult?.fields?.file).toEqual('Ce champ est requis.')
      expect(validationResult?.fields?.traceName).toEqual('Ce champ est requis.')
      expect(validationResult?.fields?.isAuthentic).toEqual('Vous devez accepter de soumettre une production authentique et personnelle')
    })

    BddTest().then('it should call both createTrace and uploadAttachment APIs when file is provided', async () => {
      const mockFile = new File(['text content'], 'test.txt', { type: 'text/plain' })
      const formData = {
        file: mockFile,
        traceName: 'my-trace-name',
        personalNote: 'Optional note',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      const onSubmit = composableResult.form.options.onSubmit
      expect(onSubmit).toBeDefined()
      onSubmit!({ value: formData, formApi: composableResult.form, meta: {} })

      await waitFor(() => {
        expect(createTraceSpy).toHaveBeenCalledWith({
          title: 'my-trace-name',
          language: ELanguage.FRENCH,
          personalNote: 'Optional note',
          isGroup: false,
          iaJustification: undefined
        })
      })
      expect(uploadAttachmentSpy).toHaveBeenCalledWith(
        expect.stringContaining('trace-my-trace-name'),
        { file: mockFile }
      )
    })

    BddTest().then('it should handle form submission without personalNote', async () => {
      const formData = {
        file: null,
        traceName: 'my-trace-name',
        personalNote: '',
        isAuthentic: true,
        isGroup: false,
        useIA: false,
        iaJustification: ''
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })

      await waitFor(() => {
        expect(createTraceSpy).toHaveBeenCalledWith({
          title: 'my-trace-name',
          language: ELanguage.FRENCH,
          personalNote: undefined,
          isGroup: false,
          iaJustification: undefined
        })
      })
    })

    BddTest().then('it should handle form submission with IA usage and justification', async () => {
      const formData = {
        file: null,
        traceName: 'my-trace-name',
        personalNote: '',
        isAuthentic: true,
        isGroup: true,
        useIA: true,
        iaJustification: 'Used AI for research assistance'
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })

      await waitFor(() => {
        expect(createTraceSpy).toHaveBeenCalledWith({
          title: 'my-trace-name',
          language: ELanguage.FRENCH,
          personalNote: undefined,
          isGroup: true,
          iaJustification: 'Used AI for research assistance'
        })
      })
    })

    BddTest().then('it should validate IA justification when IA is enabled', () => {
      const formDataWithoutJustification = {
        file: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
        traceName: 'my-trace-name',
        personalNote: '',
        isAuthentic: true,
        isGroup: false,
        useIA: true,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: formDataWithoutJustification })
      expect(validationResult?.fields?.iaJustification).toEqual('Ce champ est requis.')
    })
  })
})
