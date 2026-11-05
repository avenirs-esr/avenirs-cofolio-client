import type {
  DeclaredActivityAssessmentDetailsDTO,
  EActivityAssessmentStatus,
  PagedResponseDeclaredActivityToAssessDTO
} from '@/api/avenir-esr'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { createEmptyPaginatedDatasetResponse, isEmptyDataSetRequest } from '@avenirs-esr/shared/test-utils/msw'
import { http, HttpResponse } from 'msw'
import {
  createMockedPagedResponseDeclaredActivitiesToAssessDTO,
  mockedAssessmentDetailsCommentOnly,
  mockedAssessmentDetailsGradeOnly,
  mockedAssessmentDetailsSent,
  mockedAssessmentDetailsValidationOnly,
  mockedAssessmentDetailsWithAssociations,
  mockedAssessmentDetailsWithoutAssociations
} from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import {
  getGetAssessmentDetailsUrl,
  getGetDeclaredActivitiesToAssessUrl,
  getSendAssessmentUrl
} from '@/api/avenir-esr'

export const getDeclaredActivitiesToAssessHandler = http.get(
  `*${getGetDeclaredActivitiesToAssessUrl()}`,
  ({ request }) => {
    if (isEmptyDataSetRequest(request)) {
      return createEmptyPaginatedDatasetResponse<PagedResponseDeclaredActivityToAssessDTO>()
    }

    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '12')
    const statuses = url.searchParams.getAll('statuses') as EActivityAssessmentStatus[]

    const mockData = createMockedPagedResponseDeclaredActivitiesToAssessDTO(
      pageSize,
      page,
      statuses.length > 0 ? statuses : undefined
    )

    return HttpResponse.json<PagedResponseDeclaredActivityToAssessDTO>(mockData, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }
)

export const getDeclaredActivitiesToAssessErrorHandler = http.get(
  `*${getGetDeclaredActivitiesToAssessUrl()}`,
  () => {
    return HttpResponse.json(
      { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
    )
  }
)

export const getAssessmentDetailsHandler = http.get(
  `*${getGetAssessmentDetailsUrl(':declaredActivityId')}`,
  ({ params }) => {
    if (params.declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
      return HttpResponse.json(
        { message: 'Activité déclarée non trouvée', code: ErrorCodes.DECLARED_ACTIVITY_NOT_FOUND },
        { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const assessmentDetails = [
      mockedAssessmentDetailsCommentOnly,
      mockedAssessmentDetailsGradeOnly,
      mockedAssessmentDetailsValidationOnly,
      mockedAssessmentDetailsSent,
      mockedAssessmentDetailsWithoutAssociations,
    ].find(details => details.declaredActivityId === params.declaredActivityId)

    if (assessmentDetails) {
      return HttpResponse.json<DeclaredActivityAssessmentDetailsDTO>(assessmentDetails, {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return HttpResponse.json<DeclaredActivityAssessmentDetailsDTO>(mockedAssessmentDetailsWithAssociations, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }
)

export const sendAssessmentHandler = http.put(
  `*${getSendAssessmentUrl(':declaredActivityId')}`,
  ({ params }) => {
    if (params.declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
      return HttpResponse.json(
        { message: 'Activité déclarée non trouvée', code: ErrorCodes.DECLARED_ACTIVITY_NOT_FOUND },
        { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new HttpResponse(null, { status: HttpStatusCode.NO_CONTENT })
  }
)

export const assessmentsHandlers = [
  getDeclaredActivitiesToAssessHandler,
  getAssessmentDetailsHandler,
  sendAssessmentHandler,
]
