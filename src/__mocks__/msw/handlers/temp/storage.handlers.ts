import { http, HttpResponse } from 'msw';
import { getGetResourceByFileIdUrl, getGetDefaultProfilePictureUrl, getGetDefaultCoverPictureUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { Blob } from '@/api/avenir-esr';

export const storageHandlers = [
  http.get(`*${getGetResourceByFileIdUrl(':fileId')}`, ({ params }) => {
    const { fileId } = params

    return HttpResponse.json<Blob>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDefaultProfilePictureUrl()}`, () => {
    return HttpResponse.json<Blob>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetDefaultCoverPictureUrl()}`, () => {
    return HttpResponse.json<Blob>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
