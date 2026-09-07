import { http, HttpResponse } from 'msw';
import { getGetTraceConfigUrl, getPostTraceConfigUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { TraceConfigurationDTO } from '@/api/avenir-esr';

export const traceConfigurationHandlers = [
  http.get(`*${getGetTraceConfigUrl()}`, () => {
    return HttpResponse.json<TraceConfigurationDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getPostTraceConfigUrl()}`, () => {
    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
