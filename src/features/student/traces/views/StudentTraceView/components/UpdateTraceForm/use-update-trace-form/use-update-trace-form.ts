import type { BaseApiException } from '@/common/exceptions'
import type { TraceFormData } from '@/features/student/traces/types/traces.types'
import { ELanguage, type TraceDetailDTO } from '@/api/avenir-esr'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTraceAttachmentFile, useTraceFileValidation } from '@/features/student/traces/composables/use-trace-file/use-trace-file'
import { TRACE_LINK_MAX_LENGTH, TRACE_NAME_MAX_LENGTH, TRACE_PERSONAL_NOTE_MAX_LENGTH } from '@/features/student/traces/config'
import { useUpdateTraceMutation, useUploadAttachmentMutation } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { isTraceFileType, isTraceLinkType } from '@/features/student/traces/utils/trace.types-guard'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useUpdateTraceForm (trace: TraceDetailDTO, onTraceUpdated?: () => void) {
  const { t } = useI18n()

  const { addErrorMessage } = useToasterStore()
  const { setUpdateTraceForm, setUpdateTraceFormModified } = useTracesStore()
  const { validateMaxLength } = useFormValidators()
  const { validateFile } = useTraceFileValidation()
  const { attachmentFile } = useTraceAttachmentFile(trace.attachment)

  const onUpdateTraceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.traces.views.StudentTraceView.updateTraceModal.errors.updateTrace'),
      description: error.message
    })
  }

  const updateTraceMutation = useUpdateTraceMutation({
    onError: onUpdateTraceError
  })

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.traces.views.StudentTraceView.updateTraceModal.errors.fileUpload'),
      description: error.message
    })
  }

  const uploadAttachmentMutation = useUploadAttachmentMutation({
    onError: onUploadAttachmentError
  })

  const form = useForm({
    defaultValues: {
      file: attachmentFile.value,
      traceType: TraceType.FILE,
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
            file: isTraceFileType(value) ? validateFile(value.file) : undefined,
            isAuthentic: !value.isAuthentic ? t('student.traces.interactions.toggles.TraceAuthenticDeclarationToggle.requiredMessage') : undefined,
            traceName: !value.traceName.trim() ? t('global.error.form.requiredField') : undefined,
            iaJustification: value.useIA && (!value.iaJustification || !value.iaJustification.trim()) ? t('global.error.form.requiredField') : undefined,
          }
        }
      },
      onChange ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            traceName: validateMaxLength(value.traceName, TRACE_NAME_MAX_LENGTH),
            personalNote: validateMaxLength(value.personalNote, TRACE_PERSONAL_NOTE_MAX_LENGTH),
            link: isTraceLinkType(value) ? validateMaxLength(value.link, TRACE_LINK_MAX_LENGTH) : undefined,
            file: isTraceFileType(value) ? validateFile(value.file) : undefined,
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

  watch(() => form, () => {
    setUpdateTraceForm(form)
  }, { immediate: true })

  watch(() => isModified.value, (modified) => {
    setUpdateTraceFormModified(modified)
  }, { immediate: true })

  return {
    form,
    isFormValid
  }
}
