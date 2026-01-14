import {
  createMockedAllSkillListItemDTO,
  createMockedDeclaredSkillProgressDetailsDTO,
  createMockedPagedResponseDeclaredSkillProgressDTO,
  createMockedPagedResponseSkillsDTO,
  createMockedSearchDeclaredSkillsDTO,
  mockedSkillDetailed
} from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type AddDeclaredSkillDTO,
  type AdditionalSkillConfigurationDTO,
  type DeclaredSkillProgressDetailsDTO,
  type DeclaredSkillProgressDTO,
  EDeclaredSkillLevel,
  EExternalSkillType,
  getCreateDeclaredSkillProgressUrl,
  getGetAdditionalSkillConfigUrl,
  getGetAllSkillsUrl,
  getGetDeclaredSkillProgressDetailsUrl,
  getGetDeclaredSkillsProgressesUrl,
  getGetSkillLevelProgressesUrl,
  getUnassociateTracesUrl,
  getUpdateDeclaredSkillProgressUrl,
  type PagedResponseDeclaredSkillDTO,
  type PagedResponseDeclaredSkillProgressDTO,
  type PagedResponseSkillDTO,
  type SkillDetailedDTO,
  type SkillListItemDTO
} from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { delay, http, HttpResponse, type PathParams } from 'msw'

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

export function createSkillDetailedHandler (payload: SkillDetailedDTO) {
  return http.get<PathParams, SkillDetailedDTO>(`*/me/skill-level-progress/details/:skillId`, () => {
    return HttpResponse.json<SkillDetailedDTO>(payload, {
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

export const skillsViewErrorHandler = http.get(`*${getGetSkillLevelProgressesUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

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

  http.get<PathParams, PagedResponseDeclaredSkillDTO>(`*/declared-skills/search`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedSearchDeclaredSkillsDTO(pageSize, 20, page, keyword)

    return HttpResponse.json<PagedResponseDeclaredSkillDTO>(response, {
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
    const response = createMockedDeclaredSkillProgressDetailsDTO(id)
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

    const response: DeclaredSkillProgressDTO = {
      id: body.id ?? crypto.randomUUID(),
      title: `Mocked Skill ${body.id}`,
      pathSegments: ['Category', 'Subcategory'],
      type: body.type ?? EExternalSkillType.ROME4,
      level: body.level ?? EDeclaredSkillLevel.INTERMEDIATE,
      description: body.description ?? 'Mocked skill description'
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
]
