import type { MaybeRef } from 'vue'
import type { DeclaredActivityAssessmentDetailsDTO, DeclaredActivityAssessmentRequest } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { WriteAssessmentFormApi, WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { invalidateGetAssessmentDetails, useSendAssessment } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useAssessmentDraft } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-assessment-draft/use-assessment-draft'
import { useWriteAssessmentFormValidators } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/composables/use-write-assessment-form-validators/use-write-assessment-form-validators'
import { useToasterStore } from '@/store'

interface UseWriteAssessmentFormParams {
  assessment: MaybeRef<DeclaredActivityAssessmentDetailsDTO>
  onAssessmentSent?: () => void
}

function isEmptyFormData ({ grade, validation, comment }: WriteAssessmentFormData) {
  return grade === null && validation === null && !comment
}

/**
 * Form used by the staff to write the assessment of a declared activity, then send it.
 * Only the fields enabled by the activity assessment setup are validated and sent. The comment is
 * required when it is the single enabled option, optional when it comes with a grade or a validation.
 * Until the assessment is sent, every change is kept as a draft in the browser storage
 * and restored when the form is mounted again.
 */
export function useWriteAssessmentForm ({ assessment, onAssessmentSent }: UseWriteAssessmentFormParams) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()

  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()
  const { validateGrade, validateValidation, validateComment } = useWriteAssessmentFormValidators()

  const assessmentData = computed(() => toValue(assessment))
  const declaredActivityId = computed(() => assessmentData.value.declaredActivityId)
  const sentAssessment = computed(() => assessmentData.value.assessment)
  const isSent = computed(() => !!sentAssessment.value?.assessedAt)

  const assessmentSetup = computed(() => assessmentData.value.activity.assessment)
  const maxGrade = computed(() => assessmentSetup.value?.grade ?? undefined)
  const isGradeEnabled = computed(() => maxGrade.value !== undefined)
  const isValidationEnabled = computed(() => !!assessmentSetup.value?.validation)
  const isCommentEnabled = computed(() => !!assessmentSetup.value?.comment)
  const isCommentRequired = computed(() => isCommentEnabled.value && !isGradeEnabled.value && !isValidationEnabled.value)

  const { loadDraft, saveDraft, clearDraft } = useAssessmentDraft(declaredActivityId)

  function getSentFormData (): WriteAssessmentFormData {
    return {
      grade: sentAssessment.value?.grade ?? null,
      validation: sentAssessment.value?.validation ?? null,
      comment: sentAssessment.value?.comment ?? ''
    }
  }

  const restoredDraft = isSent.value ? undefined : loadDraft()

  // `undefined` while there is no draft, then whether its last write in the browser storage succeeded
  const isDraftSaved = ref<boolean | undefined>(restoredDraft ? true : undefined)

  function validateFields (value: WriteAssessmentFormData) {
    return {
      grade: maxGrade.value !== undefined ? validateGrade(value.grade, maxGrade.value) : undefined,
      validation: isValidationEnabled.value ? validateValidation(value.validation) : undefined,
      comment: isCommentEnabled.value ? validateComment(value.comment, isCommentRequired.value) : undefined,
    }
  }

  function isCompleteFormData (value: WriteAssessmentFormData) {
    return Object.values(validateFields(value)).every(error => !error)
  }

  const { mutateAsync: sendAssessment, isPending } = useSendAssessment({
    mutation: {
      onError: (error: BaseApiException) => addErrorMessage({
        title: t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.errors.sendAssessment'),
        description: getErrorMessage(error)
      })
    }
  })

  function toAssessmentRequest (value: WriteAssessmentFormData): DeclaredActivityAssessmentRequest {
    return {
      grade: isGradeEnabled.value ? value.grade ?? undefined : undefined,
      validation: isValidationEnabled.value ? value.validation ?? undefined : undefined,
      comment: isCommentEnabled.value ? value.comment.trim() || undefined : undefined,
    }
  }

  async function send (value: WriteAssessmentFormData) {
    try {
      await sendAssessment({
        declaredActivityId: declaredActivityId.value,
        data: toAssessmentRequest(value)
      })
    }
    catch {
      return
    }

    clearDraft()
    isDraftSaved.value = undefined

    await withTaskLoading(() => invalidateGetAssessmentDetails(queryClient, declaredActivityId.value))
    addSuccessMessage(t('staff.assessments.views.ActivityAssessmentDetailsView.AssessmentManagementFloatingPanel.success.sendAssessment'))
    onAssessmentSent?.()
  }

  const form = useForm({
    defaultValues: restoredDraft ?? getSentFormData(),
    validators: {
      onSubmit ({ value }: { value: WriteAssessmentFormData }) {
        // The form error blocks the submission even when the invalid field is not mounted
        return {
          form: isCompleteFormData(value) ? undefined : t('global.information.invalidForm'),
          fields: validateFields(value)
        }
      },
      onChange ({ value, formApi }: { value: WriteAssessmentFormData, formApi: WriteAssessmentFormApi }) {
        const isTouched = (field: keyof WriteAssessmentFormData) => formApi.getFieldMeta(field)?.isTouched ?? true
        const errors = validateFields(value)
        return {
          fields: {
            grade: isTouched('grade') ? errors.grade : undefined,
            validation: isTouched('validation') ? errors.validation : undefined,
            comment: isTouched('comment') ? errors.comment : undefined,
          }
        }
      },
      onBlur ({ formApi }: { formApi: WriteAssessmentFormApi }) {
        formApi.validate('change')
      }
    },
    onSubmit: async ({ value }: { value: WriteAssessmentFormData }) => {
      await send(value)
    }
  })

  const formValues = form.useStore(state => state.values)
  const isComplete = computed(() => isCompleteFormData(formValues.value))
  const isSending = computed(() => isPending.value || isLoading.value)

  watch(formValues, (values) => {
    if (isSent.value) {
      return
    }

    if (isEmptyFormData(values)) {
      clearDraft()
      isDraftSaved.value = undefined
      return
    }

    isDraftSaved.value = saveDraft(values)
  }, { deep: true })

  watch(isSent, (sent) => {
    if (sent) {
      form.reset(getSentFormData())
    }
  })

  return {
    form,
    maxGrade,
    isGradeEnabled,
    isValidationEnabled,
    isCommentEnabled,
    isCommentRequired,
    isSent,
    sentAssessment,
    isComplete,
    isDraftSaved,
    isSending
  }
}
