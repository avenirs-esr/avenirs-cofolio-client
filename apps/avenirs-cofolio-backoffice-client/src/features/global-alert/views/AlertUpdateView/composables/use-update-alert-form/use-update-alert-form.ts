import type { BaseApiException } from '@avenirs-esr/shared'
import type { AlertConfigurationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { fromInstant, toInstant, useApiErrors, useToasterStore } from '@avenirs-esr/shared'
import { invalidateGetAlertConfig, usePutAlertConfig } from '@avenirs-esr/shared/api/avenir-esr'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { useUpdateAlertFormValidators } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form-validators/use-update-alert-form-validators'

export interface AlertUpdateFormData extends AlertConfigurationDTO {}

export function useUpdateAlertForm (alert?: AlertConfigurationDTO, onAlertUpdated?: () => void) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage, addSuccessMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const validators = useUpdateAlertFormValidators()

  const { mutate: mutateUpdateAlert, isPending } = usePutAlertConfig({
    mutation: {
      onError: (error: BaseApiException) => addErrorMessage({
        title: t('global-alert.views.AlertUpdateView.composables.useUpdateAlertForm.error'),
        description: getErrorMessage(error),
      }),
      onSuccess: async () => {
        await invalidateGetAlertConfig(queryClient)
        addSuccessMessage({
          timeout: 2000,
          description: t('global-alert.views.AlertUpdateView.composables.useUpdateAlertForm.success'),
        })
        onAlertUpdated?.()
      }
    }
  })

  const defaultValues: AlertUpdateFormData = {
    message: '',
    ...alert,
    startDate: fromInstant(alert?.startDate),
    endDate: fromInstant(alert?.endDate),
  }

  const form = useForm({
    defaultValues,
    validators: {
      onChange: ({ value, formApi }) => {
        const isTouched = (field: keyof AlertUpdateFormData) => formApi.getFieldMeta(field)?.isTouched ?? true

        return {
          fields: {
            message: isTouched('message')
              ? validators.validateMessage(value.message)
              : undefined,
            startDate: isTouched('startDate')
              ? validators.validateStartDate(value.startDate, value.endDate)
              : undefined,
            endDate: isTouched('endDate')
              ? validators.validateEndDate(value.endDate, value.startDate)
              : undefined,
          }
        }
      },
      onBlur: ({ formApi }) => {
        formApi.validate('change')
      },
      onSubmit: ({ value }) => ({
        fields: {
          message: validators.validateMessage(value.message),
          startDate: validators.validateStartDate(value.startDate, value.endDate),
          endDate: validators.validateEndDate(value.endDate, value.startDate),
        }
      })
    },
    onSubmit: ({ value }) => {
      const startDate = toInstant(value.startDate)
      const endDate = toInstant(value.endDate)

      mutateUpdateAlert({
        data: {
          message: value.message,
          ...(!startDate && !endDate && { active: !!value.active }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      })
    },
  })

  const isActive = form.useStore(state => Boolean(state.values.active))
  const hasPeriod = form.useStore(state => Boolean(state.values.startDate || state.values.endDate))
  const isFormValid = form.useStore(state => state.isValid && !state.isValidating && state.isDirty)

  watch(isActive, (active) => {
    if (active && hasPeriod.value) {
      form.setFieldValue('startDate', undefined)
      form.setFieldValue('endDate', undefined)
      form.validate('change')
    }
  })

  return {
    form,
    isActive,
    isFormValid,
    isSubmitting: computed(() => isPending.value),
  }
}

export type AlertUpdateForm = ReturnType<typeof useUpdateAlertForm>['form']
