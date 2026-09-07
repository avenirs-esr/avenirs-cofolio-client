import { http, HttpResponse } from 'msw';
import { getGetExternalUsersUrl, getUpdateAllUrl, getCreateAllUrl, getActivateExternalUserByEppnUrl, getGetExternalUserByIdUrl, getDeleteUrl, getGetExternalUserByEppnUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { ExternalUserDTO[], ExternalUserImportSummaryResponse, ExternalUserDTO } from '@/api/avenir-esr';

export const externalUserHandlers = [
  http.get(`*${getGetExternalUsersUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const institutionId = url.searchParams.get('institutionId')
    const groupId = url.searchParams.get('groupId')

    return HttpResponse.json<ExternalUserDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.put(`*${getUpdateAllUrl()}`, () => {
    return HttpResponse.json<ExternalUserDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getCreateAllUrl()}`, () => {
    return HttpResponse.json<ExternalUserImportSummaryResponse>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.patch(`*${getActivateExternalUserByEppnUrl(':eppn')}`, ({ params }) => {
    const { eppn } = params

    return HttpResponse.json<ExternalUserDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetExternalUserByIdUrl(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json<ExternalUserDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteUrl(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetExternalUserByEppnUrl(':eppn')}`, ({ params }) => {
    const { eppn } = params

    return HttpResponse.json<ExternalUserDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
