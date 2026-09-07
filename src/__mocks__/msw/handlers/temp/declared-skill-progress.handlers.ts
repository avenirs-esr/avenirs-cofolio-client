import { http, HttpResponse } from 'msw';
import { getGetDeclaredSkillProgressDetailsUrl, getUpdateDeclaredSkillProgressUrl, getDeleteDeclaredSkillProgressUrl, getGetDeclaredSkillsProgressesUrl, getCreateDeclaredSkillProgressUrl, getDeleteDeclaredSkillProgressesUrl, getUnassociateTracesUrl, getAssociateDeclaredSkillWithTracesUrl, getAssociateDeclaredSkillWithDeclaredExperiencesUrl, getAssociateDeclaredSkillWithDeclaredActivitiesUrl, getGetDeclaredSkillAssociationsUrl, getDeleteDeclaredSkillAssociationsUrl, getSearchDeclaredSkillsForAssociationUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { DeclaredSkillProgressDetailsDTO, DeclaredSkillProgressDTO, PagedResponseDeclaredSkillProgressDTO, DeclaredSkillAssociationsDTO, EAssociationContextType, PagedResponseAssociationSearchResultDeclaredSkillIDTO } from '@/api/avenir-esr';

export const declaredSkillProgressHandlers = [
  http.get(`*${getGetDeclaredSkillProgressDetailsUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json<DeclaredSkillProgressDetailsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateDeclaredSkillProgressUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json<DeclaredSkillProgressDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredSkillProgressUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredSkillsProgressesUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const isValorized = url.searchParams.get('isValorized') === 'true'

    return HttpResponse.json<PagedResponseDeclaredSkillProgressDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateDeclaredSkillProgressUrl()}`, () => {
    return HttpResponse.json<DeclaredSkillProgressDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredSkillProgressesUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getUnassociateTracesUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateDeclaredSkillWithTracesUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json<DeclaredSkillAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateDeclaredSkillWithDeclaredExperiencesUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json<DeclaredSkillAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateDeclaredSkillWithDeclaredActivitiesUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json<DeclaredSkillAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredSkillAssociationsUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json<DeclaredSkillAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredSkillAssociationsUrl(':declaredSkillProgressId')}`, ({ params }) => {
    const { declaredSkillProgressId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchDeclaredSkillsForAssociationUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const excludeAssociatedWithElementId = url.searchParams.get('excludeAssociatedWithElementId')
    const contextType = url.searchParams.get('contextType') as EAssociationContextType | null
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredSkillIDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
