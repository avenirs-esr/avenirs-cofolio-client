import type { BaseApiException } from '@/common/exceptions'
import { type DeclaredActivityDetailsDTO, invalidateGetDeclaredActivityDetails, useUpdatePeriod } from '@/api/avenir-esr'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export interface UpdateActivityPeriodFormData {
  startDate: string | null
  endDate: string | null
}

export function useUpdateActivityForm (
  declaredActivity: MaybeRef<DeclaredActivityDetailsDTO>,
  onUpdated?: () => void
) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const { validateRequired, validateDateInterval } = useFormValidators()
  const queryClient = useQueryClient()

  const { mutate: mutateUpdatePeriod, isPending } = useUpdatePeriod()

  function updateActivityPeriod (period: { startDate: string, endDate: string } | undefined) {
    mutateUpdatePeriod({
      declaredActivityId: toValue(declaredActivity).id,
      data: { period }
    }, {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('student.buildProject.activities.overlays.UpdateActivityDrawer.errors.updatePeriod'),
          description: error.message
        })
      },
      onSuccess: async () => {
        await invalidateGetDeclaredActivityDetails(queryClient, toValue(declaredActivity).id)
        onUpdated?.()
      }
    })
  }

  const form = useForm({
    defaultValues: {
      startDate: toValue(declaredActivity).startDate ?? null,
      endDate: toValue(declaredActivity).endDate ?? null
    } as UpdateActivityPeriodFormData,
    validators: {
      onSubmit ({ value }: { value: UpdateActivityPeriodFormData }) {
        const { startDate, endDate } = value
        return {
          fields: {
            startDate: endDate ? validateRequired(startDate) : undefined,
            endDate: startDate ? validateDateInterval({ startDate, endDate }) : undefined
          }
        }
      }
    },
    onSubmit: ({ value }: { value: UpdateActivityPeriodFormData }) => {
      updateActivityPeriod(value.startDate && value.endDate
        ? { startDate: value.startDate, endDate: value.endDate }
        : undefined)
    }
  })

  watch(
    () => toValue(declaredActivity),
    (activity) => {
      form.reset({
        startDate: activity.startDate ?? null,
        endDate: activity.endDate ?? null
      } as UpdateActivityPeriodFormData)
    }
  )

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending
  }
}
