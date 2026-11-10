import type { StaffScopeResponse } from '@avenirs-esr/shared/api/avenir-esr'
import { ErrorCodes, HttpStatusCode } from '@avenirs-esr/shared'
import { getStaffScopeUrl } from '@avenirs-esr/shared/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { mockedStaffScope } from '@/__mocks__/fixtures/staffs/staff-scope.fixtures'

export const getStaffScopeErrorHandler = http.get(`*${getStaffScopeUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.SERVER },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

export const staffsScopeHandlers = [
  http.get(`*${getStaffScopeUrl()}`, () => {
    return HttpResponse.json<StaffScopeResponse>(mockedStaffScope, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
]
