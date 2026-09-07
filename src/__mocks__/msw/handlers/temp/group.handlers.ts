import { http, HttpResponse } from 'msw';
import { getFindAll1Url, getUpdateAll2Url, getCreateAll2Url, getFindById1Url, getDelete2Url } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { FindAll1Type, GroupResponse[], GroupImportSummaryResponse, GroupResponse } from '@/api/avenir-esr';

export const groupHandlers = [
  http.get(`*${getFindAll1Url()}`, ({ request }) => {
    const url = new URL(request.url)
    const institutionId = url.searchParams.get('institutionId')
    const parentId = url.searchParams.get('parentId')
    const type = url.searchParams.get('type') as FindAll1Type | null
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    return HttpResponse.json<GroupResponse[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateAll2Url()}`, () => {
    return HttpResponse.json<GroupResponse[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateAll2Url()}`, () => {
    return HttpResponse.json<GroupImportSummaryResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getFindById1Url(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json<GroupResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDelete2Url(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
