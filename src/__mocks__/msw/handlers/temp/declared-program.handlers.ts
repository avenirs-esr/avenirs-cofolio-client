import { http, HttpResponse } from 'msw';
import { getGetDeclaredProgramUrl, getUpdateDeclaredProgramUrl, getGetDeclaredProgramsUrl, getCreateDeclaredProgramUrl, getDeleteDeclaredProgramUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { DeclaredProgramDetailedDTO, PagedResponseDeclaredProgramViewDTO, DeclaredProgramViewDTO } from '@/api/avenir-esr';

export const declaredProgramHandlers = [
  http.get(`*${getGetDeclaredProgramUrl(':declaredProgramId')}`, ({ params }) => {
    const { declaredProgramId } = params

    return HttpResponse.json<DeclaredProgramDetailedDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateDeclaredProgramUrl(':declaredProgramId')}`, ({ params }) => {
    const { declaredProgramId } = params

    return HttpResponse.json<DeclaredProgramDetailedDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredProgramsUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const isValorized = url.searchParams.get('isValorized') === 'true'

    return HttpResponse.json<PagedResponseDeclaredProgramViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateDeclaredProgramUrl()}`, () => {
    return HttpResponse.json<DeclaredProgramViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredProgramUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
