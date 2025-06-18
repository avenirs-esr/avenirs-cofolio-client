import type { PageInfo } from '@/api/avenir-esr'

export interface PaginatedResponse<T> {
  data: T
  page: PageInfo
}
