import {
  createMockedPagedResponseFeedbackStaffListItemDTO,
  mockedFeedbackDashboard,
  mockedFeedbackDetailsSeen,
  mockedFeedbackDetailsSubmitted,
  mockedFeedbackDetailsWithAssociations,
  mockedFeedbackDetailsWithoutAssociations,
  mockedFeedbackHistory,
  mockedUploadedFeedbackAttachment
} from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import {
  type FeedbackDashboardDTO,
  type FeedbackDetailsDTO,
  type FeedbackOverviewDTO,
  type FileDTO,
  getDeleteFeedbackAttachmentUrl,
  getGetFeedbackDashboardUrl,
  getGetFeedbackDetailsUrl,
  getGetFeedbackHistoryUrl,
  getGetStaffFeedbacksUrl,
  getSubmitFeedbackUrl,
  getUpdateFeedbackUrl,
  getUploadFeedbackAttachmentUrl
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const getFeedbackDashboardHandler = http.get(
  `*${getGetFeedbackDashboardUrl()}`,
  () => HttpResponse.json<FeedbackDashboardDTO>(mockedFeedbackDashboard, {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
)

export const getFeedbackDashboardErrorHandler = http.get(
  `*${getGetFeedbackDashboardUrl()}`,
  () => HttpResponse.json(
    { message: 'Erreur lors de la récupération du tableau de bord' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
)

export const getFeedbackDetailsWithAssociationsHandler = http.get(
  `*${getGetFeedbackDetailsUrl(':userCategory' as 'STAFF', ':feedbackId')}`,
  ({ params }) => {
    if (params.feedbackId === 'INVALID_FEEDBACK_ID') {
      return HttpResponse.json(
        { message: 'Feedback non trouvé', code: ErrorCodes.FEEDBACK_NOT_FOUND },
        { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (params.feedbackId === mockedFeedbackDetailsWithoutAssociations.id) {
      return HttpResponse.json<FeedbackDetailsDTO>(mockedFeedbackDetailsWithoutAssociations, {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (params.feedbackId === mockedFeedbackDetailsSubmitted.id) {
      return HttpResponse.json<FeedbackDetailsDTO>(mockedFeedbackDetailsSubmitted, {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (params.feedbackId === mockedFeedbackDetailsSeen.id) {
      return HttpResponse.json<FeedbackDetailsDTO>(mockedFeedbackDetailsSeen, {
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

export function createGetFeedbackHistoryHandler (feedbacks: FeedbackOverviewDTO[] = mockedFeedbackHistory) {
  return http.get(
    `*${getGetFeedbackHistoryUrl(':declaredActivityId')}`,
    () => HttpResponse.json<FeedbackOverviewDTO[]>(feedbacks, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

export const getFeedbackHistoryHandler = createGetFeedbackHistoryHandler()

export const getFeedbackHistoryErrorHandler = http.get(
  `*${getGetFeedbackHistoryUrl(':declaredActivityId')}`,
  () => HttpResponse.json(
    { message: 'Erreur lors de la récupération de l\'historique des feedbacks' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
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

export const getStaffFeedbacksErrorHandler = http.get(`*${getGetStaffFeedbacksUrl()}`, () =>
  HttpResponse.json(
    { message: 'Erreur lors de la récupération des feedbacks' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  ))

export const getStaffFeedbacksOverviewHandler = http.get(`*${getGetStaffFeedbacksUrl()}`, () => {
  const mockData = createMockedPagedResponseFeedbackStaffListItemDTO(3, 3, 0)
  return HttpResponse.json(mockData)
})

export const updateFeedbackHandler = http.put(`*${getUpdateFeedbackUrl(':feedbackId')}`, ({ params }) => {
  if (params.feedbackId === 'INVALID_FEEDBACK_ID') {
    return HttpResponse.json(
      { message: 'Feedback non trouvé', code: ErrorCodes.FEEDBACK_NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (params.feedbackId === mockedFeedbackDetailsSeen.id) {
    return HttpResponse.json(
      { message: 'Feedback déjà consulté', code: ErrorCodes.FEEDBACK_SEEN },
      { status: HttpStatusCode.CONFLICT, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json(undefined, {
    status: HttpStatusCode.NO_CONTENT,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const submitFeedbackHandler = http.post(`*${getSubmitFeedbackUrl(':feedbackId')}`, ({ params }) => {
  if (params.feedbackId === 'INVALID_FEEDBACK_ID') {
    return HttpResponse.json(
      { message: 'Feedback non trouvé', code: ErrorCodes.FEEDBACK_NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<FeedbackDetailsDTO>(
    {
      ...mockedFeedbackDetailsWithAssociations,
      id: params.feedbackId as string,
      status: 'SUBMITTED' as any
    },
    {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    }
  )
})

export const uploadFeedbackAttachmentHandler = http.post(`*${getUploadFeedbackAttachmentUrl(':feedbackId')}`, ({ params }) => {
  if (params.feedbackId === mockedFeedbackDetailsSeen.id) {
    return HttpResponse.json(
      { message: 'Feedback déjà consulté', code: ErrorCodes.FEEDBACK_SEEN },
      { status: HttpStatusCode.CONFLICT, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<FileDTO>(mockedUploadedFeedbackAttachment, {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const deleteFeedbackAttachmentHandler = http.delete(`*${getDeleteFeedbackAttachmentUrl(':feedbackId', ':attachmentId')}`, ({ params }) => {
  if (params.feedbackId === mockedFeedbackDetailsSeen.id) {
    return HttpResponse.json(
      { message: 'Feedback déjà consulté', code: ErrorCodes.FEEDBACK_SEEN },
      { status: HttpStatusCode.CONFLICT, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new HttpResponse(null, { status: HttpStatusCode.NO_CONTENT })
})

export const feedbacksHandlers = [
  getFeedbackDashboardHandler,
  getFeedbackHistoryHandler,
  getFeedbackDetailsWithAssociationsHandler,
  getStaffFeedbacksHandler,
  updateFeedbackHandler,
  submitFeedbackHandler,
  uploadFeedbackAttachmentHandler,
  deleteFeedbackAttachmentHandler,
]
