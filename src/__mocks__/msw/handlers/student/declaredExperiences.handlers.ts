import {
  createMockedDeclaredExperiencesPagedResponse,
  declaredExperienceViewDTOFixture
} from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import {
  getCreateDeclaredExperienceUrl,
  getGetDeclaredExperienceViewUrl,
  type PagedResponseDeclaredExperienceViewDTO
} from '@/api/avenir-esr'
import { delay, http, HttpResponse } from 'msw'

export const declaredExperiencesQueryErrorHandler = http.get(`*${getGetDeclaredExperienceViewUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const declaredExperiencesQueryEmptyHandler = http.get(`*${getGetDeclaredExperienceViewUrl()}`, async ({ request }) => {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') ?? '0')
  const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

  await delay('real')
  const mockData = createMockedDeclaredExperiencesPagedResponse(pageSize, 0, page)

  return HttpResponse.json<PagedResponseDeclaredExperienceViewDTO>(mockData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredExperiencesHandlers = [
  http.get(`*${getGetDeclaredExperienceViewUrl()}`, async ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

    await delay('real')
    const mockData = createMockedDeclaredExperiencesPagedResponse(pageSize, 5, page)

    return HttpResponse.json<PagedResponseDeclaredExperienceViewDTO>(mockData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
  http.post(
    `*${getCreateDeclaredExperienceUrl()}`,
    () => {
      return HttpResponse.json(declaredExperienceViewDTOFixture, { status: 200 })
    }
  )
]
