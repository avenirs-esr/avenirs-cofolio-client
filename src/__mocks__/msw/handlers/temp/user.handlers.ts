import { http, HttpResponse } from 'msw';
import { getUpdateProfileUrl, getUploadProfilePictureUrl, getDeleteProfilePictureUrl, getUploadCoverPictureUrl, getDeleteCoverPictureUrl, getUpdateNotificationPreferencesUrl, getGetMeUrl, getGetQuickLinksUrl, getGetProfileUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { EUserCategory, FileDTO, LoggedInUserDTO, QuickLinksDTO, ProfileOverviewDTO } from '@/api/avenir-esr';

export const userHandlers = [
  http.put(`*${getUpdateProfileUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const { userCategory } = params

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getUploadProfilePictureUrl(':userCategory' as EUserCategory)}`, async ({ params, request }) => {
    const { userCategory } = params
    const formData = await request.formData()
    const file = formData.get('file') as File

    return HttpResponse.json<FileDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteProfilePictureUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const { userCategory } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getUploadCoverPictureUrl(':userCategory' as EUserCategory)}`, async ({ params, request }) => {
    const { userCategory } = params
    const formData = await request.formData()
    const file = formData.get('file') as File

    return HttpResponse.json<FileDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteCoverPictureUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const { userCategory } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.patch(`*${getUpdateNotificationPreferencesUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetMeUrl()}`, () => {
    return HttpResponse.json<LoggedInUserDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetQuickLinksUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const { userCategory } = params

    return HttpResponse.json<QuickLinksDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetProfileUrl(':userCategory' as EUserCategory)}`, ({ params }) => {
    const { userCategory } = params

    return HttpResponse.json<ProfileOverviewDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
