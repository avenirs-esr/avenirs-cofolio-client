import type { EUserCategory1, PagedResponseExternalUserAffiliationOverviewDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { createMockedGetAffiliationsResponse } from '@/__mocks__/fixtures/staffs/affiliations.fixtures'
import { getGetAffiliationsUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'
import { HttpStatusCode } from '@/common/utils/http/http-status'

export const getAffiliationsErrorHandler = http.get(`*${getGetAffiliationsUrl()}`, async () => {
  return HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.UNEXPECTED_ERROR },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
  )
})

const getAffiliationsHandler = http.get(`*${getGetAffiliationsUrl()}`, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams
  const keyword = searchParams.get('keyword') ?? undefined
  const categories = searchParams.getAll('categories') as EUserCategory1[] | undefined
  const groupIds = searchParams.getAll('groupIds') as string[] | undefined
  const institutionIds = searchParams.getAll('institutionIds') as string[] | undefined
  const page = searchParams.has('page') ? Number(searchParams.get('page')) : undefined
  const pageSize = searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined

  return HttpResponse.json<PagedResponseExternalUserAffiliationOverviewDTO>(createMockedGetAffiliationsResponse({
    keyword,
    categories,
    groupIds,
    institutionIds,
    page,
    pageSize
  }, 30), {
    status: HttpStatusCode.OK,
    headers: { 'Content-Type': 'application/json' },
  })
})

export const staffAffiliationsHandlers = [
  getAffiliationsHandler,
]
