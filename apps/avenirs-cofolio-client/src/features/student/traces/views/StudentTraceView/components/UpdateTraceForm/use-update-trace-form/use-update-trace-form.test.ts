import type { TraceDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { TraceFormData, TraceFormDataLink } from '@/features/student/traces/types/traces.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ETraceAuthorType } from '@avenirs-esr/shared/api/avenir-esr'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { invalidTraceId } from '@/__mocks__/fixtures/student/traces.fixtures'
import { updateTraceErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'

const mockAddErrorMessage = vi.fn()
const mockSetUpdateTraceForm = vi.fn()
const mockSetUpdateTraceFormModified = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()

  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

vi.mock('@/features/student/traces/stores/traces.store', () => ({
  useTracesStore: () => ({
    setUpdateTraceForm: mockSetUpdateTraceForm,
    setUpdateTraceFormModified: mockSetUpdateTraceFormModified
  })
}))

BddTest().given('the useUpdateTraceForm composable', () => {
  let composableResult: ReturnType<typeof useUpdateTraceForm>

  const mockOnTraceUpdated = vi.fn()

  const trace: TraceDetailDTO = {
    id: 'trace-id',
    title: 'My trace',
    personalNote: 'My note',
    authorType: ETraceAuthorType.PERSONAL,
    aiUseJustification: '',
    link: '',
    valorized: false,
    attachment: undefined
  } as TraceDetailDTO

  beforeEach(() => {
    const { result } = mountComposable(
      () => useUpdateTraceForm(trace, mockOnTraceUpdated),
      {
        useTanstack: true,
        useI18n: true,
        usePinia: true
      }
    )

    composableResult = result
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should return a form instance', () => {
      expect(composableResult.form).toBeDefined()
      expect(typeof composableResult.form.useStore).toBe('function')
    })

    BddTest().then('it should expose isFormValid initialized to false', () => {
      expect(composableResult.isFormValid.value).toBe(false)
    })

    BddTest().then('it should initialize default values from trace', () => {
      const values = composableResult.form.state.values

      expect(values.traceName).toBe('My trace')
      expect(values.personalNote).toBe('My note')
      expect(values.authorType).toBe(ETraceAuthorType.PERSONAL)
      expect(values.traceType).toBe(TraceType.LINK)
      expect((values as TraceFormDataLink).link).toBe('')
      expect(values.useIA).toBe(false)
      expect(values.valorized).toBe(false)
      expect(values.iaJustification).toBe('')
    })

    BddTest().then('it should register the form inside the store', () => {
      expect(mockSetUpdateTraceForm).toHaveBeenCalled()
    })

    BddTest().then('it should initialize modified flag to false', () => {
      expect(mockSetUpdateTraceFormModified).toHaveBeenCalledWith(false)
    })

    BddTest().then('it should have onChange and onSubmit validators defined', () => {
      const validators = composableResult.form.options.validators
      expect(validators).toBeDefined()
      expect(typeof validators?.onChange).toBe('function')
      expect(typeof validators?.onSubmit).toBe('function')
    })
  })

  BddTest().when('the form is validated onChange with valid data', () => {
    BddTest().then('it should return no validation errors', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const validData: TraceFormData = {
        file: mockFile,
        traceType: TraceType.FILE,
        traceName: 'My Trace Name',
        personalNote: 'Optional note',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onChangeValidator = composableResult.form.options.validators?.onChange
      expect(onChangeValidator).toBeDefined()

      const validationResult = onChangeValidator!({ value: validData, formApi: composableResult.form })

      expect(validationResult?.fields?.file).toBeUndefined()
      expect(validationResult?.fields?.traceName).toBeUndefined()
      expect(validationResult?.fields?.authorType).toBeUndefined()
    })
  })

  BddTest().when('the form is validated onChange with invalid data', () => {
    BddTest().then('it should return validation errors', () => {
      const invalidData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'My Trace Name',
        personalNote: '',
        authorType: null,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onChangeValidator = composableResult.form.options.validators?.onChange
      expect(onChangeValidator).toBeDefined()

      const validationResult = onChangeValidator!({ value: invalidData, formApi: composableResult.form })

      expect(validationResult?.fields?.authorType).toBeDefined()
    })
  })

  BddTest().when('the form is validated onSubmit with valid data', () => {
    BddTest().then('it should return no validation errors', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const validData: TraceFormData = {
        file: mockFile,
        traceType: TraceType.FILE,
        traceName: 'My Trace Name',
        personalNote: 'Optional note',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: validData, formApi: composableResult.form })

      expect(validationResult?.fields?.file).toBeUndefined()
      expect(validationResult?.fields?.traceName).toBeUndefined()
      expect(validationResult?.fields?.authorType).toBeUndefined()
    })
  })

  BddTest().when('the form is validated onSubmit with invalid data', () => {
    BddTest().then('it should return validation errors', () => {
      const invalidData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'My Trace Name',
        personalNote: '',
        authorType: null,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: invalidData, formApi: composableResult.form })

      expect(validationResult?.fields?.authorType).toBeDefined()
    })
  })

  BddTest().when('form is validated with valid file data', () => {
    BddTest().then('it should not return validation errors', () => {
      const validData: TraceFormData = {
        file: new File(['test content'], 'test.pdf', { type: 'application/pdf' }),
        traceType: TraceType.FILE,
        traceName: 'Updated trace',
        personalNote: 'note',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const validator = composableResult.form.options.validators?.onSubmit

      const result = validator!({ value: validData, formApi: composableResult.form })

      expect(result?.fields?.file).toBeUndefined()
      expect(result?.fields?.traceName).toBeUndefined()
      expect(result?.fields?.authorType).toBeUndefined()
    })
  })

  BddTest().when('form is validated with a link trace', () => {
    BddTest().then('it should require a link', () => {
      const data: TraceFormData = {
        link: '',
        traceType: TraceType.LINK,
        traceName: 'Trace',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const validator = composableResult.form.options.validators?.onSubmit

      const result = validator!({ value: data, formApi: composableResult.form })

      expect(result?.fields?.link).toEqual('Ce champ est requis.')
    })

    BddTest().then('it should validate a correct link', () => {
      const data: TraceFormData = {
        link: 'https://example.com',
        traceType: TraceType.LINK,
        traceName: 'Trace',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const validator = composableResult.form.options.validators?.onSubmit

      const result = validator!({ value: data, formApi: composableResult.form })

      expect(result?.fields?.link).toBeUndefined()
    })
  })

  BddTest().when('IA is enabled', () => {
    BddTest().then('it should require a justification', () => {
      const data: TraceFormData = {
        file: new File(['a'], 'a.pdf'),
        traceType: TraceType.FILE,
        traceName: 'Trace',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: true,
        valorized: false,
        iaJustification: ''
      }

      const validator = composableResult.form.options.validators?.onSubmit

      const result = validator!({ value: data, formApi: composableResult.form })

      expect(result?.fields?.iaJustification).toEqual('Ce champ est requis.')
    })
  })

  BddTest().when('form is submitted', () => {
    BddTest().then('it should expose an onSubmit handler', () => {
      expect(composableResult.form.options.onSubmit).toBeDefined()
      expect(typeof composableResult.form.options.onSubmit).toBe('function')
    })

    BddTest().then('it should submit a file trace', async () => {
      const formData: TraceFormData = {
        file: new File(['content'], 'trace.pdf', { type: 'application/pdf' }),
        traceType: TraceType.FILE,
        traceName: 'Updated trace',
        personalNote: 'Updated note',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      await composableResult.form.options.onSubmit?.({
        value: formData,
        formApi: composableResult.form,
        meta: {}
      })
    })

    BddTest().then('it should submit a link trace', async () => {
      const formData: TraceFormData = {
        link: 'https://example.com',
        traceType: TraceType.LINK,
        traceName: 'Updated trace',
        personalNote: '',
        authorType: ETraceAuthorType.COLLECTIVE,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      await composableResult.form.options.onSubmit?.({
        value: formData,
        formApi: composableResult.form,
        meta: {}
      })
    })

    BddTest().then('it should submit with IA justification', async () => {
      const formData: TraceFormData = {
        file: new File(['content'], 'trace.pdf'),
        traceType: TraceType.FILE,
        traceName: 'Updated trace',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: true,
        valorized: false,
        iaJustification: 'Generated with AI'
      }

      await composableResult.form.options.onSubmit?.({
        value: formData,
        formApi: composableResult.form,
        meta: {}
      })
    })

    BddTest().then('it should submit without a personal note', async () => {
      const formData: TraceFormData = {
        file: new File(['content'], 'trace.pdf'),
        traceType: TraceType.FILE,
        traceName: 'Updated trace',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      await composableResult.form.options.onSubmit?.({
        value: formData,
        formApi: composableResult.form,
        meta: {}
      })
    })

    BddTest().then('it should do nothing when no trace is provided', async () => {
      const { result } = mountComposable(
        () => useUpdateTraceForm(undefined, mockOnTraceUpdated),
        {
          useTanstack: true,
          usePinia: true,
          useI18n: true
        }
      )

      const formData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'Updated trace',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      await result.form.options.onSubmit?.({
        value: formData,
        formApi: result.form,
        meta: {}
      })

      expect(mockOnTraceUpdated).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should keep validating after submit', () => {
      const validator = composableResult.form.options.validators?.onSubmit

      composableResult.form.setFieldMeta('traceName', meta => ({ ...meta, isTouched: true }))
      const result = validator?.({
        value: {
          file: null,
          traceType: TraceType.FILE,
          traceName: '',
          personalNote: '',
          authorType: null,
          useIA: false,
          valorized: false,
          iaJustification: ''
        },
        formApi: composableResult.form
      })

      expect(result?.fields?.traceName).toEqual('Ce champ est requis.')
      expect(result?.fields?.authorType).toEqual('Ce champ est requis.')
    })

    BddTest().then('it should validate link traces correctly', () => {
      const validator = composableResult.form.options.validators?.onSubmit

      const result = validator?.({
        value: {
          link: '',
          traceType: TraceType.LINK,
          traceName: 'Trace',
          personalNote: '',
          authorType: ETraceAuthorType.PERSONAL,
          useIA: false,
          valorized: false,
          iaJustification: ''
        },
        formApi: composableResult.form
      })

      expect(result?.fields?.link).toEqual('Ce champ est requis.')
    })

    BddTest().then('it should validate IA justification', () => {
      const validator = composableResult.form.options.validators?.onSubmit

      const result = validator?.({
        value: {
          file: new File(['a'], 'a.pdf'),
          traceType: TraceType.FILE,
          traceName: 'Trace',
          personalNote: '',
          authorType: ETraceAuthorType.PERSONAL,
          useIA: true,
          valorized: false,
          iaJustification: ''
        },
        formApi: composableResult.form
      })

      expect(result?.fields?.iaJustification).toEqual('Ce champ est requis.')
    })
  })

  BddTest().when('the form is submitted with an invalid activity id', () => {
    beforeEach(async () => {
      server.use(updateTraceErrorHandler)
      const invalidTrace: TraceDetailDTO = { ...trace, id: invalidTraceId }

      const { result } = mountComposable(
        () => useUpdateTraceForm(invalidTrace, mockOnTraceUpdated),
        {
          useTanstack: true,
          useI18n: true,
          usePinia: true
        }
      )

      composableResult = result

      await flushPromises()
    })

    BddTest().then('it should show an error message', async () => {
      const formData: TraceFormData = {
        file: new File(['content'], 'trace.pdf', { type: 'application/pdf' }),
        traceType: TraceType.FILE,
        traceName: 'Updated trace',
        personalNote: 'Updated note',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      await composableResult.form.options.onSubmit?.({
        value: formData,
        formApi: composableResult.form,
        meta: {}
      })

      await flushPromises()

      expect(mockAddErrorMessage).toHaveBeenCalled()
    })
  })
})
