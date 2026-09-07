import { http, HttpResponse } from 'msw';
import { getGetBuildLifeProjectConfigWithAllTranslationsUrl, getPostBuildLifeProjectConfigUrl, getGetBuildLifeProjectConfigUrl } from '@/api/avenir-esr';
import { HttpStatusCode } from '@/common/utils';
import type { GetBuildLifeProjectConfigWithAllTranslations200, BuildLifeProjectConfigDTO } from '@/api/avenir-esr';

export const websiteContentHandlers = [
  http.get(`*${getGetBuildLifeProjectConfigWithAllTranslationsUrl()}`, () => {
    return HttpResponse.json<GetBuildLifeProjectConfigWithAllTranslations200>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.post(`*${getPostBuildLifeProjectConfigUrl()}`, () => {
    return HttpResponse.json({
      status: HttpStatusCode.NO_CONTENT,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

  http.get(`*${getGetBuildLifeProjectConfigUrl()}`, () => {
    return HttpResponse.json<BuildLifeProjectConfigDTO>(null, {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' },
    })
  }),

];
