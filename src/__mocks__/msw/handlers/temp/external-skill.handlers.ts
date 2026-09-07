import { http, HttpResponse } from 'msw';
import { getGetExternalSkillByIdUrl, getSearchExternalSkillsUrl, getGetRandomSkillsUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { ExternalSkillDetailsDTO, PagedResponseExternalSkillDTO, ExternalSkillDTO[] } from '@/api/avenir-esr';

export const externalSkillHandlers = [
  http.get(`*${getGetExternalSkillByIdUrl(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json<ExternalSkillDetailsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchExternalSkillsUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseExternalSkillDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetRandomSkillsUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const countParam = url.searchParams.get('count')
    const count = countParam ? Number(countParam) : undefined

    return HttpResponse.json<ExternalSkillDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
