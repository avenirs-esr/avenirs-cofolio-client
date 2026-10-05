import { mockedStaffScope } from '@/__mocks__/fixtures/staffs/staff-scope.fixtures'
import { getStaffScopeUrl, type StaffScopeResponse } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'
import { http, HttpResponse } from 'msw'

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
