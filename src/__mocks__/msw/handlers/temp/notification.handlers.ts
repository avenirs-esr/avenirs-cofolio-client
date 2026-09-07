import { http, HttpResponse } from 'msw';
import { getMarkAsSeenUrl, getGetNotificationsUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { EUserCategory, PagedResponseNotificationDTO } from '@/api/avenir-esr';

export const notificationHandlers = [
  http.patch(`*${getMarkAsSeenUrl(':id')}`, ({ params }) => {
    const { id } = params

    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetNotificationsUrl(':userCategory' as EUserCategory)}`, ({ params, request }) => {
    const { userCategory } = params
    const url = new URL(request.url)
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number(pageParam) : undefined
    const pageSizeParam = url.searchParams.get('pageSize')
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined

    return HttpResponse.json<PagedResponseNotificationDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
