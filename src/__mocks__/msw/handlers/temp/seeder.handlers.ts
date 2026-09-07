import { http, HttpResponse } from 'msw';
import { getResetAndSeedUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';

export const seederHandlers = [
  http.post(`*${getResetAndSeedUrl()}`, () => {
    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
