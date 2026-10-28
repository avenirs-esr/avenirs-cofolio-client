import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import {
  mockedAssessmentDetailsWithAssociations,
  mockedAssessmentDetailsWithoutAssociations
} from '@/__mocks__/fixtures/staffs/assessments.fixtures'
import { getGetAssessmentDetailsUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils/http/http-status'

export const getAssessmentDetailsHandler = http.get(
  `*${getGetAssessmentDetailsUrl(':declaredActivityId')}`,
  ({ params }) => {
    if (params.declaredActivityId === 'INVALID_DECLARED_ACTIVITY_ID') {
      return HttpResponse.json(
        { message: 'Activité déclarée non trouvée', code: ErrorCodes.DECLARED_ACTIVITY_NOT_FOUND },
        { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (params.declaredActivityId === mockedAssessmentDetailsWithoutAssociations.declaredActivityId) {
      return HttpResponse.json<DeclaredActivityAssessmentDetailsDTO>(mockedAssessmentDetailsWithoutAssociations, {
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

export const assessmentsHandlers = [
  getAssessmentDetailsHandler,
]
