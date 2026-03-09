import { searchDeclaredExperienceById } from '@/__mocks__/fixtures/student'
import {
  createMockedDeclaredExperiencesPagedResponse,
  createMockedDeclaredExperienceViewDTO,
  declaredExperienceViewDTOFixture
} from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import {
  type DeclaredExperienceViewDTO,
  getCreateDeclaredExperienceUrl,
  getDeleteDeclaredExperiencesUrl,
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

export const createDeclaredExperienceErrorHandler = http.post(`*${getCreateDeclaredExperienceUrl()}`, () => {
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

export const declaredExperienceDetailedNotFoundHandler = http.get(`*${getGetDeclaredExperienceUrl(':experienceId')}`, () => {
  return HttpResponse.json(
    { code: 'DECLARED_EXPERIENCE_NOT_FOUND', message: 'Internal server error' },
    { status: 404 }
  )
})

export const declaredExperiencesHandlers = [
  declaredExperiencesQueryHandler,
  http.get<{ id: string }, DeclaredExperienceViewDTO>(`*${getGetDeclaredExperienceUrl(':id')}`, async ({ params }) => {
    const { id } = params
    const response = createMockedDeclaredExperienceViewDTO(id)
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
  http.post(
    `*${getCreateDeclaredExperienceUrl()}`,
    () => {
      return HttpResponse.json(declaredExperienceViewDTOFixture, { status: 200 })
    }
  ),
  http.put(
    `*${getGetDeclaredExperienceUrl(':experienceId')}`,
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
  http.delete(`*${getDeleteDeclaredExperiencesUrl()}`, async ({ request }) => {
    const declaredProgramIds = await request.json() as string[]

    if (declaredProgramIds.includes('INVALID_PROGRAM_ID')) {
      return HttpResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    if (declaredProgramIds.length === 0) {
      return HttpResponse.json({ error: 'No program IDs provided' }, { status: 400 })
    }

    const response = `${declaredProgramIds.length} program${declaredProgramIds.length > 1 ? 's' : ''} deleted successfully`
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
]

export const declaredExperienceDetailedLoadingHandler = http.get(`*${getGetDeclaredExperienceUrl(':id')}`, async ({ params }) => {
  await delay('infinite')
  const { id } = params as { id: string }
  const experience = searchDeclaredExperienceById(id)
  return HttpResponse.json<DeclaredExperienceViewDTO>(experience, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
