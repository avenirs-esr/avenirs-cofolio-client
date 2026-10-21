import type { PathParams } from 'msw'
import type { AdditionalSkillConfigurationDTO, AddSkillProgressDTO, GetSkillProgressesParams, PagedResponseExternalSkillDTO, PagedResponseSkillProgressDTO, SkillProgressDetailsDTO, SkillProgressDTO } from '@/api/avenir-esr'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { delay, http, HttpResponse } from 'msw'
import {
  createMockedAssociatedExternalSkillIds,
  createMockedPagedResponseSkillProgressDTO,
  createMockedSearchExternalSkillsDTO,
  createMockedSkillProgressDetailsDTO
} from '@/__mocks__/fixtures/student/skills.fixtures'
import {

  ESkillLevel,
  ESkillReferentialType,
  getCreateSkillProgressUrl,

  getDeleteSkillProgressUrl,
  getGetAdditionalSkillConfigUrl,
  getGetSkillIdsUrl,
  getGetSkillProgressDetailsUrl,
  getGetSkillProgressesUrl,
  getUpdateSkillProgressUrl

} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'

const INVALID_DECLARED_SKILL_ID = 'INVALID_DECLARED_SKILL_ID'

export function createDeclaredSkillsProgressViewHandler (
  payload: PagedResponseSkillProgressDTO,
  onRequest?: (params: GetSkillProgressesParams) => void
) {
  return http.get(`*${getGetSkillProgressesUrl()}`, ({ request }) => {
    if (onRequest) {
      const searchParams = new URL(request.url).searchParams
      onRequest({
        page: searchParams.has('page') ? Number(searchParams.get('page')) : undefined,
        pageSize: searchParams.has('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
        isValorized: searchParams.has('isValorized') ? searchParams.get('isValorized') === 'true' : undefined
      })
    }

    return HttpResponse.json<PagedResponseSkillProgressDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const declaredSkillsProgressViewErrorHandler = http.get(`*${getGetSkillProgressesUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const detailedSkillProgressNotFoundErrorHandler = http.get(`*${getGetSkillProgressDetailsUrl(':id')}`, () => {
  return HttpResponse.json(
    { code: ErrorCodes.SKILL_PROGRESS_NOT_FOUND, message: 'Internal server error' },
    { status: 404 }
  )
})

export const skillConfigErrorHandler = http.get<PathParams, AdditionalSkillConfigurationDTO>(`*${getGetAdditionalSkillConfigUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const skillsHandlers = [
  http.get<PathParams, PagedResponseSkillProgressDTO>(`*${getGetSkillProgressesUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const searchParams = url.searchParams

    const pageSize = Number(searchParams.get('pageSize') ?? PageSizes.FOUR)
    const page = Number(searchParams.get('page') ?? 0)
    const response = createMockedPagedResponseSkillProgressDTO(pageSize, 20, page)

    return HttpResponse.json<PagedResponseSkillProgressDTO>(response, {
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

  http.get<PathParams, string[]>(`*${getGetSkillIdsUrl()}`, () => {
    const response = createMockedAssociatedExternalSkillIds()

    return HttpResponse.json<string[]>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.get<PathParams, AdditionalSkillConfigurationDTO>(`*${getGetAdditionalSkillConfigUrl()}`, () => {
    const mockConfig: AdditionalSkillConfigurationDTO = {
      [ESkillLevel.BEGINNER]: {
        label: 'Débutant',
        description: 'Je découvre cette compétence'
      },
      [ESkillLevel.INTERMEDIATE]: {
        label: 'Intermédiaire',
        description: 'Je commence à maîtriser cette compétence'
      },
      [ESkillLevel.COMPETENT]: {
        label: 'Compétent',
        description: 'Je maîtrise cette compétence'
      },
      [ESkillLevel.ADVANCED]: {
        label: 'Avancé',
        description: 'Je maîtrise bien cette compétence'
      },
      [ESkillLevel.EXPERT]: {
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

  http.get<{ id: string }, SkillProgressDetailsDTO>(`*${getGetSkillProgressDetailsUrl(':id')}`, async ({ params }) => {
    const { id } = params
    const response = createMockedSkillProgressDetailsDTO(id)
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.put<{ id: string }, SkillProgressDetailsDTO>(`*${getUpdateSkillProgressUrl(':id')}`, async ({ params }) => {
    const { id } = params

    if (!id) {
      return HttpResponse.json({ error: 'Declared skill progress ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (id === INVALID_DECLARED_SKILL_ID) {
      return HttpResponse.json(
        { code: ErrorCodes.SKILL_PROGRESS_NOT_FOUND, message: 'Internal server error' },
        { status: 404 }
      )
    }

    const response = createMockedSkillProgressDetailsDTO(id)
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.delete<{ declaredSkillProgressId: string }>(`*${getDeleteSkillProgressUrl(':declaredSkillProgressId')}`, async ({ params }) => {
    const { declaredSkillProgressId } = params

    if (declaredSkillProgressId === 'INVALID_SKILL_ID') {
      return HttpResponse.json({ error: 'Invalid skill ID', code: ErrorCodes.SKILL_PROGRESS_NOT_FOUND }, { status: 404 })
    }

    const response = `Skill progress with id ${declaredSkillProgressId} deleted successfully`
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post<PathParams, AddSkillProgressDTO>(`*${getCreateSkillProgressUrl()}`, async ({ request }) => {
    const body = await request.json()
    await delay(100)

    if (body.id === 'EXISTING_SKILL_ID') {
      return HttpResponse.json(
        { code: ErrorCodes.SERVER, message: 'Internal server error' },
        { status: 400 }
      )
    }

    const response: SkillProgressDTO = {
      id: body.id ?? crypto.randomUUID(),
      skillId: body.id ?? crypto.randomUUID(),
      title: `Mocked Skill ${body.id}`,
      pathSegments: ['Category', 'Subcategory'],
      type: ESkillReferentialType.ROME4,
      level: body.level ?? ESkillLevel.INTERMEDIATE,
      reflection: body.reflection ?? 'Mocked skill reflection',
      valorized: false,
      associationsCount: { traceAssociationsCount: 0, declaredActivityAssociationsCount: 0 }
    }

    return HttpResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

]
