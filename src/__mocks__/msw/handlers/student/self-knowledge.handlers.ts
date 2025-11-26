import {
  createMockedPagedResponseSelfKnowledgeElementViewDTO,
  mockedSelfKnowledgeCategories,
  mockedSelfKnowledgeCategoriesAvailable,
  mockedSelfKnowledgeElementDetails
} from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import {
  getAddSelfKnowledgeCategoriesUrl,
  getDeleteSelfKnowledgeElementsUrl,
  getGetSelfKnowledgeCategoriesAvailableUrl,
  getGetSelfKnowledgeCategoriesUrl,
  getGetSelfKnowledgeElementDetailsUrl,
  getGetSelfKnowledgeElementsUrl,
  getRemoveSelfKnowledgeCategoryUrl,
  type PagedResponseSelfKnowledgeElementViewDTO,
  type SelfKnowledgeCategoryDTO,
  type SelfKnowledgeElementDetailsDTO
} from '@/api/avenir-esr'
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

export const selfKnowledgeElementDetailsErrorHandler = http.get(`*${getGetSelfKnowledgeElementDetailsUrl(':selfKnowledgeElementId')}`, () => {
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

export const selfKnowledgeCategoriesAvailableErrorHandler = http.get(`*${getGetSelfKnowledgeCategoriesAvailableUrl()}`, () => {
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

export function createSelfKnowledgeCategoriesAvailableHandler (payload: SelfKnowledgeCategoryDTO[]) {
  return http.get(`*${getGetSelfKnowledgeCategoriesAvailableUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export function createSelfKnowledgeElementDetailsHandler (payload: SelfKnowledgeElementDetailsDTO) {
  return http.get(`*${getGetSelfKnowledgeElementDetailsUrl(':selfKnowledgeElementId')}`, () => {
    return HttpResponse.json<SelfKnowledgeElementDetailsDTO>(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
}

export const selfKnowledgeHandlers = [
  http.get(`*${getGetSelfKnowledgeCategoriesUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(mockedSelfKnowledgeCategories, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  http.get(`*${getGetSelfKnowledgeElementDetailsUrl(':selfKnowledgeElementId')}`, () => {
    return HttpResponse.json<SelfKnowledgeElementDetailsDTO>(mockedSelfKnowledgeElementDetails, {
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
  }),

  http.get(`*${getGetSelfKnowledgeCategoriesAvailableUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(mockedSelfKnowledgeCategoriesAvailable, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  http.post(`*${getAddSelfKnowledgeCategoriesUrl()}`, async ({ request }) => {
    const selfKnowledgeCategoryDTOs = await request.json() as SelfKnowledgeCategoryDTO[]

    if (selfKnowledgeCategoryDTOs.length === 0) {
      return HttpResponse.json({ error: 'No categories provided' }, { status: 400 })
    }

    if (selfKnowledgeCategoryDTOs[0].title === 'ERROR_CATEGORY') {
      return HttpResponse.json(
        { error: 'Internal server error', message: 'Failed to update selected categories' },
        { status: 500 }
      )
    }

    const response = 'Categories successfully associated with user'
    return HttpResponse.json<string>(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.delete(`*${getRemoveSelfKnowledgeCategoryUrl(':categoryId')}`, async ({ params }) => {
    const categoryId = params.categoryId as string

    if (categoryId === 'INVALID_CATEGORY_ID') {
      return HttpResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const response = 'Category successfully removed from user'
    return HttpResponse.json<string>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.delete(`*${getDeleteSelfKnowledgeElementsUrl()}`, async ({ request }) => {
    const elementsIds = await request.json() as string[]

    if (elementsIds.length === 0) {
      return HttpResponse.json({ error: 'No element IDs provided' }, { status: 400 })
    }

    if (elementsIds.find(id => id === 'INVALID_ELEMENT_ID')) {
      return HttpResponse.json({ error: 'Invalid element ID' }, { status: 400 })
    }

    const response = 'Elements successfully removed from user'
    return HttpResponse.json<string>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]
