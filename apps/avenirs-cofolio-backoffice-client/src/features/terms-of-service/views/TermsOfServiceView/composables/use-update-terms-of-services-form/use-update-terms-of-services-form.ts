import type { BaseApiException } from '@avenirs-esr/shared'
import type { CguDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { EditTermsOfServiceFormData } from '@/features/terms-of-service/types/forms.types'
import { useApiErrors, useTaskLoading, useToasterStore } from '@avenirs-esr/shared'
import { invalidateGetLatestCgu, useUploadCgu } from '@avenirs-esr/shared/api/avenir-esr'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useUpdateTermsOfServiceFormValidators } from '@/features/terms-of-service/views/TermsOfServiceView/composables/use-update-terms-of-service-form-validators/use-update-terms-of-service-form-validators'

export function useUpdateTermsOfServicesForm (cgu?: CguDTO) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const validators = useUpdateTermsOfServiceFormValidators()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const { mutate: mutateUploadCgu, isPending } = useUploadCgu({
    mutation: {
      onError: (error: BaseApiException) => addErrorMessage({
        title: t('terms-of-service.views.TermsOfServiceView.composables.useUpdateTermsOfServicesForm.error'),
        description: getErrorMessage(error),
      }),
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetLatestCgu(queryClient))
        addSuccessMessage({
          timeout: 2000,
          description: t('terms-of-service.views.TermsOfServiceView.composables.useUpdateTermsOfServicesForm.success'),
        })
      },
    },
  })

  const defaultValues: EditTermsOfServiceFormData = {
    description: cgu?.content ?? '',
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: ({ value, formApi }) => {
        const isTouched = (field: keyof EditTermsOfServiceFormData) => formApi.getFieldMeta(field)?.isTouched ?? true

        return {
          fields: {
            description: isTouched('description')
              ? validators.validateDescription(value.description)
              : undefined,
          },
        }
      },
      onBlur: ({ formApi }) => {
        formApi.validate('change')
      },
      onSubmit: ({ value }) => ({
        fields: {
          description: validators.validateDescription(value.description),
        },
      }),
    },
    onSubmit: ({ value }) => {
      mutateUploadCgu({
        data: {
          file: new Blob([value.description], { type: 'text/html' }),
        },
      })
    },
  })

  const isFormValid = form.useStore(state => state.isValid && !state.isValidating && state.isDirty)

  return {
    form,
    isFormValid,
    isSubmitting: computed(() => isPending.value || isLoading.value),
  }
}
