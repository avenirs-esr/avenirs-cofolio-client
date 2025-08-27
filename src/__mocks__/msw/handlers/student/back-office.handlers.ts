import { mockedBuildLifeProjectConfigResponse } from '@/__mocks__/fixtures/student/back-office.fixtures'
import { type BuildLifeProjectConfigDTO, getGetBuildLifeProjectConfigUrl } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const backOfficeHandlers = [
  http.get(`*${getGetBuildLifeProjectConfigUrl()}`, () => {
    return HttpResponse.json<BuildLifeProjectConfigDTO>(mockedBuildLifeProjectConfigResponse, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
]
