import type { BaseApiException } from '@/common/exceptions'
import { type DeclaredActivityDetailsDTO, invalidateGetDeclaredActivityDetails, useUpdateDeclaredActivity } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

export interface UpdateActivityFormData {
  startDate: string | null
  endDate: string | null
  valorized: boolean
}

export function useUpdateActivityForm (
  declaredActivity: MaybeRef<DeclaredActivityDetailsDTO>,
  onUpdated?: () => void
) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const { validateRequired, validateDateInterval } = useFormValidators()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const { mutate: mutateUpdateDeclaredActivity, isPending } = useUpdateDeclaredActivity()

  const isActivityPeriodDefined = computed(() => {
    const activity = toValue(declaredActivity).activity
    return !!activity.startDate || !!activity.endDate
  })

  function updateActivity (value: UpdateActivityFormData) {
    const period = !isActivityPeriodDefined.value && value.startDate && value.endDate
      ? { startDate: value.startDate, endDate: value.endDate }
      : undefined

    mutateUpdateDeclaredActivity({
      declaredActivityId: toValue(declaredActivity).id,
      data: { period, valorized: value.valorized }
    }, {
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('student.buildProject.activities.overlays.UpdateActivityDrawer.errors.updateActivity'),
          description: getErrorMessage(error)
        })
      },
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetDeclaredActivityDetails(queryClient, toValue(declaredActivity).id))
        onUpdated?.()
      }
    })
  }

  const form = useForm({
    defaultValues: {
      startDate: toValue(declaredActivity).startDate ?? null,
      endDate: toValue(declaredActivity).endDate ?? null,
      valorized: toValue(declaredActivity).valorized ?? false
    } as UpdateActivityFormData,
    validators: {
      onSubmit ({ value }: { value: UpdateActivityFormData }) {
        const { startDate, endDate } = value
        return {
          fields: {
            startDate: endDate ? validateRequired(startDate) : undefined,
            endDate: startDate ? validateDateInterval({ startDate, endDate }) : undefined
          }
        }
      }
    },
    onSubmit: ({ value }: { value: UpdateActivityFormData }) => {
      updateActivity(value)
    }
  })

  watch(
    () => toValue(declaredActivity),
    (activity) => {
      form.reset({
        startDate: activity.startDate ?? null,
        endDate: activity.endDate ?? null,
        valorized: activity.valorized ?? false
      } as UpdateActivityFormData)
    }
  )

  const isFormValid = computed(() => {
    const state = form.useStore(state => state)
    return state.value.isValid && !state.value.isValidating && state.value.isDirty
  })

  return {
    form,
    isFormValid,
    isSubmitting: isPending || isLoading.value
  }
}
