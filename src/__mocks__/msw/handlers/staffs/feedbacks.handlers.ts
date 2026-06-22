import { createMockedPagedResponseFeedbackStaffListItemDTO, mockedFeedbackDetailsWithAssociations, mockedFeedbackDetailsWithoutAssociations } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { type FeedbackDetailsDTO, getGetFeedbackDetailsUrl, getGetStaffFeedbacksUrl } from '@/api/avenir-esr'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const getFeedbackDetailsWithAssociationsHandler = http.get(
  `*${getGetFeedbackDetailsUrl(':userCategory' as 'STAFF', ':feedbackId')}`,
  ({ params }) => {
    if (params.feedbackId === mockedFeedbackDetailsWithoutAssociations.id) {
      return HttpResponse.json<FeedbackDetailsDTO>(mockedFeedbackDetailsWithoutAssociations, {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return HttpResponse.json<FeedbackDetailsDTO>(mockedFeedbackDetailsWithAssociations, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }
)

export const getStaffFeedbacksHandler = http.get(
  `*${getGetStaffFeedbacksUrl()}`,
  ({ request }) => {
    const url = new URL(request.url)

    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '12')

    const mockData = createMockedPagedResponseFeedbackStaffListItemDTO(pageSize, 3, page)
    return HttpResponse.json(mockData)
  },
)

export const feedbacksHandlers = [
  getFeedbackDetailsWithAssociationsHandler,
  getStaffFeedbacksHandler,
]
