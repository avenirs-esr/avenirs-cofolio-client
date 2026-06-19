import { mockedFeedbackDetailsWithAssociations, mockedFeedbackDetailsWithoutAssociations } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { type FeedbackDetailsDTO, getGetFeedbackDetailsUrl } from '@/api/avenir-esr'
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

export const feedbacksHandlers = [
  getFeedbackDetailsWithAssociationsHandler,
]
