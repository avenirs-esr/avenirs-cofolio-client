import type { PageInfoDTO } from '@/api/avenir-esr'

export interface PaginatedResponse<T> {
  data: T
  page: PageInfoDTO
}
