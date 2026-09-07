import { http, HttpResponse } from 'msw';
import { getGetDeclaredExperienceUrl, getUpdateDeclaredExperienceUrl, getAssociateDeclaredExperienceWithTracesUrl, getAssociateDeclaredExperienceWithDeclaredSkillsUrl, getCreateDeclaredExperienceUrl, getDeleteDeclaredExperiencesUrl, getSearchTracesForAssociationWithDeclaredExperienceUrl, getGetDeclaredExperienceAssociationsUrl, getDeleteDeclaredExperienceAssociationsUrl, getGetDeclaredExperienceViewUrl, getSearchDeclaredExperiencesForAssociationUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { DeclaredExperienceViewDTO, DeclaredExperienceAssociationsDTO, PagedResponseAssociationSearchResultTraceDTO, EExperienceType, PagedResponseDeclaredExperienceViewDTO, EAssociationContextType, PagedResponseAssociationSearchResultDeclaredExperienceDTO } from '@/api/avenir-esr';

export const declaredExperienceHandlers = [
  http.get(`*${getGetDeclaredExperienceUrl(':experienceId')}`, ({ params }) => {
    const { experienceId } = params

    return HttpResponse.json<DeclaredExperienceViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateDeclaredExperienceUrl(':experienceId')}`, ({ params }) => {
    const { experienceId } = params

    return HttpResponse.json<DeclaredExperienceViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateDeclaredExperienceWithTracesUrl(':experienceId')}`, ({ params }) => {
    const { experienceId } = params

    return HttpResponse.json<DeclaredExperienceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateDeclaredExperienceWithDeclaredSkillsUrl(':experienceId')}`, ({ params }) => {
    const { experienceId } = params

    return HttpResponse.json<DeclaredExperienceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateDeclaredExperienceUrl()}`, () => {
    return HttpResponse.json<DeclaredExperienceViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredExperiencesUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchTracesForAssociationWithDeclaredExperienceUrl(':experienceId')}`, ({ params, request }) => {
    const { experienceId } = params
    const url = new URL(request.url)
    const isAssociated = url.searchParams.get('isAssociated') === 'true'
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultTraceDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredExperienceAssociationsUrl(':experienceId')}`, ({ params }) => {
    const { experienceId } = params

    return HttpResponse.json<DeclaredExperienceAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredExperienceAssociationsUrl(':experienceId')}`, ({ params }) => {
    const { experienceId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredExperienceViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined
    const isValorized = url.searchParams.get('isValorized') === 'true'
    const experienceType = url.searchParams.get('experienceType') as EExperienceType | null

    return HttpResponse.json<PagedResponseDeclaredExperienceViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchDeclaredExperiencesForAssociationUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const excludeAssociatedWithElementId = url.searchParams.get('excludeAssociatedWithElementId')
    const contextType = url.searchParams.get('contextType') as EAssociationContextType | null
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredExperienceDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
