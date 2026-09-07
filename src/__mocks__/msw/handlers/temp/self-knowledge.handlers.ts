import { http, HttpResponse } from 'msw';
import { getGetSelfKnowledgeElementDetailsUrl, getUpdateSelfKnowledgeElementUrl, getCreateSelfKnowledgeElementUrl, getGetSelfKnowledgeCategoriesUrl, getAddSelfKnowledgeCategoriesUrl, getGetSelfKnowledgeElementsUrl, getDeleteSelfKnowledgeElementsUrl, getGetSelfKnowledgeCategoriesAvailableUrl, getRemoveSelfKnowledgeCategoryUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { SelfKnowledgeElementDetailsDTO, SelfKnowledgeElementViewDTO, ESelfKnowledgeCategory, SelfKnowledgeCategoryDTO[], PagedResponseSelfKnowledgeElementViewDTO } from '@/api/avenir-esr';

export const selfKnowledgeHandlers = [
  http.get(`*${getGetSelfKnowledgeElementDetailsUrl(':selfKnowledgeElementId')}`, ({ params }) => {
    const { selfKnowledgeElementId } = params

    return HttpResponse.json<SelfKnowledgeElementDetailsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateSelfKnowledgeElementUrl(':selfKnowledgeElementId')}`, ({ params }) => {
    const { selfKnowledgeElementId } = params

    return HttpResponse.json<SelfKnowledgeElementViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateSelfKnowledgeElementUrl(':selfKnowledgeCategory' as ESelfKnowledgeCategory)}`, ({ params }) => {
    const { selfKnowledgeCategory } = params

    return HttpResponse.json<SelfKnowledgeElementViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetSelfKnowledgeCategoriesUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAddSelfKnowledgeCategoriesUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetSelfKnowledgeElementsUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const selfKnowledgeCategoriesParam = url.searchParams.getAll('selfKnowledgeCategories')
    const selfKnowledgeCategories = selfKnowledgeCategoriesParam.length > 0 ? (selfKnowledgeCategoriesParam as ESelfKnowledgeCategory[]) : undefined
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const isValorized = url.searchParams.get('isValorized') === 'true'

    return HttpResponse.json<PagedResponseSelfKnowledgeElementViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteSelfKnowledgeElementsUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetSelfKnowledgeCategoriesAvailableUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getRemoveSelfKnowledgeCategoryUrl(':selfKnowledgeCategory' as ESelfKnowledgeCategory)}`, ({ params }) => {
    const { selfKnowledgeCategory } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
