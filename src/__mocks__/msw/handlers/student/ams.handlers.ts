import type {
  PagedResponseAmsViewDTO
} from '@/api/avenir-esr'
import { createMockedPagedResponseAmsViewDTO } from '@/__mocks__/fixtures/student'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { http, HttpResponse, type PathParams } from 'msw'

export const amsHandlers = [
  http.get<PathParams, PagedResponseAmsViewDTO>(`*/me/ams/view`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const studentProgressId = searchParams.get('studentProgressId')

    if (!studentProgressId) {
      return HttpResponse.json<null>(null, {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedPagedResponseAmsViewDTO(pageSize, 20, page, studentProgressId)

    return HttpResponse.json<PagedResponseAmsViewDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

]
