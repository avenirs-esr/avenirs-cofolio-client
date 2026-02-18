import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { type ActivityDetailDTO, getActivityDetail } from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'

const activitiesCommonQueryKey = [...commonQueryKeys, 'activities']
const activityDetailsQueryKey = [...activitiesCommonQueryKey, 'details']

export function useActivityDetailQuery (activityId: MaybeRef<string>) {
  const queryKey = computed(() => [...activityDetailsQueryKey, toValue(activityId)])

  const queryFn = computed(() => async (): Promise<ActivityDetailDTO> => {
    return await getActivityDetail(toValue(activityId))
  })

  const query = useQuery<ActivityDetailDTO, BaseApiException, ActivityDetailDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(activityId).trim().length > 0),
  })

  const activityDetail = computed(() => query.data.value)

  return {
    ...query,
    activityDetail,
  }
}
