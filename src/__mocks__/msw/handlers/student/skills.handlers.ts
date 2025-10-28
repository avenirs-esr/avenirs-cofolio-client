import {
  createMockedAdditionalSkillProgressDetailsDTO,
  createMockedAllSkillListItemDTO,
  createMockedPagedResponseAdditionalSkillsDTO,
  createMockedPagedResponseSkillsDTO,
  createMockedSearchAdditionalSkillsDTO,
  mockedSkillDetailed
} from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type AdditionalSkillConfigurationDTO,
  type AdditionalSkillProgressDetailsDTO,
  EAdditionalSkillLevel,
  getGetAdditionalSkillConfigUrl,
  getGetAdditionalSkillProgressDetailsUrl,
  getGetAllSkillsUrl,
  getGetSkillLevelProgressesUrl,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseSkillDTO,
  type SkillDetailedDTO,
  type SkillListItemDTO
} from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { delay, http, HttpResponse, type PathParams } from 'msw'

export function createAdditionalSkillsViewHandler (payload: PagedResponseAdditionalSkillDTO) {
  return http.get(`*/me/additional-skills`, () => {
    return HttpResponse.json<PagedResponseAdditionalSkillDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const skillsAdditionalViewErrorHandler = http.get(`*/me/additional-skills`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

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

  http.get<PathParams, PagedResponseAdditionalSkillDTO>(`*/me/additional-skills`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedPagedResponseAdditionalSkillsDTO(pageSize, 20, page, keyword)

    return HttpResponse.json<PagedResponseAdditionalSkillDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, PagedResponseAdditionalSkillDTO>(`*/me/additional-skills/search`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const keyword = searchParams.get('keyword') ?? ''

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedSearchAdditionalSkillsDTO(pageSize, 20, page, keyword)

    return HttpResponse.json<PagedResponseAdditionalSkillDTO>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, AdditionalSkillConfigurationDTO>(`*${getGetAdditionalSkillConfigUrl()}`, () => {
    const mockConfig: AdditionalSkillConfigurationDTO = {
      [EAdditionalSkillLevel.BEGINNER]: {
        label: 'Débutant',
        description: 'Je découvre cette compétence'
      },
      [EAdditionalSkillLevel.INTERMEDIATE]: {
        label: 'Intermédiaire',
        description: 'Je commence à maîtriser cette compétence'
      },
      [EAdditionalSkillLevel.COMPETENT]: {
        label: 'Compétent',
        description: 'Je maîtrise cette compétence'
      },
      [EAdditionalSkillLevel.ADVANCED]: {
        label: 'Avancé',
        description: 'Je maîtrise bien cette compétence'
      },
      [EAdditionalSkillLevel.EXPERT]: {
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

  http.post(`*/me/additional-skills`, async () => {
    await delay(100)
    return HttpResponse.json(null, {
      status: 201,
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

  http.get<{ id: string }, AdditionalSkillProgressDetailsDTO>(`*${getGetAdditionalSkillProgressDetailsUrl(':id')}`, async ({ params }) => {
    const { id } = params
    const response = createMockedAdditionalSkillProgressDetailsDTO(id)
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
]
