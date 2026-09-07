import { http, HttpResponse } from 'msw';
import { getFindAllUrl, getUpdateAll1Url, getCreateAll1Url, getFindByIdUrl, getDelete1Url } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { FindAllType, InstitutionResponse[], InstitutionImportSummaryResponse, InstitutionResponse } from '@/api/avenir-esr';

export const institutionHandlers = [
  http.get(`*${getFindAllUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const parentId = url.searchParams.get('parentId')
    const type = url.searchParams.get('type') as FindAllType | null

    return HttpResponse.json<InstitutionResponse[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateAll1Url()}`, () => {
    return HttpResponse.json<InstitutionResponse[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateAll1Url()}`, () => {
    return HttpResponse.json<InstitutionImportSummaryResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getFindByIdUrl(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json<InstitutionResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDelete1Url(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
