import {
  createMockedPagedResponseSelfKnowledgeElementViewDTO,
  mockedSelfKnowledgeCategories,
  mockedSelfKnowledgeCategoriesAvailable,
  mockedSelfKnowledgeElementDetails
} from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import {
  EErrorCode,
  getAddSelfKnowledgeCategoriesUrl,
  getCreateSelfKnowledgeElementUrl,
  getDeleteSelfKnowledgeElementsUrl,
  getGetSelfKnowledgeCategoriesAvailableUrl,
  getGetSelfKnowledgeCategoriesUrl,
  getGetSelfKnowledgeElementDetailsUrl,
  getGetSelfKnowledgeElementsUrl,
  getRemoveSelfKnowledgeCategoryUrl,
  getUpdateSelfKnowledgeElementUrl,
  type PagedResponseSelfKnowledgeElementViewDTO,
  type SelfKnowledgeCategoryDTO,
  type SelfKnowledgeElementDetailsDTO,
  type SelfKnowledgeElementRequest,
  type SelfKnowledgeElementViewDTO
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

export const createSelfKnowledgeElementErrorHandler = http.post(`*${getCreateSelfKnowledgeElementUrl(':selfKnowledgeCategoryId')}`, () => {
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

export const putUpdateSelfKnowledgeElementErrorHandler = http.put(`*${getUpdateSelfKnowledgeElementUrl(':selfKnowledgeElementId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
  )
})

export const putUpdateSelfKnowledgeElementErrorNotFoundHandler = http.put(`*${getUpdateSelfKnowledgeElementUrl(':selfKnowledgeElementId')}`, () => {
  return HttpResponse.json(
    { message: 'Self knowledge element not found', code: EErrorCode.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND },
    { status: 404 }
  )
})

export const postCreateSelfKnowledgeElementErrorHandler = http.post(`*${getCreateSelfKnowledgeElementUrl(':selfKnowledgeCategoryId')}`, () => {
  return HttpResponse.json(
    { message: 'Internal server error' },
    { status: 500 }
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

export function createPutUpdateSelfKnowledgeElementHandler (payload: SelfKnowledgeElementViewDTO) {
  return http.put(`*${getUpdateSelfKnowledgeElementUrl(':selfKnowledgeElementId')}`, () => {
    return HttpResponse.json<SelfKnowledgeElementViewDTO>(payload, {
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

  http.put(`*${getUpdateSelfKnowledgeElementUrl(':selfKnowledgeElementId')}`, async ({ request }) => {
    const element = await request.json() as SelfKnowledgeElementRequest

    if (!element) {
      return HttpResponse.json({ error: 'No element provided' }, { status: 400 })
    }

    if (element.title === 'ERROR_ELEMENT') {
      return HttpResponse.json(
        { error: 'Internal server error', message: 'Failed to update selected element' },
        { status: 500 }
      )
    }

    const response = 'Element successfully updated'
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

  http.post(`*${getCreateSelfKnowledgeElementUrl(':selfKnowledgeCategoryId')}`, async ({ request }) => {
    const element = await request.json() as SelfKnowledgeElementRequest

    if (element.title === 'ERROR_ELEMENT') {
      return HttpResponse.json(
        { error: 'Internal server error', message: 'Failed to create element' },
        { status: 500 }
      )
    }

    if (!element.title || element.title.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Validation error', message: 'Title is required' },
        { status: 400 }
      )
    }

    const response: SelfKnowledgeElementViewDTO = {
      id: crypto.randomUUID(),
      title: element.title,
      description: element.description,
      rating: element.rating
    }

    return HttpResponse.json<SelfKnowledgeElementViewDTO>(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]
