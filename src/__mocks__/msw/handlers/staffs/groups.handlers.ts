import type { EGroupType, GroupDTO, PagedResponseGroupOverviewDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { createMockedGetGroupsResponse, mockGroup } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { getGetGroupByIdUrl, getGetGroupsUrl } from '@/api/avenir-esr'
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

const getGroupsHandler = http.get(`*${getGetGroupsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const keyword = searchParams.get('keyword') ?? undefined
  const types = searchParams.getAll('types') as EGroupType[] | undefined
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined

  return HttpResponse.json<PagedResponseGroupOverviewDTO>(createMockedGetGroupsResponse({ keyword, types, page, pageSize }, 30), {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const staffsGroupsHandlers = [
  getGroupByIdHandler,
  getGroupsHandler,
]
