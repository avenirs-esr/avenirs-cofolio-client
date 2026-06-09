import type { BaseApiException } from '@/common/exceptions'
import type { TraceFormData } from '@/features/student/traces/types/traces.types'
import { ELanguage, type TraceDetailDTO } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTraceAttachmentFile } from '@/features/student/traces/composables/use-trace-file/use-trace-file'
import { useTraceFormValidators } from '@/features/student/traces/composables/use-trace-form-validators/use-trace-form-validators'
import { useUpdateTraceMutation, useUploadAttachmentMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { isTraceFileType, isTraceLinkType } from '@/features/student/traces/utils/trace.types-guard'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useUpdateTraceForm (trace: TraceDetailDTO, onTraceUpdated?: () => void) {
  const { t } = useI18n()

  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { setUpdateTraceForm, setUpdateTraceFormModified } = useTracesStore()
  const { buildValidators } = useTraceFormValidators()
  const { hasFieldErrors } = useFormValidators()
  const { attachmentFile } = useTraceAttachmentFile(trace.attachment)

  const onUpdateTraceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.traces.views.StudentUpdateTraceView.errors.updateTrace'),
      description: getErrorMessage(error)
    })
  }

  const updateTraceMutation = useUpdateTraceMutation({
    onError: onUpdateTraceError
  })

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.fileUpload'),
      description: getErrorMessage(error)
    })
  }

  const uploadAttachmentMutation = useUploadAttachmentMutation({
    onError: onUploadAttachmentError
  })

  const form = useForm({
    defaultValues: {
      file: attachmentFile.value,
      link: trace.link || '',
      traceType: attachmentFile.value ? TraceType.FILE : TraceType.LINK,
      traceName: trace.title,
      personalNote: trace.personalNote || '',
      authorType: trace.authorType,
      useIA: !!trace.aiUseJustification,
      iaJustification: trace.aiUseJustification || ''
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
      updateTrace(value)
    }
  })

  const fileField = form.useField({ name: 'file' })

  async function mutateFile (file: File | null, traceId: string) {
    const isNewFileLoaded = fileField.state.value.meta.isDirty

    if (!file || !isNewFileLoaded) {
      onTraceUpdated?.()
      return
    }

    uploadAttachmentMutation.mutate({ traceId, file }, {
      onSuccess: () => onTraceUpdated?.()
    })
  }

  function updateTrace (traceFormData: TraceFormData) {
    updateTraceMutation.mutate({
      traceId: trace.id,
      updateTraceDTO: {
        title: traceFormData.traceName,
        personalNote: traceFormData.personalNote || undefined,
        authorType: traceFormData.authorType!,
        iaJustification: traceFormData.useIA ? traceFormData.iaJustification : undefined,
        link: isTraceLinkType(traceFormData) ? traceFormData.link : undefined,
        language: ELanguage.FRENCH
      }
    }, {
      onSuccess: () => {
        if (isTraceFileType(traceFormData)) {
          mutateFile(traceFormData.file, trace.id)
        }
        else {
          onTraceUpdated?.()
        }
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
