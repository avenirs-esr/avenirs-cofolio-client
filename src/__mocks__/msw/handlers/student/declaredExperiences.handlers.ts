import { createMockedDeclaredExperienceAssociationsDTO, createMockedSearchExperiencesForAssociationResponse, searchDeclaredExperienceById } from '@/__mocks__/fixtures/student'
import {
  createMockedDeclaredExperiencesPagedResponse,
  createMockedDeclaredExperienceViewDTO,
  declaredExperienceViewDTOFixture
} from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import {
  type DeclaredExperienceAssociationsDTO,
  type DeclaredExperienceViewDTO,
  getCreateDeclaredExperienceUrl,
  getDeleteDeclaredExperiencesUrl,
  getGetDeclaredExperienceAssociationsUrl,
  getGetDeclaredExperienceUrl,
  getGetDeclaredExperienceViewUrl,
  getSearchDeclaredExperiencesForAssociationUrl,
  type PagedResponseAssociationSearchResultDeclaredExperienceDTO,
  type PagedResponseDeclaredExperienceViewDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const createDeclaredExperienceErrorHandler = http.post(`*${getCreateDeclaredExperienceUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const declaredExperienceDetailedNotFoundHandler = http.get(`*${getGetDeclaredExperienceUrl(':experienceId')}`, () => {
  return HttpResponse.json(
    { code: ErrorCodes.DECLARED_EXPERIENCE_NOT_FOUND, message: 'Internal server error' },
    { status: 404 }
  )
})

export const declaredExperienceAssociationsQueryHandler = http.get(
  `*${getGetDeclaredExperienceAssociationsUrl(':experienceId')}`,
  async ({ params }) => {
    await delay('real')

    const { experienceId } = params as { experienceId: string }

    if (experienceId === 'EXP_WITHOUT_ASSOCIATIONS') {
      return HttpResponse.json<DeclaredExperienceAssociationsDTO>(
        { traceAssociations: [], declaredSkillAssociations: [] },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (experienceId === 'INVALID_SKILL_ID') {
      return HttpResponse.json(
        { code: ErrorCodes.DECLARED_EXPERIENCE_NOT_FOUND, message: 'Internal server error' },
        { status: 404 }
      )
    }

    const mockData = createMockedDeclaredExperienceAssociationsDTO()

    return HttpResponse.json<DeclaredExperienceAssociationsDTO>(mockData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
)

export const declaredExperienceAssociationsQueryErrorHandler = http.get(
  `*${getGetDeclaredExperienceAssociationsUrl(':experienceId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
)

export const declaredExperiencesHandlers = [
  declaredExperiencesQueryHandler,
  http.get(`*${getSearchDeclaredExperiencesForAssociationUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword') ?? undefined
    const page = Number(url.searchParams.get('page') ?? 0)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 100)
    const response = createMockedSearchExperiencesForAssociationResponse({ keyword, page, pageSize })
    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredExperienceDTO>(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),
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
      return HttpResponse.json({ error: 'Invalid program ID', code: ErrorCodes.DECLARED_EXPERIENCE_NOT_FOUND }, { status: 404 })
    }

    if (declaredProgramIds.length === 0) {
      return HttpResponse.json({ error: 'No program IDs provided', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    const response = `${declaredProgramIds.length} program${declaredProgramIds.length > 1 ? 's' : ''} deleted successfully`
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
  declaredExperienceAssociationsQueryHandler
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

export const searchDeclaredExperiencesForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredExperiencesForAssociationUrl()}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)
