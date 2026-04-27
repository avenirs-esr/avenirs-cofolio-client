import { createDeclaredSkillAssociationResponseFixture } from '@/__mocks__/fixtures/student'
import {
  createMockedAllSkillListItemDTO,
  createMockedDeclaredSkillProgressDetailsDTO,
  createMockedPagedResponseAssociationSearchResultDeclaredSkillIDTO,
  createMockedPagedResponseDeclaredSkillProgressDTO,
  createMockedPagedResponseSkillsDTO,
  createMockedSearchExternalSkillsDTO,
  mockedDeclaredSkillAssociations,
  mockedSkillDetailed
} from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type AddDeclaredSkillDTO,
  type AdditionalSkillConfigurationDTO,
  type AssociationsCreationRequest,
  type DeclaredSkillAssociationsDTO,
  type DeclaredSkillProgressDetailsDTO,
  type DeclaredSkillProgressDTO,
  EDeclaredSkillLevel,
  EExternalSkillType,
  getAssociateDeclaredSkillWithDeclaredActivitiesUrl,
  getCreateDeclaredSkillProgressUrl,
  getDeleteDeclaredSkillProgressUrl,
  getGetAdditionalSkillConfigUrl,
  getGetAllSkillsUrl,
  getGetDeclaredSkillProgressDetailsUrl,
  getGetDeclaredSkillsProgressesUrl,
  getGetDeclaredSkillWithDeclaredActivitiesUrl,
  getGetDetailedSkillUrl,
  getGetSkillLevelProgressesUrl,
  getSearchDeclaredSkillsForAssociationUrl,
  getUnassociateTracesUrl,
  getUpdateDeclaredSkillProgressUrl,
  type PagedResponseAssociationSearchResultDeclaredSkillIDTO,
  type PagedResponseDeclaredSkillProgressDTO,
  type PagedResponseExternalSkillDTO,
  type PagedResponseSkillDTO,
  type SkillDetailedDTO,
  type SkillListItemDTO
} from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { delay, http, HttpResponse, type PathParams } from 'msw'

const INVALID_DECLARED_SKILL_ID = 'INVALID_DECLARED_SKILL_ID'

export function createDeclaredSkillsProgressViewHandler (payload: PagedResponseDeclaredSkillProgressDTO) {
  return http.get(`*${getGetDeclaredSkillsProgressesUrl()}`, () => {
    return HttpResponse.json<PagedResponseDeclaredSkillProgressDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createSkillsViewHandler (payload: PagedResponseSkillDTO) {
  return http.get(`*${getGetSkillLevelProgressesUrl()}`, () => {
    return HttpResponse.json<PagedResponseSkillDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createAllSkillsHandler (payload: SkillListItemDTO[]) {
  return http.get(`*${getGetAllSkillsUrl()}`, () => {
    return HttpResponse.json<SkillListItemDTO[]>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createDetailedSkillHandler (payload: SkillDetailedDTO) {
  return http.get(`*${getGetDetailedSkillUrl(':id')}`, () => {
    return HttpResponse.json<SkillDetailedDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const detailedSkillNotFoundErrorHandler = http.get(`*${getGetDetailedSkillUrl(':id')}`, () => {
  return HttpResponse.json(
    { code: 'SKILL_NOT_FOUND', message: 'Internal server error' },
    { status: 404 }
  )
})

export const detailedSkillProgressNotFoundErrorHandler = http.get(`*${getGetDeclaredSkillProgressDetailsUrl(':id')}`, () => {
  return HttpResponse.json(
    { code: 'DECLARED_SKILL_PROGRESS_NOT_FOUND', message: 'Internal server error' },
    { status: 404 }
  )
})

export const searchDeclaredSkillsForAssociationErrorHandler = http.get(
  `*${getSearchDeclaredSkillsForAssociationUrl()}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
)

export const searchDeclaredSkillsForAssociationHandler = http.get(
  `*${getSearchDeclaredSkillsForAssociationUrl()}*`,
  ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''
    const pageSize = Number(searchParams.get('pageSize') ?? 100)
    const page = Number(searchParams.get('page') ?? 0)

    const response = createMockedPagedResponseAssociationSearchResultDeclaredSkillIDTO(
      pageSize,
      page,
      keyword
    )

    return HttpResponse.json<PagedResponseAssociationSearchResultDeclaredSkillIDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
)

export const associateDeclaredSkillWithDeclaredActivityErrorHandler = http.post(
  `*${getAssociateDeclaredSkillWithDeclaredActivitiesUrl(':declaredSkillProgressId')}`,
  () => {
    return HttpResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
)

export const associateDeclaredSkillWithDeclaredActivityHandler = http.post<
  { declaredSkillProgressId: string },
  AssociationsCreationRequest
>(
  `*${getAssociateDeclaredSkillWithDeclaredActivitiesUrl(':declaredSkillProgressId')}`,
  async ({ request, params }) => {
    const body = await request.json()
    const { declaredSkillProgressId } = params
    await delay(100)

    if (declaredSkillProgressId === 'INVALID_SKILL_ID') {
      return HttpResponse.json(
        { code: 'DECLARED_SKILL_PROGRESS_NOT_FOUND', message: 'Internal server error' },
        { status: 404 }
      )
    }

    const response: DeclaredSkillAssociationsDTO = createDeclaredSkillAssociationResponseFixture(body)

    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }
)

export const skillsHandlers = [
  http.get<PathParams, PagedResponseSkillDTO>(`*${getGetSkillLevelProgressesUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const sort = searchParams.get('sort') ?? ''

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedPagedResponseSkillsDTO(pageSize, 20, page, sort)

    return HttpResponse.json<PagedResponseSkillDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, PagedResponseDeclaredSkillProgressDTO>(`*${getGetDeclaredSkillsProgressesUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedPagedResponseDeclaredSkillProgressDTO(pageSize, 20, page)

    return HttpResponse.json<PagedResponseDeclaredSkillProgressDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, PagedResponseExternalSkillDTO>(`*/interoperability/external-skills/search`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedSearchExternalSkillsDTO(pageSize, 20, page, keyword)

    return HttpResponse.json<PagedResponseExternalSkillDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, AdditionalSkillConfigurationDTO>(`*${getGetAdditionalSkillConfigUrl()}`, () => {
    const mockConfig: AdditionalSkillConfigurationDTO = {
      [EDeclaredSkillLevel.BEGINNER]: {
        label: 'Débutant',
        description: 'Je découvre cette compétence'
      },
      [EDeclaredSkillLevel.INTERMEDIATE]: {
        label: 'Intermédiaire',
        description: 'Je commence à maîtriser cette compétence'
      },
      [EDeclaredSkillLevel.COMPETENT]: {
        label: 'Compétent',
        description: 'Je maîtrise cette compétence'
      },
      [EDeclaredSkillLevel.ADVANCED]: {
        label: 'Avancé',
        description: 'Je maîtrise bien cette compétence'
      },
      [EDeclaredSkillLevel.EXPERT]: {
        label: 'Expert',
        description: 'Je maîtrise parfaitement cette compétence'
      }
    }

    return HttpResponse.json<AdditionalSkillConfigurationDTO>(mockConfig, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, SkillDetailedDTO>(`*/me/skill-level-progress/details/:skillId`, async () => {
    await delay(100)
    return HttpResponse.json(mockedSkillDetailed, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, SkillListItemDTO[]>(`*${getGetAllSkillsUrl()}`, async () => {
    const response = createMockedAllSkillListItemDTO()
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
  searchDeclaredSkillsForAssociationHandler,
  http.get<{ id: string }, DeclaredSkillProgressDetailsDTO>(`*${getGetDeclaredSkillProgressDetailsUrl(':id')}`, async ({ params }) => {
    const { id } = params
    const response = createMockedDeclaredSkillProgressDetailsDTO(id)
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put<{ id: string }, DeclaredSkillProgressDetailsDTO>(`*${getUpdateDeclaredSkillProgressUrl(':id')}`, async ({ params }) => {
    const { id } = params

    if (!id) {
      return HttpResponse.json({ error: 'Declared skill progress ID is required' }, { status: 400 })
    }

    if (id === INVALID_DECLARED_SKILL_ID) {
      return HttpResponse.json(
        { code: 'DECLARED_SKILL_PROGRESS_NOT_FOUND', message: 'Internal server error' },
        { status: 404 }
      )
    }

    const response = createMockedDeclaredSkillProgressDetailsDTO(id)
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.delete<{ declaredSkillProgressId: string }>(`*${getDeleteDeclaredSkillProgressUrl(':declaredSkillProgressId')}`, async ({ params }) => {
    const { declaredSkillProgressId } = params

    if (declaredSkillProgressId === 'INVALID_SKILL_ID') {
      return HttpResponse.json({ error: 'Invalid skill ID' }, { status: 400 })
    }

    const response = `Skill progress with id ${declaredSkillProgressId} deleted successfully`
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post<PathParams, AddDeclaredSkillDTO>(`*${getCreateDeclaredSkillProgressUrl()}`, async ({ request }) => {
    const body = await request.json()
    await delay(100)

    if (body.id === 'EXISTING_SKILL_ID') {
      return HttpResponse.json(
        { code: 'DECLARED_SKILL_PROGRESS_ALREADY_EXISTS', message: 'Internal server error' },
        { status: 400 }
      )
    }

    const response: DeclaredSkillProgressDTO = {
      id: body.id ?? crypto.randomUUID(),
      title: `Mocked Skill ${body.id}`,
      pathSegments: ['Category', 'Subcategory'],
      type: body.type ?? EExternalSkillType.ROME4,
      level: body.level ?? EDeclaredSkillLevel.INTERMEDIATE,
      reflection: body.reflection ?? 'Mocked skill reflection'
    }

    return HttpResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*${getUnassociateTracesUrl(':declaredSkillProgressId')}`, () => {
    return HttpResponse.json<string>('success', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
  associateDeclaredSkillWithDeclaredActivityHandler,

  http.get<{ declaredSkillProgressId: string }, DeclaredSkillAssociationsDTO>(
    `*${getGetDeclaredSkillWithDeclaredActivitiesUrl(':declaredSkillProgressId')}`,
    ({ params }) => {
      if (params.declaredSkillProgressId === INVALID_DECLARED_SKILL_ID) {
        return HttpResponse.json({ error: 'Invalid declared skill ID' }, { status: 400 })
      }

      if (params.declaredSkillProgressId === 'SKILL_WITHOUT_ASSOCIATIONS') {
        return HttpResponse.json<DeclaredSkillAssociationsDTO>(
          { traceAssociations: [], declaredActivityAssociations: [] },
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return HttpResponse.json<DeclaredSkillAssociationsDTO>(mockedDeclaredSkillAssociations, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      })
    }
  ),
]
