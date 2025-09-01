import { createMockedPagedResponseAdditionalSkillsDTO, createMockedPagedResponseSkillsDTO, createMockedSearchAdditionalSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  AddAdditionalSkillDTOLevel,
  type AdditionalSkillConfigurationDTO,
  getGetAdditionalSkillConfigUrl,
  getGetSkillLevelProgressesUrl,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseSkillDTO
} from '@/api/avenir-esr'
import { PageSizes } from '@/ui/config'
import { http, HttpResponse, type PathParams } from 'msw'

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
      [AddAdditionalSkillDTOLevel.BEGINNER]: {
        label: 'Débutant',
        description: 'Je découvre cette compétence'
      },
      [AddAdditionalSkillDTOLevel.INTERMEDIATE]: {
        label: 'Intermédiaire',
        description: 'Je commence à maîtriser cette compétence'
      },
      [AddAdditionalSkillDTOLevel.COMPETENT]: {
        label: 'Compétent',
        description: 'Je maîtrise cette compétence'
      },
      [AddAdditionalSkillDTOLevel.ADVANCED]: {
        label: 'Avancé',
        description: 'Je maîtrise bien cette compétence'
      },
      [AddAdditionalSkillDTOLevel.EXPERT]: {
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
]
