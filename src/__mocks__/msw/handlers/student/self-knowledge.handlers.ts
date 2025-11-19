import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { getGetSelfKnowledgeCategoriesUrl, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
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

export const selfKnowledgeHandlers = [
  http.get(`*${getGetSelfKnowledgeCategoriesUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(mockedSelfKnowledgeCategories, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
]
