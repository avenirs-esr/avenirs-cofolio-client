import { http, HttpResponse } from 'msw';
import { getGetAdditionalSkillConfigWithAllTranslationsUrl, getPostAdditionalSkillConfigUrl, getGetAdditionalSkillConfigUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { GetAdditionalSkillConfigWithAllTranslations200, AdditionalSkillConfigurationDTO } from '@/api/avenir-esr';

export const additionalSkillConfigHandlers = [
  http.get(`*${getGetAdditionalSkillConfigWithAllTranslationsUrl()}`, () => {
    return HttpResponse.json<GetAdditionalSkillConfigWithAllTranslations200>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getPostAdditionalSkillConfigUrl()}`, () => {
    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetAdditionalSkillConfigUrl()}`, () => {
    return HttpResponse.json<AdditionalSkillConfigurationDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
