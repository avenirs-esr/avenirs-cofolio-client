import {
  type AttachmentUploadDTO,
  type CreateTraceDTO,
  CreateTraceDTOLanguage,
  type TracesCreationResponse,
  type UploadAttachmentBody
} from '@/api/avenir-esr'
import * as avenirEsrApi from '@/api/avenir-esr'
import { mountComposable } from '@/ui/tests/utils'
import { type MockInstance, vi } from 'vitest'
import { useCreateTraceForm } from './use-create-trace-form'

describe('useCreateTraceForm', () => {
  describe('given the useCreateTraceForm composable', () => {
    let composableResult: ReturnType<typeof useCreateTraceForm>
    let createTraceSpy: MockInstance<(createTraceDTO: CreateTraceDTO, options?: RequestInit | undefined) => Promise<TracesCreationResponse>>
    let uploadAttachmentSpy: MockInstance<(traceId: string, uploadAttachmentBody: UploadAttachmentBody, options?: RequestInit | undefined) => Promise<AttachmentUploadDTO>>

    beforeEach(() => {
      createTraceSpy = vi.spyOn(avenirEsrApi, 'createTrace')
      uploadAttachmentSpy = vi.spyOn(avenirEsrApi, 'uploadAttachment')

      const result = mountComposable(() => useCreateTraceForm(), {
        useI18n: true,
        useTanstack: true
      })
      composableResult = result.result
    })

    afterEach(() => {
      vi.clearAllMocks()
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

        expect(validationResult?.fields?.file).toContain('requis')
        expect(validationResult?.fields?.traceName).toContain('requis')
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
      it('then it should have onSubmit function defined', () => {
        expect(composableResult.form.options.onSubmit).toBeDefined()
        expect(typeof composableResult.form.options.onSubmit).toBe('function')
      })

      it('then it should validate form before submission', () => {
        const validFormData = {
          file: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
          traceName: 'My Trace Name',
          personalNote: 'Optional note'
        }
        const onSubmit = composableResult.form.options.validators?.onSubmit
        expect(onSubmit).toBeDefined()
        const validationResult = onSubmit!({ value: validFormData })
        expect(validationResult?.fields?.file).toBeUndefined()
        expect(validationResult?.fields?.traceName).toBeUndefined()
      })

      it('then it should validate required fields before submission', () => {
        const invalidFormData = {
          file: null,
          traceName: '',
          personalNote: 'Optional note'
        }

        const onSubmit = composableResult.form.options.validators?.onSubmit
        expect(onSubmit).toBeDefined()

        const validationResult = onSubmit!({ value: invalidFormData })
        expect(validationResult?.fields?.file).toContain('requis')
        expect(validationResult?.fields?.traceName).toContain('requis')
      })

      it('then it should call createTrace API with correct arguments', async () => {
        const formData = {
          file: null,
          traceName: 'My Trace Name',
          personalNote: 'Optional note'
        }

        const onSubmit = composableResult.form.options.onSubmit
        expect(onSubmit).toBeDefined()
        await onSubmit!({ value: formData, formApi: composableResult.form, meta: {} })

        expect(createTraceSpy).toHaveBeenCalledWith({
          title: 'My Trace Name',
          language: CreateTraceDTOLanguage.FRENCH,
          personalNote: 'Optional note',
          isGroup: false
        })
        expect(uploadAttachmentSpy).not.toHaveBeenCalled()
      })

      it('then it should call both createTrace and uploadAttachment APIs when file is provided', async () => {
        const mockFile = new File(['text content'], 'test.txt', { type: 'text/plain' })
        const formData = {
          file: mockFile,
          traceName: 'my-trace-name',
          personalNote: 'Optional note'
        }

        const onSubmit = composableResult.form.options.onSubmit
        expect(onSubmit).toBeDefined()
        await onSubmit!({ value: formData, formApi: composableResult.form, meta: {} })

        expect(createTraceSpy).toHaveBeenCalledWith({
          title: 'my-trace-name',
          language: CreateTraceDTOLanguage.FRENCH,
          personalNote: 'Optional note',
          isGroup: false
        })
        expect(uploadAttachmentSpy).toHaveBeenCalledWith(
          expect.stringContaining('trace-my-trace-name'),
          { file: mockFile }
        )
      })

      it('then it should handle form submission without personalNote', async () => {
        const formData = {
          file: null,
          traceName: 'my-trace-name',
          personalNote: ''
        }

        await composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })

        expect(createTraceSpy).toHaveBeenCalledWith({
          title: 'my-trace-name',
          language: CreateTraceDTOLanguage.FRENCH,
          personalNote: undefined,
          isGroup: false
        })
      })
    })
  })
})
