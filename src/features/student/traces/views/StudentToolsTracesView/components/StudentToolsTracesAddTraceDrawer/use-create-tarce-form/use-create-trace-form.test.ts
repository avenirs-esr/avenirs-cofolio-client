import type { AssociationSelections } from '@/features/student/associations'
import { associateErrorHandler, createAssociateHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType, ETraceAuthorType } from '@/api/avenir-esr'
import { type TraceFormData, TraceType } from '@/features/student/traces/types/traces.types'
import { useCreateTraceForm } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { waitFor } from 'storybook/test'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

interface AssociationRequest {
  contextType: EAssociationContextType
  elementId: string
  associatedContextType: EAssociationContextType
  idsToAssociate: string[]
}

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('the useCreateTraceForm composable', () => {
  let composableResult: ReturnType<typeof useCreateTraceForm>
  const mockOnTraceCreated = vi.fn()

  beforeEach(() => {
    const result = mountComposable(() => useCreateTraceForm(mockOnTraceCreated), {
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

    BddTest().then('it should return isFormValid as false initially', () => {
      expect(composableResult.isFormValid).toBeDefined()
      expect(composableResult.isFormValid.value).toBe(false)
    })
  })

  BddTest().when('form is validated with invalid data', () => {
    BddTest().then('it should return validation errors', () => {
      const invalidData: TraceFormData = {
        file: null as unknown as File,
        traceType: TraceType.FILE,
        traceName: '',
        personalNote: '',
        authorType: null,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: invalidData })

      expect(validationResult?.fields?.file).toEqual('Ce champ est requis.')
      expect(validationResult?.fields?.traceName).toContain('Ce champ est requis.')
      expect(validationResult?.fields?.authorType).toEqual('Ce champ est requis.')
    })
  })

  BddTest().when('form is validated with valid data', () => {
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
      const validFormData: TraceFormData = {
        file: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
        traceType: TraceType.FILE,
        traceName: 'My Trace Name',
        personalNote: 'Optional note',
        authorType: ETraceAuthorType.COLLECTIVE,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }
      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()
      const validationResult = onSubmitValidator!({ value: validFormData })
      expect(validationResult?.fields?.file).toBeUndefined()
      expect(validationResult?.fields?.traceName).toBeUndefined()
    })

    BddTest().then('it should validate required fields before submission', () => {
      const invalidFormData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: '',
        personalNote: 'Optional note',
        authorType: null,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: invalidFormData })
      expect(validationResult?.fields?.file).toEqual('Ce champ est requis.')
      expect(validationResult?.fields?.traceName).toEqual('Ce champ est requis.')
      expect(validationResult?.fields?.authorType).toEqual('Ce champ est requis.')
    })

    BddTest().then('it should call onTraceCreated', async () => {
      const mockFile = new File(['text content'], 'test.txt', { type: 'text/plain' })
      const formData: TraceFormData = {
        file: mockFile,
        traceType: TraceType.FILE,
        traceName: 'my-trace-name',
        personalNote: 'Optional note',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmit = composableResult.form.options.onSubmit
      expect(onSubmit).toBeDefined()
      onSubmit!({ value: formData, formApi: composableResult.form, meta: {} })
      await flushPromises()

      await vi.waitFor(() => {
        expect(mockOnTraceCreated).toHaveBeenCalled()
      })
    })

    BddTest().then('it should handle form submission without personalNote', async () => {
      const formData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'my-trace-name',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })
      await flushPromises()

      expect(mockOnTraceCreated).toHaveBeenCalled()
    })

    BddTest().then('it should handle form submission with IA usage and justification', async () => {
      const formData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'my-trace-name',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: true,
        valorized: false,
        iaJustification: 'Used AI for research assistance'
      }

      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })
      await flushPromises()

      expect(mockOnTraceCreated).toHaveBeenCalled()
    })

    BddTest().then('it should validate IA justification when IA is enabled', () => {
      const formDataWithoutJustification: TraceFormData = {
        file: new File(['test'], 'test.pdf', { type: 'application/pdf' }),
        traceType: TraceType.FILE,
        traceName: 'my-trace-name',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: true,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      expect(onSubmitValidator).toBeDefined()

      const validationResult = onSubmitValidator!({ value: formDataWithoutJustification })
      expect(validationResult?.fields?.iaJustification).toEqual('Ce champ est requis.')
    })

    BddTest().then('it should require link when traceType is LINK and link is empty', () => {
      const formData: TraceFormData = {
        link: '',
        traceType: TraceType.LINK,
        traceName: 'my-trace-name',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      const validationResult = onSubmitValidator!({ value: formData })

      expect(validationResult?.fields?.link).toEqual('Ce champ est requis.')
    })

    BddTest().then('it should not require link when traceType is FILE', () => {
      const formData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'my-trace-name',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      const onSubmitValidator = composableResult.form.options.validators?.onSubmit
      const validationResult = onSubmitValidator!({ value: formData })

      expect(validationResult?.fields?.link).toBeUndefined()
    })

    BddTest().then('it should call onTraceCreated when no file is provided', async () => {
      const result = mountComposable(() => useCreateTraceForm(mockOnTraceCreated), {
        useI18n: true,
        useTanstack: true,
        usePinia: true
      })

      const formData: TraceFormData = {
        file: null,
        traceType: TraceType.FILE,
        traceName: 'my-trace-name',
        personalNote: '',
        authorType: ETraceAuthorType.PERSONAL,
        useIA: false,
        valorized: false,
        iaJustification: ''
      }

      result.result.form.options.onSubmit?.({ value: formData, formApi: result.result.form, meta: {} })
      await waitFor(() => {
        expect(mockOnTraceCreated).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('form is submitted with association selections', () => {
    const associationRequests: AssociationRequest[] = []
    const traceIdMatcher = expect.stringMatching(/^trace-my-trace-name-/)

    const createFormDataWithSelections = (associationSelections?: AssociationSelections): TraceFormData => ({
      file: null,
      traceType: TraceType.FILE,
      traceName: 'my-trace-name',
      personalNote: '',
      authorType: ETraceAuthorType.PERSONAL,
      useIA: false,
      valorized: false,
      iaJustification: '',
      associationSelections
    })

    const submitForm = (formData: TraceFormData) => {
      composableResult.form.options.onSubmit?.({ value: formData, formApi: composableResult.form, meta: {} })
    }

    beforeEach(() => {
      associationRequests.length = 0
      server.use(createAssociateHandler(({ contextType, elementId, associatedContextType }, { idsToAssociate }) => {
        associationRequests.push({ contextType, elementId, associatedContextType, idsToAssociate })
      }))
    })

    BddTest().and('activities are selected', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections({
          [EAssociationContextType.DECLARED_ACTIVITY]: [
            { id: 'activity-1', title: 'Activity 1' },
            { id: 'activity-2', title: 'Activity 2' }
          ]
        }))
      })

      BddTest().then('it should associate the selected activities with the created trace in one request', async () => {
        await vi.waitFor(() => {
          expect(associationRequests).toStrictEqual([{
            contextType: EAssociationContextType.TRACE,
            elementId: traceIdMatcher,
            associatedContextType: EAssociationContextType.DECLARED_ACTIVITY,
            idsToAssociate: ['activity-1', 'activity-2']
          }])
        })
      })

      BddTest().then('it should call onTraceCreated without error message', async () => {
        await vi.waitFor(() => {
          expect(associationRequests).toHaveLength(1)
        })
        await flushPromises()

        expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    BddTest().and('declared skills are selected', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections({
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }]
        }))
      })

      BddTest().then('it should associate the selected declared skills with the created trace', async () => {
        await vi.waitFor(() => {
          expect(associationRequests).toStrictEqual([{
            contextType: EAssociationContextType.TRACE,
            elementId: traceIdMatcher,
            associatedContextType: EAssociationContextType.DECLARED_SKILL,
            idsToAssociate: ['skill-1']
          }])
        })
        expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('declared programs are selected', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections({
          [EAssociationContextType.DECLARED_PROGRAM]: [{ id: 'program-1', title: 'Program 1' }]
        }))
      })

      BddTest().then('it should associate the selected declared programs with the created trace', async () => {
        await vi.waitFor(() => {
          expect(associationRequests).toStrictEqual([{
            contextType: EAssociationContextType.TRACE,
            elementId: traceIdMatcher,
            associatedContextType: EAssociationContextType.DECLARED_PROGRAM,
            idsToAssociate: ['program-1']
          }])
        })
        expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('both declared skills and activities are selected', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections({
          [EAssociationContextType.DECLARED_ACTIVITY]: [{ id: 'activity-1', title: 'Activity 1' }],
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }]
        }))
      })

      BddTest().then('it should send one association request per selected context type', async () => {
        await vi.waitFor(() => {
          expect(associationRequests).toHaveLength(2)
        })

        expect(associationRequests).toEqual(expect.arrayContaining([
          {
            contextType: EAssociationContextType.TRACE,
            elementId: traceIdMatcher,
            associatedContextType: EAssociationContextType.DECLARED_ACTIVITY,
            idsToAssociate: ['activity-1']
          },
          {
            contextType: EAssociationContextType.TRACE,
            elementId: traceIdMatcher,
            associatedContextType: EAssociationContextType.DECLARED_SKILL,
            idsToAssociate: ['skill-1']
          }
        ]))
        expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('a context type has an empty selection', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections({
          [EAssociationContextType.DECLARED_ACTIVITY]: [],
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }]
        }))
      })

      BddTest().then('it should only associate the context types having selected elements', async () => {
        await vi.waitFor(() => {
          expect(associationRequests).toHaveLength(1)
        })
        await flushPromises()

        expect(associationRequests[0]!.associatedContextType).toBe(EAssociationContextType.DECLARED_SKILL)
        expect(associationRequests).toHaveLength(1)
      })
    })

    BddTest().and('selections are empty', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections({}))
      })

      BddTest().then('it should call onTraceCreated without associating anything', async () => {
        await vi.waitFor(() => {
          expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
        })
        await flushPromises()

        expect(associationRequests).toStrictEqual([])
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    BddTest().and('there are no selections', () => {
      beforeEach(() => {
        submitForm(createFormDataWithSelections())
      })

      BddTest().then('it should call onTraceCreated without associating anything', async () => {
        await vi.waitFor(() => {
          expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
        })
        await flushPromises()

        expect(associationRequests).toStrictEqual([])
        expect(mockAddErrorMessage).not.toHaveBeenCalled()
      })
    })

    BddTest().and('the associations fail', () => {
      beforeEach(() => {
        server.use(associateErrorHandler)
        submitForm(createFormDataWithSelections({
          [EAssociationContextType.DECLARED_ACTIVITY]: [{ id: 'activity-1', title: 'Activity 1' }],
          [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }]
        }))
      })

      BddTest().then('it should display the association error message only once', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalled()
        })
        await flushPromises()

        expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
        expect(mockAddErrorMessage).toHaveBeenCalledWith({
          title: 'Une erreur est survenue lors de l\'association',
          description: 'Votre trace a été créée, vous pouvez réessayer d\'associer votre trace dans la page de détails de votre trace.'
        })
      })

      BddTest().then('it should still call onTraceCreated', async () => {
        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalled()
        })

        expect(mockOnTraceCreated).toHaveBeenCalledTimes(1)
      })
    })
  })
})
