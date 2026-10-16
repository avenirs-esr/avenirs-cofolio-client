import type { Ref } from 'vue'
import type { EUserCategory, NotificationDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useGetNotifications } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'

export interface UsePaginatedNotifications {
  notifications: Ref<NotificationDTO[]>
  error: Ref<BaseApiException | null>
  pageInfo: Ref<PageInfoDTO>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreNotifications: () => void
  resetPagination: () => void
}

export function usePaginatedNotifications ({ userCategory, pageSize }: { userCategory: EUserCategory, pageSize?: Ref<number> }): UsePaginatedNotifications {
  const page = ref<number>(0)

  const params = computed(() => ({
    page: page.value,
    pageSize: toValue(pageSize) ?? PageSizes.EIGHT
  }))

  const { data, isFetching, error } = useGetNotifications(userCategory, params, {
    query: { placeholderData: keepPreviousData }
  })
  const fetchedNotifications = computed(() => data.value?.data || [])
  const pageInfo = computed(() => data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  const {
    items: notifications,
    loadMore: loadMoreNotifications,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedNotifications,
    pageInfo,
    isFetching,
    page,
  })

  return {
    notifications,
    error,
    pageInfo,
    page,
    isFetching,
    loadMoreNotifications,
    resetPagination
  }
}
