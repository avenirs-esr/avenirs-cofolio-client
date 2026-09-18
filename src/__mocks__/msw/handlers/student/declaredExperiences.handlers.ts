import {
  createMockedDeclaredExperienceAssociationsDTO,
  createMockedSearchExperiencesForAssociationResponse,
  searchDeclaredExperienceById
} from '@/__mocks__/fixtures/student'
import {
  createMockedDeclaredExperiencesPagedResponse,
  createMockedDeclaredExperienceViewDTO,
  declaredExperienceViewDTOFixture
} from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { createMockedSearchTracesForAssociationWithDeclaredExperienceResponse } from '@/__mocks__/fixtures/student/traces.fixtures'
import { searchTracesForAssociationHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { anyAssociationContextType } from '@/__mocks__/msw/utils'
import {
  type AssociationsCreationRequest,
  type AssociationsDTO,
  type DeclaredExperienceViewDTO,
  EAssociationContextType,
  EErrorCode,
  getAssociateUrl,
  getCreateDeclaredExperienceUrl,
  type GetDeclaredExperienceViewParams,
  getDeleteDeclaredExperiencesUrl,
  getGetAssociationsUrl,
  getGetDeclaredExperienceUrl,
  getGetDeclaredExperienceViewUrl,
  getSearchForAssociationUrl,
  getSearchForAssociationWithNewElementUrl,
  getUnassociateUrl,
  type PagedResponseAssociationSearchResultDTO,
  type PagedResponseDeclaredExperienceViewDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { delay, http, HttpResponse, type HttpResponseResolver, type PathParams } from 'msw'

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

export function createDeclaredExperienceViewHandler (
  payload: PagedResponseDeclaredExperienceViewDTO,
  onRequest?: (params: GetDeclaredExperienceViewParams) => void
) {
  return http.get(`*${getGetDeclaredExperienceViewUrl()}`, ({ request }) => {
    if (onRequest) {
      const searchParams = new URL(request.url).searchParams
      onRequest({
        page: searchParams.has('page') ? Number(searchParams.get('page')) : undefined,
        pageSize: searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
        isValorized: searchParams.has('isValorized') ? searchParams.get('isValorized') === 'true' : undefined
      })
    }

    return HttpResponse.json<PagedResponseDeclaredExperienceViewDTO>(payload, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
}

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

export function createDeclaredExperienceHandler (payload: DeclaredExperienceViewDTO = declaredExperienceViewDTOFixture) {
  return http.post(
    `*${getCreateDeclaredExperienceUrl()}`,
    () => {
      return HttpResponse.json(payload, { status: 200 })
    }
  )
}

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
  `*${getGetAssociationsUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId')}`,
  async ({ params }) => {
    await delay('real')

    const { experienceId } = params as { experienceId: string }

    if (experienceId === 'EXP_WITHOUT_ASSOCIATIONS') {
      return HttpResponse.json<AssociationsDTO>(
        { traceAssociations: [], declaredActivityAssociations: [], declaredSkillAssociations: [], declaredExperienceAssociations: [] },
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

    return HttpResponse.json<AssociationsDTO>(mockData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
)

export const declaredExperienceAssociationsQueryErrorHandler = http.get(
  `*${getGetAssociationsUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId')}`,
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

export const deleteDeclaredExperienceAssociationsErrorHandler = http.delete(
  `*${getUnassociateUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId')}`,
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

export const searchTracesForAssociationWithDeclaredExperienceHandler = http.get(
  `*${getSearchForAssociationUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':declaredExperienceId', EAssociationContextType.TRACE)}`,
  async ({ params, request }) => {
    const { declaredExperienceId } = params

    if (!declaredExperienceId || declaredExperienceId === 'INVALID_DECLARED_EXPERIENCE_ID') {
      return HttpResponse.json(
        { code: EErrorCode.DECLARED_EXPERIENCE_NOT_FOUND, message: 'Declared experience not found' },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const url = new URL(request.url)

    const keyword = url.searchParams.get('keyword') ?? undefined
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '20')

    const response = createMockedSearchTracesForAssociationWithDeclaredExperienceResponse({
      keyword,
      page,
      pageSize
    })

    return HttpResponse.json<PagedResponseAssociationSearchResultDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
)

export const searchTracesForAssociationWithDeclaredExperienceErrorHandler = http.get(
  `*${getSearchForAssociationUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':declaredExperienceId', EAssociationContextType.TRACE)}`,
  async () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
)

export function createAssociateDeclaredExperienceWithTracesHandler (
  onRequest?: (request: AssociationsCreationRequest) => void
) {
  return http.post<PathParams, AssociationsCreationRequest>(
    `*${getAssociateUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId', EAssociationContextType.TRACE)}`,
    async ({ params, request }) => {
      const { experienceId } = params

      if (!experienceId || experienceId === 'INVALID_EXPERIENCE_ID') {
        return HttpResponse.json(
          { code: EErrorCode.DECLARED_EXPERIENCE_NOT_FOUND, message: 'Declared experience not found' },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }

      const body = await request.json()
      onRequest?.(body)

      const response = createMockedDeclaredExperienceAssociationsDTO()

      return HttpResponse.json<AssociationsDTO>(response, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  )
}

export const associateDeclaredExperienceWithTracesHandler = createAssociateDeclaredExperienceWithTracesHandler()

export const associateDeclaredExperienceWithTracesErrorHandler = http.post(
  `*${getAssociateUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId', EAssociationContextType.TRACE)}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
)

export const associateDeclaredExperienceWithDeclaredSkillsErrorHandler = http.post(
  `*${getAssociateUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId', EAssociationContextType.DECLARED_SKILL)}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
)

export function createAssociateDeclaredExperienceWithDeclaredSkillsHandler (
  onRequest?: (request: AssociationsCreationRequest) => void
) {
  return http.post(
    `*${getAssociateUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId', EAssociationContextType.DECLARED_SKILL)}`,
    async ({ params, request }) => {
      const { experienceId } = params

      if (!experienceId || experienceId === 'INVALID_EXPERIENCE_ID') {
        return HttpResponse.json(
          { code: EErrorCode.DECLARED_EXPERIENCE_NOT_FOUND, message: 'Declared experience not found' },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }

      const body = await request.json() as AssociationsCreationRequest
      onRequest?.(body)

      const response = createMockedDeclaredExperienceAssociationsDTO()

      return HttpResponse.json<AssociationsDTO>(response, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  )
}

export const associateDeclaredExperienceWithDeclaredSkillsHandler = createAssociateDeclaredExperienceWithDeclaredSkillsHandler()

const resolveSearchDeclaredExperiencesForAssociation: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword') ?? undefined
  const page = Number(url.searchParams.get('page') ?? 0)
  const pageSize = Number(url.searchParams.get('pageSize') ?? 100)
  const response = createMockedSearchExperiencesForAssociationResponse({ keyword, page, pageSize })

  return HttpResponse.json<PagedResponseAssociationSearchResultDTO>(response, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const declaredExperiencesHandlers = [
  declaredExperiencesQueryHandler,
  http.get(
    `*${getSearchForAssociationUrl(anyAssociationContextType, ':elementId', EAssociationContextType.DECLARED_EXPERIENCE)}`,
    resolveSearchDeclaredExperiencesForAssociation
  ),
  http.get(
    `*${getSearchForAssociationWithNewElementUrl(anyAssociationContextType, EAssociationContextType.DECLARED_EXPERIENCE)}*`,
    resolveSearchDeclaredExperiencesForAssociation
  ),
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
  createDeclaredExperienceHandler(),
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
  declaredExperienceAssociationsQueryHandler,
  searchTracesForAssociationWithDeclaredExperienceHandler,
  searchTracesForAssociationHandler,
  associateDeclaredExperienceWithTracesHandler,
  associateDeclaredExperienceWithDeclaredSkillsHandler,
  http.delete(
    `*${getUnassociateUrl(EAssociationContextType.DECLARED_EXPERIENCE, ':experienceId')}`,
    async ({ params }) => {
      const { experienceId } = params as { experienceId: string }

      if (experienceId === 'INVALID_EXPERIENCE_ID') {
        return HttpResponse.json(
          { code: ErrorCodes.DECLARED_EXPERIENCE_NOT_FOUND, message: 'Internal server error' },
          { status: 404 }
        )
      }

      return new HttpResponse(null, { status: 204 })
    }
  )
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
  `*${getSearchForAssociationUrl(anyAssociationContextType, ':elementId', EAssociationContextType.DECLARED_EXPERIENCE)}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal Server Error', code: ErrorCodes.SERVER },
      { status: 500 }
    )
  }
)
