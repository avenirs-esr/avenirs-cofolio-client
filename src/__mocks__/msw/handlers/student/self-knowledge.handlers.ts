import { createMockedPagedResponseSelfKnowledgeElementViewDTO, mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { getGetSelfKnowledgeCategoriesUrl, getGetSelfKnowledgeElementsUrl, type PagedResponseSelfKnowledgeElementViewDTO, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'

export const selfKnowledgeCategoriesErrorHandler = http.get(`*${getGetSelfKnowledgeCategoriesUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export const selfKnowledgeCategoryElementsErrorHandler = http.get(`*${getGetSelfKnowledgeElementsUrl(':selfKnowledgeCategoryId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export const selfKnowledgeHandlers = [
  http.get(`*${getGetSelfKnowledgeCategoriesUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(mockedSelfKnowledgeCategories, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),
  http.get(`*${getGetSelfKnowledgeElementsUrl(':selfKnowledgeCategoryId')}`, ({ request, params }) => {
    const url = new URL(request.url)
    const selfKnowledgeCategoryId = params.selfKnowledgeCategoryId as string
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '3')
    const totalElements = 10

    const mockData = createMockedPagedResponseSelfKnowledgeElementViewDTO(selfKnowledgeCategoryId, pageSize, totalElements, page)

    return HttpResponse.json<PagedResponseSelfKnowledgeElementViewDTO>(mockData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
]
