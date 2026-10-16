import type { GroupDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { mockGroup } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { getGetGroupByIdUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'
import { HttpStatusCode } from '@/common/utils/http/http-status'

const getGroupByIdHandler = http.get(`*${getGetGroupByIdUrl(':id')}`, ({ params }) => {
  const { id } = params

  if (id === 'INVALID_ID') {
    return HttpResponse.json(
      { message: 'Erreur interne du serveur', code: ErrorCodes.NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return HttpResponse.json<GroupDTO>(mockGroup, {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const staffsGroupsHandlers = [
  getGroupByIdHandler,
]
