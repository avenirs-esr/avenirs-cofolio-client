import {
  createMockedDeclaredExperiencesPagedResponse,
  declaredExperienceViewDTOFixture
} from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import {
  type DeclaredExperienceViewDTO,
  getCreateDeclaredExperienceUrl,
  getGetDeclaredExperienceUrl,
  getGetDeclaredExperienceViewUrl,
  type PagedResponseDeclaredExperienceViewDTO
} from '@/api/avenir-esr'
import { delay, http, HttpResponse } from 'msw'

export const declaredExperiencesQueryHandler = http.get(`*${getGetDeclaredExperienceViewUrl()}`, async ({ request }) => {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') ?? '0')
  const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

  await delay('real')
  const mockData = createMockedDeclaredExperiencesPagedResponse(pageSize, 60, page)

  return HttpResponse.json<PagedResponseDeclaredExperienceViewDTO>(mockData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

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

export const declaredExperienceDetailedQueryErrorHandler = http.get(`*${getGetDeclaredExperienceUrl(':experienceId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const declaredExperiencesHandlers = [
  declaredExperiencesQueryHandler,
  http.post(
    `*${getCreateDeclaredExperienceUrl()}`,
    () => {
      return HttpResponse.json(declaredExperienceViewDTOFixture, { status: 200 })
    }
  ),
  http.get(`*${getGetDeclaredExperienceUrl(':experienceId')}`, async () => {
    await delay('real')
    const mockData = declaredExperienceViewDTOFixture

    return HttpResponse.json<DeclaredExperienceViewDTO>(mockData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
]
