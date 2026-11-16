import type { BaseApiException } from '@avenirs-esr/shared'
import type { ActivityContentDTO, ActivityPresentationDTO, SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { SaveSource } from '@/common/composables/use-save-state/use-save-state'
import { useApiErrors } from '@avenirs-esr/shared'
import {
  EActivityStatus,
  getGetActivityContentQueryKey,
  getGetActivityPresentationQueryKey,
  useUpdateSubActivityDraftsOrder,
} from '@avenirs-esr/shared/api/avenir-esr'
import { useQueryClient } from '@tanstack/vue-query'
import { debounce, isEqual } from 'lodash-es'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE } from '@/features/staff/activities/config'
import { useToasterStore } from '@/store'

export interface SubActivitiesOrder extends SaveSource {
  /**
   * The sub-activities in the order chosen by the user.
   * Assigning a new order schedules its save.
   */
  orderedSubActivities: Ref<SubActivityOverviewDTO[]>
}

/**
 * Lets the user reorder the sub-activities of an activity draft and persists the new order.
 *
 * @param activityDraftId The id of the parent activity draft
 * @param subActivities The sub-activities as known by the server
 * @returns The local order and its save state
 *
 * @example
 * ```ts
 * const { data: content } = useGetActivityContent(EActivityStatus.DRAFT, activityDraftId)
 * const subActivitiesOrder = useSubActivitiesOrder(activityDraftId, () => content.value?.subActivities ?? [])
 * const { orderedSubActivities } = subActivitiesOrder
 *
 * function moveSubActivity (from: number, to: number) {
 *   const reordered = [...orderedSubActivities.value]
 *   reordered.splice(to, 0, ...reordered.splice(from, 1))
 *   orderedSubActivities.value = reordered
 * }
 *
 * const saveState = useSaveState([subActivitiesOrder, ...otherSources])
 * ```
 */
export function useSubActivitiesOrder (
  activityDraftId: MaybeRefOrGetter<string>,
  subActivities: MaybeRefOrGetter<SubActivityOverviewDTO[]>
): SubActivitiesOrder {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { mutateAsync: updateOrder, isPending: isSaving } = useUpdateSubActivityDraftsOrder()

  const localOrder = ref<SubActivityOverviewDTO[]>([])
  const hasPendingChanges = ref(false)

  function toIds (subActivities: SubActivityOverviewDTO[]): string[] {
    return subActivities.map(({ id }) => id)
  }

  function sortByIds (subActivities: SubActivityOverviewDTO[], orderedIds: string[]): SubActivityOverviewDTO[] {
    const positions = new Map(orderedIds.map((id, index) => [id, index]))

    function rank ({ id }: SubActivityOverviewDTO): number {
      return positions.get(id) ?? orderedIds.length
    }

    return [...subActivities].sort((a, b) => rank(a) - rank(b))
  }

  function updateCachedOrder (draftId: string, orderedIds: string[]) {
    queryClient.setQueryData<ActivityContentDTO>(
      getGetActivityContentQueryKey(EActivityStatus.DRAFT, draftId),
      content => content && {
        ...content,
        subActivities: sortByIds(content.subActivities, orderedIds)
      }
    )
    queryClient.setQueryData<ActivityPresentationDTO>(
      getGetActivityPresentationQueryKey(EActivityStatus.DRAFT, draftId),
      presentation => presentation && {
        ...presentation,
        subActivities: sortByIds(presentation.subActivities, orderedIds)
      }
    )
  }

  async function sendOrder (draftId: string): Promise<void> {
    hasPendingChanges.value = false
    const orderedIds = toIds(localOrder.value)

    try {
      await updateOrder({
        activityDraftId: draftId,
        data: orderedIds
      })
      updateCachedOrder(draftId, orderedIds)
    }
    catch (error) {
      localOrder.value = [...toValue(subActivities)]
      addErrorMessage({
        title: t('staff.activities.views.EditNationalActivityView.composables.useSubActivitiesOrder.error'),
        description: getErrorMessage(error as BaseApiException)
      })
    }
  }

  const debouncedSendOrder = debounce(sendOrder, ACTIVITY_AUTO_SAVE_DEBOUNCE)

  const orderedSubActivities = computed({
    get: () => localOrder.value,
    set: (reorderedSubActivities) => {
      if (isEqual(toIds(reorderedSubActivities), toIds(localOrder.value))) {
        return
      }

      localOrder.value = reorderedSubActivities
      hasPendingChanges.value = true
      debouncedSendOrder(toValue(activityDraftId))
    }
  })

  function saveNow (): Promise<void> {
    return debouncedSendOrder.flush() ?? Promise.resolve()
  }

  watch(() => toValue(subActivities), (newSubActivities) => {
    localOrder.value = sortByIds(newSubActivities, toIds(localOrder.value))
  }, { immediate: true })

  return {
    orderedSubActivities,
    hasPendingChanges,
    isSaving,
    saveNow,
  }
}
