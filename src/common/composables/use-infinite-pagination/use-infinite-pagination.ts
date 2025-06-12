import type { BaseApiException } from '@/common/exceptions'
import type { PaginatedResponse } from '@/types'
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryReturnType
} from '@tanstack/vue-query'
import { toValue } from 'vue'

export function defaultGetNextPageParam<T> (
  lastPage: PaginatedResponse<T>
): number | undefined {
  const { page } = lastPage
  return page.number < page.totalPages - 1 ? page.number + 1 : undefined
}

export function useAvInfiniteQuery<
  T,
  TQueryKey extends QueryKey = QueryKey
> (
  options: UseInfiniteQueryOptions<
    PaginatedResponse<T>,
    BaseApiException,
    InfiniteData<T, number>,
    PaginatedResponse<T>,
    TQueryKey,
    number
  >
): UseInfiniteQueryReturnType<InfiniteData<T, number>, BaseApiException> {
  const resolvedOptions = toValue(options)

  return useInfiniteQuery<
    PaginatedResponse<T>,
    BaseApiException,
    InfiniteData<T, number>,
    TQueryKey,
    number
  >({
    ...resolvedOptions,
    select: resolvedOptions.select ?? ((data: InfiniteData<PaginatedResponse<T>, number>) => ({
      pages: data.pages.map(page => page.data),
      pageParams: data.pageParams
    })),
    getNextPageParam: resolvedOptions.getNextPageParam ?? defaultGetNextPageParam,
    initialPageParam: resolvedOptions.initialPageParam ?? 0,
  })
}
