import { type DefaultBodyType, HttpResponse, type StrictRequest } from 'msw'

export function isEmptyDataSetRequest (request: StrictRequest<DefaultBodyType>) {
  return request.headers.has('x-dataset-empty')
}

export function createEmptyPaginatedDatasetResponse<T extends DefaultBodyType> (): HttpResponse<T> | undefined {
  const body = { data: [], page: { pageSize: 4, totalElements: 0, totalPages: 0, page: 0 } }
  return HttpResponse.json(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  }) as unknown as HttpResponse<T>
}
