import type { EGroupType, GroupDTO, GroupOverviewDTO, PagedResponseGroupOverviewDTO } from '@/api/avenir-esr'
import { delay, http, HttpResponse } from 'msw'
import { createMockedGetGroupsResponse, generateGroupOverviewDTOs, getGroupDTO } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { getGetGroupByIdUrl, getGetGroupsUrl, getGetSubGroupsOfGroupUrl } from '@/api/avenir-esr'
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

  return HttpResponse.json<GroupDTO>(getGroupDTO(String(id)), {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const getGroupsEmptyHandler = http.get(`*${getGetGroupsUrl()}`, async () => {
  return HttpResponse.json<PagedResponseGroupOverviewDTO>(createMockedGetGroupsResponse({ }, 0), {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const getGroupsErrorHandler = http.get(`*${getGetGroupsUrl()}`, async () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.UNEXPECTED_ERROR },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
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

const getSubGroupsOfGroupHandler = http.get(`*${getGetSubGroupsOfGroupUrl(':id')}`, async ({ params }) => {
  const { id } = params

  if (id === 'INVALID_ID') {
    return HttpResponse.json(
      { message: 'Erreur interne du serveur', code: ErrorCodes.NOT_FOUND },
      { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (id === 'EMPTY_ID') {
    return HttpResponse.json<GroupOverviewDTO[]>([], {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (id === 'LOADING_ID') {
    await delay('infinite')
    return HttpResponse.json<GroupOverviewDTO[]>([], {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return HttpResponse.json<GroupOverviewDTO[]>(generateGroupOverviewDTOs(3), {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const staffGroupsHandlers = [
  getGroupByIdHandler,
  getGroupsHandler,
  getSubGroupsOfGroupHandler,
]
