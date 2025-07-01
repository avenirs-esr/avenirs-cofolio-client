import type {
  AmsViewResponse
} from '@/api/avenir-esr'
import { createMockedAmsViewResponse } from '@/__mocks__/fixtures/student'
import { PageSizes } from '@/config'
import { http, HttpResponse, type PathParams } from 'msw'

export const amsHandlers = [
  http.get<PathParams, AmsViewResponse>(`*/me/ams/view`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const programProgressId = searchParams.get('programProgressId')

    if (!programProgressId) {
      return HttpResponse.json<null>(null, {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedAmsViewResponse(pageSize, 20, page, programProgressId)

    return HttpResponse.json<AmsViewResponse>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

]
