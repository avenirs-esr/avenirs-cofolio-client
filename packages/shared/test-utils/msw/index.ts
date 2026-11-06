import type { DefaultBodyType, JsonBodyType, StrictRequest } from 'msw'
import { HttpStatusCode } from '#shared/api/http-status'
import { ErrorCodes } from '#shared/exceptions/error-codes'
import { HttpResponse } from 'msw'

export function isEmptyDataSetRequest (request: StrictRequest<DefaultBodyType>) {
  return request.headers.has('x-dataset-empty')
}

export function createEmptyPaginatedDatasetResponse<T extends DefaultBodyType> (): HttpResponse<T> | undefined {
  const body = { data: [], page: { pageSize: 4, totalElements: 0, totalPages: 0, page: 0 } }
  return HttpResponse.json(body, {
    status: HttpStatusCode.OK,
    headers: {
      'Content-Type': 'application/json'
    }
  }) as unknown as HttpResponse<T>
}

export function getOptionalBooleanSearchParam (url: URL, name: string): boolean | undefined {
  const value = url.searchParams.get(name)

  return value === null ? undefined : value === 'true'
}

export function internalServerError (): HttpResponse<JsonBodyType> {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export function successJsonResponse<T extends JsonBodyType> (data: T): HttpResponse<T> {
  return HttpResponse.json<T>(data, {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
}
