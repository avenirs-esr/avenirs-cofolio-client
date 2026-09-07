import { http, HttpResponse } from 'msw';
import { getGetInstitutionConfigUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { InstitutionConfigurationElements } from '@/api/avenir-esr';

export const institutionConfigHandlers = [
  http.get(`*${getGetInstitutionConfigUrl(':institutionId')}`, ({ params }) => {
    const { institutionId } = params

    return HttpResponse.json<InstitutionConfigurationElements>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
