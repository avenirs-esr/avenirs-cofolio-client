import type {
  PagedResponseAdditionalSkillDTO,
  PagedResponseSkillDTO
} from '@/api/avenir-esr'
import { createMockedPagedResponseAdditionalSkillsDTO, createMockedPagedResponseSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { PageSizes } from '@/ui/config'
import { http, HttpResponse, type PathParams } from 'msw'

export const skillsHandlers = [
  http.get<PathParams, PagedResponseSkillDTO>(`*/me/skill-level-progress`, ({ request }) => {
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
]
