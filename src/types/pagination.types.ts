export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface PaginatedResponse<T> {
  data: T
  page: PageInfo
}
