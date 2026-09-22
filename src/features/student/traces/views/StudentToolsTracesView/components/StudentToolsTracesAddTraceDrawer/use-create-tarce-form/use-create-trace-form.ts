import type { BaseApiException } from '@/common/exceptions'
import type { ComputedRef } from 'vue'
import { EAssociationContextType, ELanguage, invalidateGetTracesSummary, invalidateTracesView, useCreateTrace, useUploadAttachment } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssociationSelections } from '@/features/student/associations'
import { useTraceFormValidators } from '@/features/student/traces/composables/use-trace-form-validators/use-trace-form-validators'
import { type TraceFormData, TraceType } from '@/features/student/traces/types/traces.types'
import { isTraceFileType, isTraceLinkType } from '@/features/student/traces/utils/trace.types-guard'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useCreateTraceForm (onTraceCreated?: () => void) {
  const { t } = useI18n()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const queryClient = useQueryClient()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { buildValidators } = useTraceFormValidators()
  const { hasFieldErrors } = useFormValidators()

  function onCreateTraceError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.createTrace'),
      description: getErrorMessage(error)
    })
  }

  const { mutate: createTrace, isPending: isPendingCreateTrace } = useCreateTrace({
    mutation: {
      onError: onCreateTraceError,
      onSuccess: async () => {
        await withTaskLoading(() => Promise.all([
          invalidateTracesView(queryClient, {}),
          invalidateGetTracesSummary(queryClient),
        ]))
      }
    }
  })

  function onUploadAttachmentError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  const { mutateAsync: uploadFile, isPending: isPendingUploadFile } = useUploadAttachment({
    mutation: {
      onError: onUploadAttachmentError,
      onSuccess: async () => {
        await withTaskLoading(() => Promise.all([
          invalidateTracesView(queryClient, {}),
          invalidateGetTracesSummary(queryClient),
        ]))
      }
    }
  })

  function onAssociationError () {
    addErrorMessage({
      title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.association.title'),
      description: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.association.description')
    })
  }

  const { associateSelections, isAssociating } = useAssociationSelections(EAssociationContextType.TRACE)

  const isFileUploading = ref(false)

  async function finalizeTraceCreation (traceId: string, traceFormData: TraceFormData) {
    if (isTraceFileType(traceFormData) && traceFormData.file) {
      await uploadFile({
        traceId,
        data: { file: traceFormData.file }
      })
    }

    onTraceCreated?.()

    const results = await associateSelections(traceId, traceFormData.associationSelections)

    if (results.some(({ status }) => status === 'rejected')) {
      onAssociationError()
    }
  }

  const form = useForm({
    defaultValues: {
      file: null,
      traceType: TraceType.FILE,
      traceName: '',
      personalNote: '',
      authorType: null,
      useIA: false,
      iaJustification: '',
      associationSelections: {}
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return buildValidators(value)
      },
      onChange ({ value }: { value: TraceFormData }) {
        return buildValidators(value)
      }
    },
    onSubmit: ({ value }: { value: TraceFormData }) => {
      createTrace({
        data: {
          title: value.traceName,
          personalNote: value.personalNote || undefined,
          authorType: value.authorType!,
          iaJustification: value.useIA ? value.iaJustification : undefined,
          language: ELanguage.FRENCH, // TODO
          link: isTraceLinkType(value) ? value.link : undefined,
        }
      }, {
        onSuccess: async (traceResult) => {
          const traceId = traceResult.traceId

          if (!traceId) {
            addErrorMessage({
              title: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.createTrace'),
              description: t('global.errors.generic')
            })
            return
          }

          await finalizeTraceCreation(traceId, value)
        }
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  const hasDefinitionItemsError = hasFieldErrors(form, ['traceName', 'personalNote', 'traceType', 'file', 'link'])
  const hasDeclarationItemsError = hasFieldErrors(form, ['authorType', 'useIA'])

  const isSubmitting: ComputedRef<boolean> = computed(() => {
    return isPendingCreateTrace.value
      || isPendingUploadFile.value
      || isAssociating.value
      || isFileUploading.value
      || isLoading.value
  })

  return {
    form,
    isFormValid,
    isSubmitting,
    hasDefinitionItemsError,
    hasDeclarationItemsError
  }
}
