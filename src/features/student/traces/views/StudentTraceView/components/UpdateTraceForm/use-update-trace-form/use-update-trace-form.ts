import type { BaseApiException } from '@/common/exceptions'
import { ELanguage, type TraceDetailDTO } from '@/api/avenir-esr'
import { type TraceFormData, useTraceAttachmentFile, useTraceFileValidation, useTracesStore } from '@/features/student/traces'
import { useUpdateTraceMutation, useUploadAttachmentMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useUpdateTraceForm (trace: TraceDetailDTO, onTraceUpdated?: () => void) {
  const { t } = useI18n()

  const { addErrorMessage } = useToasterStore()
  const { setUpdateTraceForm, setUpdateTraceFormModified } = useTracesStore()
  const { validateFile } = useTraceFileValidation()
  const { attachmentFile } = useTraceAttachmentFile(trace.attachment)

  const onUpdateTraceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentTraceView.updateTraceModal.errors.updateTrace'),
      description: error.message
    })
  }

  const updateTraceMutation = useUpdateTraceMutation({
    onError: onUpdateTraceError
  })

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentTraceView.updateTraceModal.errors.fileUpload'),
      description: error.message
    })
  }

  const uploadAttachmentMutation = useUploadAttachmentMutation({
    onError: onUploadAttachmentError
  })

  const form = useForm({
    defaultValues: {
      file: attachmentFile.value,
      traceName: trace.title,
      personalNote: trace.personalNote || '',
      isAuthentic: true,
      isGroup: trace.isGroup,
      useIA: !!trace.aiUseJustification,
      iaJustification: trace.aiUseJustification || ''
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            file: validateFile(value.file),
            isAuthentic: !value.isAuthentic ? t('student.traces.traceAuthenticDeclarationToggle.requiredMessage') : undefined,
            traceName: !value.traceName.trim() ? t('global.error.form.requiredFiled') : undefined,
            iaJustification: value.useIA && (!value.iaJustification || !value.iaJustification.trim()) ? t('global.error.form.requiredFiled') : undefined,
          }
        }
      },
      onChange ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            file: validateFile(value.file),
          }
        }
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
        isGroup: traceFormData.isGroup,
        iaJustification: traceFormData.useIA ? traceFormData.iaJustification : undefined,
        language: ELanguage.FRENCH
      }
    }, {
      onSuccess: () => mutateFile(traceFormData.file, trace.id)
    })
  }

  const isModified = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isDirty
  })

  watch(() => form, () => {
    setUpdateTraceForm(form)
  }, { immediate: true })

  watch(() => isModified.value, (modified) => {
    setUpdateTraceFormModified(modified)
  }, { immediate: true })

  return {
    form
  }
}
