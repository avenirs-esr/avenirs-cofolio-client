import type { BaseApiException } from '@/common/exceptions'
import type { TraceFormData } from '@/features/student/traces/types/traces.types'
import { EFileCategory, ELanguage, invalidateGetTraceDetail, invalidateTracesView, type TraceDetailDTO, useUpdateTrace, useUploadFile } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useTraceAttachmentFile } from '@/features/student/traces/composables/use-trace-file/use-trace-file'
import { useTraceFormValidators } from '@/features/student/traces/composables/use-trace-form-validators/use-trace-form-validators'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { isTraceFileType, isTraceLinkType } from '@/features/student/traces/utils/trace.types-guard'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useUpdateTraceForm (trace?: TraceDetailDTO, onTraceUpdated?: () => void) {
  const { t } = useI18n()
  const { withTaskLoading } = useTaskLoading()
  const queryClient = useQueryClient()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { setUpdateTraceForm, setUpdateTraceFormModified } = useTracesStore()
  const { buildValidators } = useTraceFormValidators()
  const { hasFieldErrors } = useFormValidators()
  const { attachmentFile } = useTraceAttachmentFile(trace?.attachment)

  const onUpdateTraceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.traces.views.StudentUpdateTraceView.errors.updateTrace'),
      description: getErrorMessage(error)
    })
  }

  const { mutate: updateTrace } = useUpdateTrace({
    mutation: {
      onError: onUpdateTraceError
    }
  })

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  const { mutateAsync: uploadFile } = useUploadFile({
    mutation: {
      onError: onUploadAttachmentError,
    }
  })

  const form = useForm({
    defaultValues: {
      file: attachmentFile.value,
      link: trace?.link || '',
      traceType: attachmentFile.value ? TraceType.FILE : TraceType.LINK,
      traceName: trace?.title,
      personalNote: trace?.personalNote || '',
      authorType: trace?.authorType,
      useIA: !!trace?.aiUseJustification,
      iaJustification: trace?.aiUseJustification || '',
      valorized: trace?.valorized ?? false
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return buildValidators(value)
      },
      onChange ({ value }: { value: TraceFormData }) {
        return buildValidators(value)
      }
    },
    onSubmit: async ({ value }: { value: TraceFormData }) => {
      if (!trace) {
        return
      }

      updateTrace({
        traceId: trace.id,
        data: {
          title: value.traceName,
          personalNote: value.personalNote || undefined,
          authorType: value.authorType!,
          iaJustification: value.useIA ? value.iaJustification : undefined,
          link: isTraceLinkType(value) ? value.link : undefined,
          language: ELanguage.FRENCH, // TODO
          valorized: value.valorized
        },
      }, {
        onSuccess: async () => {
          await withTaskLoading(() => Promise.all([
            invalidateTracesView(queryClient, {}),
            invalidateGetTraceDetail(queryClient, trace.id),
          ]))
          if (isTraceFileType(value)) {
            mutateFile(value.file, trace.id)
          }
          else {
            onTraceUpdated?.()
          }
        }
      })
    }
  })

  const fileField = form.useField({ name: 'file' })

  async function mutateFile (file: File | null, traceId: string) {
    const isNewFileLoaded = fileField.state.value.meta.isDirty

    if (!file || !isNewFileLoaded) {
      onTraceUpdated?.()
      return
    }

    uploadFile({
      fileCategory: EFileCategory.TRACE_ATTACHMENT,
      elementId: traceId,
      data: { file }
    }, {
      onSuccess: async () => {
        onTraceUpdated?.()
      }
    })
  }

  const isModified = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty && state.value.isValid && !state.value.isValidating
  })

  const hasErrors = hasFieldErrors(form, ['file', 'link', 'traceName', 'personalNote', 'iaJustification', 'authorType'])

  watch(() => form, () => {
    setUpdateTraceForm(form)
  }, { immediate: true })

  watch(() => isModified.value, (modified) => {
    setUpdateTraceFormModified(modified)
  }, { immediate: true })

  return {
    form,
    isFormValid,
    hasErrors
  }
}
