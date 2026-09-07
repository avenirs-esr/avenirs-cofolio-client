import { http, HttpResponse } from 'msw';
import { getUpdateReflectionUrl, getFinishUrl, getAssociateActivityWithTracesUrl, getAssociateActivityWithDeclaredSkillsUrl, getSubscribeActivityUrl, getGetDeclaredActivityDetailsUrl, getUpdateDeclaredActivityUrl, getGetDeclaredActivitiesViewUrl, getSearchTracesForAssociationWithDeclaredActivityUrl, getGetDeclaredActivityAssociationsUrl, getDeleteDeclaredActivityAssociationsUrl, getSearchDeclaredActivitiesForAssociationUrl, getUnsubscribeActivitiesProgressesUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { DeclaredActivityAssociationsDTO, CreationResponse, DeclaredActivityDetailsDTO, PagedResponseDeclaredActivityViewDTO, PagedResponseAssociationSearchResultTraceDTO, EAssociationContextType, PagedResponseAssociationSearchResultDeclaredActivityDTO } from '@/api/avenir-esr';

export const declaredActivityHandlers = [
  http.put(`*${getUpdateReflectionUrl(':activityId')}`, ({ params }) => {
    const { activityId } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getFinishUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateActivityWithTracesUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json<DeclaredActivityAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAssociateActivityWithDeclaredSkillsUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json<DeclaredActivityAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getSubscribeActivityUrl(':activityId')}`, ({ params }) => {
    const { activityId } = params

    return HttpResponse.json<CreationResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredActivityDetailsUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json<DeclaredActivityDetailsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.patch(`*${getUpdateDeclaredActivityUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDeclaredActivitiesViewUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseDeclaredActivityViewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchTracesForAssociationWithDeclaredActivityUrl(':declaredActivityId')}`, ({ params, request }) => {
    const { declaredActivityId } = params
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

  http.get(`*${getGetDeclaredActivityAssociationsUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json<DeclaredActivityAssociationsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteDeclaredActivityAssociationsUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getSearchDeclaredActivitiesForAssociationUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const excludeAssociatedWithElementId = url.searchParams.get('excludeAssociatedWithElementId')
    const contextType = url.searchParams.get('contextType') as EAssociationContextType | null
    const keyword = url.searchParams.get('keyword')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredActivityDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getUnsubscribeActivitiesProgressesUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
