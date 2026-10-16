import type { StaffScopeResponse } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { mockedStaffScope } from '@/__mocks__/fixtures/staffs/staff-scope.fixtures'
import { getStaffScopeUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils'

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
