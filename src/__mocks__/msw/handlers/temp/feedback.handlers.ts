import { http, HttpResponse } from 'msw';
import { getUpdateFeedbackUrl, getSubmitFeedbackUrl, getUploadFeedbackAttachmentUrl, getAskForFeedbackUrl, getGetStaffFeedbacksUrl, getGetFeedbackDetailsUrl, getDownloadFeedbackAttachmentUrl, getGetFeedbackHistoryUrl, getGetFeedbacksByActivityUrl, getGetFeedbackDashboardUrl, getDeleteFeedbackAttachmentUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { FileDTO, FeedbackDetailsDTO, EFeedbackStatus, PagedResponseFeedbackStaffListItemDTO, 'STAFF' | 'STUDENT', Blob, FeedbackOverviewDTO[], StudentFeedbackItemListDTO[], FeedbackDashboardDTO } from '@/api/avenir-esr';

export const feedbackHandlers = [
  http.put(`*${getUpdateFeedbackUrl(':feedbackId')}`, ({ params }) => {
    const { feedbackId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getSubmitFeedbackUrl(':feedbackId')}`, ({ params }) => {
    const { feedbackId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getUploadFeedbackAttachmentUrl(':feedbackId')}`, async ({ params, request }) => {
    const { feedbackId } = params
    const formData = await request.formData()
    const file = formData.get('file') as File

    return HttpResponse.json<FileDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getAskForFeedbackUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json<FeedbackDetailsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetStaffFeedbacksUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const statusesParam = url.searchParams.getAll('statuses')
    const statuses = statusesParam.length > 0 ? (statusesParam as EFeedbackStatus[]) : undefined
    const activityId = url.searchParams.get('activityId')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseFeedbackStaffListItemDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetFeedbackDetailsUrl(':userCategory' as 'STAFF' | 'STUDENT', ':feedbackId')}`, ({ params }) => {
    const { userCategory, feedbackId } = params

    return HttpResponse.json<FeedbackDetailsDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getDownloadFeedbackAttachmentUrl(':feedbackId', ':attachmentId')}`, ({ params }) => {
    const { feedbackId, attachmentId } = params

    return HttpResponse.json<Blob>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetFeedbackHistoryUrl(':declaredActivityId')}`, ({ params }) => {
    const { declaredActivityId } = params

    return HttpResponse.json<FeedbackOverviewDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetFeedbacksByActivityUrl(':activityId')}`, ({ params }) => {
    const { activityId } = params

    return HttpResponse.json<StudentFeedbackItemListDTO[]>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetFeedbackDashboardUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const activityId = url.searchParams.get('activityId')

    return HttpResponse.json<FeedbackDashboardDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.delete(`*${getDeleteFeedbackAttachmentUrl(':feedbackId', ':attachmentId')}`, ({ params }) => {
    const { feedbackId, attachmentId } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
