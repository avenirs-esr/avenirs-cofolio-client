import { http, HttpResponse } from 'msw';
import { getRunTableUrl, getRunUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';

export const seedingAdminHandlers = [
  http.post(`*${getRunTableUrl(':table')}`, ({ params, request }) => {
    const { table } = params
    const url = new URL(request.url)
    const overwrite = url.searchParams.get('overwrite') === 'true'

    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getRunUrl()}`, () => {
    return HttpResponse.json(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
