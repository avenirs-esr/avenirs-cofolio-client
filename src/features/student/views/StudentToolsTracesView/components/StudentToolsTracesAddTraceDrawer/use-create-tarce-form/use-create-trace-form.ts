import type { BaseApiException } from '@/common/exceptions'
import type { TraceFormData } from '@/features/student/types'
import type { ComputedRef } from 'vue'
import { ELanguage } from '@/api/avenir-esr'
import { useTraceFileValidation } from '@/features/student/composables'
import { useCreateTraceMutation, useUploadAttachmentMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useCreateTraceForm (onTraceCreated?: () => void) {
  const { t } = useI18n()

  const { addErrorMessage } = useToasterStore()

  const onCreateTraceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.createTrace'),
      description: error.message
    })
  }

  const createTraceMutation = useCreateTraceMutation({ onError: onCreateTraceError })

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.fileUpload'),
      description: error.message
    })
  }

  const uploadAttachmentMutation = useUploadAttachmentMutation({ onError: onUploadAttachmentError })

  const isFileUploading = ref(false)

  const { validateFile } = useTraceFileValidation(true)

  function mutateFile (file: File | null, traceId: string) {
    if (!file) {
      return
    }
    uploadAttachmentMutation.mutate({
      traceId,
      file
    }, {
      onSuccess: () => {
        onTraceCreated?.()
      }
    })
  }

  function createTrace (traceFormData: TraceFormData) {
    createTraceMutation.mutate({
      title: traceFormData.traceName,
      personalNote: traceFormData.personalNote || undefined,
      isGroup: traceFormData.isGroup,
      iaJustification: traceFormData.useIA ? traceFormData.iaJustification : undefined,
      language: ELanguage.FRENCH
    }, {
      onSuccess: (traceResult) => {
        mutateFile(traceFormData.file, traceResult.traceId)
      }
    })
  }

  const form = useForm({
    defaultValues: {
      file: null,
      traceName: '',
      personalNote: '',
      isAuthentic: false,
      isGroup: false,
      useIA: false,
      iaJustification: ''
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            file: validateFile(value.file),
            traceName: !value.traceName.trim() ? t('global.error.form.requiredFiled') : undefined,
            isAuthentic: !value.isAuthentic ? t('student.traces.traceAuthenticDeclarationToggle.requiredMessage') : undefined,
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
    onSubmit: ({ value }: { value: TraceFormData }) => {
      createTrace(value)
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating
  })

  const isSubmitting: ComputedRef<boolean> = computed(() => {
    return createTraceMutation.isPending.value || uploadAttachmentMutation.isPending.value || isFileUploading.value
  })

  return {
    form,
    isFormValid,
    isSubmitting
  }
}
