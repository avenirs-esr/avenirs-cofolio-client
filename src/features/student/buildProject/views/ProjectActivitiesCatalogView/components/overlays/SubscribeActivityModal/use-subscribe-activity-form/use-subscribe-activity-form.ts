import type { BaseApiException } from '@/common/exceptions'
import { invalidateGetActivityDetail, useSubscribeActivity } from '@/api/avenir-esr'
import { useFormValidators } from '@/common/composables/use-form-validators/use-form-validators'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface SubscribeActivityFormData {
  startDate: string | null
  endDate: string | null
}

export function useSubscribeActivityForm (
  activity: { id: string, title: string },
  onSubscribed?: () => void
) {
  const { t } = useI18n()
  const { validateRequired, validateDateInterval } = useFormValidators()
  const { addSuccessMessage, addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  const { mutate: mutateSubscribeActivity, isPending } = useSubscribeActivity()

  function subscribe (period: { startDate: string, endDate: string } | undefined, onSuccess: () => void) {
    mutateSubscribeActivity({
      activityId: activity.id,
      data: { period }
    }, {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetActivityDetail(queryClient, activity.id))
        addSuccessMessage(t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.success'))
        onSubscribed?.()
        onSuccess()
      },
      onError: (error: BaseApiException) => {
        addErrorMessage({
          title: t('student.buildProject.activities.views.ProjectActivitiesCatalogView.overlays.ActivitySubscribeModal.error'),
          description: error.message
        })
      }
    })
  }

  const form = useForm({
    defaultValues: {
      startDate: null,
      endDate: null
    } as SubscribeActivityFormData,
    validators: {
      onSubmit ({ value }: { value: SubscribeActivityFormData }) {
        return {
          fields: {
            startDate: value.endDate ? validateRequired(value.startDate) : undefined,
            endDate: value.startDate ? validateDateInterval({ startDate: value.startDate, endDate: value.endDate }) : undefined
          }
        }
      }
    },
    onSubmit: ({ value }: { value: SubscribeActivityFormData }) => {
      const { startDate, endDate } = value
      const period = startDate && endDate
        ? { startDate, endDate }
        : undefined

      subscribe(period, () => {
        form.reset()
      })
    }
  })

  const isFormValid = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isValid && !state.value.isValidating
  })

  const isFormDirty = computed(() => {
    const state = form.useStore(s => s)
    return state.value.isDirty
  })

  return {
    form,
    isFormDirty,
    isFormValid,
    isSubmitting: isPending || isLoading.value
  }
}
