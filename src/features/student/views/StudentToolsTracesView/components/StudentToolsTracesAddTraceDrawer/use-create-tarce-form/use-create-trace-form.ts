import type { BaseApiException } from '@/common/exceptions'
import { useFileValidation } from '@/common/composables'
import { useCreateTraceMutation, useUploadAttachmentMutation } from '@/features/student/queries'
import { TRACE_ACCEPTED_FILE_TYPES, type TraceFormData, } from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

const FIVE_MB = 5 * 1024 * 1024
const TEN_MB = 10 * 1024 * 1024

export function useCreateTraceForm () {
  const { t } = useI18n()

  const { addErrorMessage } = useToasterStore()

  const onCreateTraceError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.createTrace'),
      description: error.message
    })
  }

  const onUploadAttachmentError = (error: BaseApiException) => {
    addErrorMessage({
      title: t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.errors.fileUpload'),
      description: error.message
    })
  }

  const createTraceMutation = useCreateTraceMutation({ onError: onCreateTraceError })
  const uploadAttachmentMutation = useUploadAttachmentMutation({ onError: onUploadAttachmentError })

  const { validateFile } = useFileValidation({
    acceptedFileTypes: [...TRACE_ACCEPTED_FILE_TYPES],
    maxSizeConfig: {
      'image/*': FIVE_MB,
      'text/*': FIVE_MB,
      'audio/*': FIVE_MB,
      'video/*': TEN_MB,
      'application/*': TEN_MB,
      '*': FIVE_MB
    },
    isRequired: true
  })

  function createTrace (traceFormData: TraceFormData) {
    createTraceMutation.mutate({
      title: traceFormData.traceName,
      personalNote: traceFormData.personalNote || undefined
    }, {
      onSuccess: (traceResult) => {
        if (traceFormData.file) {
          uploadAttachmentMutation.mutate({
            traceId: traceResult.traceId,
            file: traceFormData.file
          })
        }
      }
    })
  }

  const form = useForm({
    defaultValues: {
      file: null,
      traceName: '',
      personalNote: ''
    } as TraceFormData,
    validators: {
      onSubmit ({ value }: { value: TraceFormData }) {
        return {
          fields: {
            file: validateFile(value.file),
            traceName: !value.traceName.trim() ? t('global.error.form.requiredFiled') : undefined,
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

  return {
    form,
    isFormValid
  }
}

export type CreateTraceForm = ReturnType<typeof useCreateTraceForm>['form']
