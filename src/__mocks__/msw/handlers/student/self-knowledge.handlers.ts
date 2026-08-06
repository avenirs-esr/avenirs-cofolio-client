import {
  createMockedPagedResponseSelfKnowledgeElementViewDTO,
  mockedSelfKnowledgeCategories,
  mockedSelfKnowledgeCategoriesAvailable,
  mockedSelfKnowledgeElementDetails
} from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import {
  ESelfKnowledgeCategory,
  getAddSelfKnowledgeCategoriesUrl,
  getCreateSelfKnowledgeElementUrl,
  getDeleteSelfKnowledgeElementsUrl,
  getGetSelfKnowledgeCategoriesAvailableUrl,
  getGetSelfKnowledgeCategoriesUrl,
  getGetSelfKnowledgeElementDetailsUrl,
  getGetSelfKnowledgeElementsUrl,
  getRemoveSelfKnowledgeCategoryUrl,
  type GetSelfKnowledgeElementsParams,
  getUpdateSelfKnowledgeElementUrl,
  type PagedResponseSelfKnowledgeElementViewDTO,
  type SelfKnowledgeCategoryDTO,
  type SelfKnowledgeElementDetailsDTO,
  type SelfKnowledgeElementRequest,
  type SelfKnowledgeElementViewDTO
} from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { http, HttpResponse } from 'msw'

const CATEGORY_URL_PARAM = ':selfKnowledgeCategory' as ESelfKnowledgeCategory

export const selfKnowledgeCategoriesErrorHandler = http.get(`*${getGetSelfKnowledgeCategoriesUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export const selfKnowledgeElementDetailsNotFoundHandler = http.get(`*${getGetSelfKnowledgeElementDetailsUrl(':selfKnowledgeElementId')}`, () => {
  return HttpResponse.json(
    { code: ErrorCodes.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND, message: 'Internal server error' },
    { status: 404 }
  )
})

export const selfKnowledgeCategoryElementsErrorHandler = http.get(`*${getGetSelfKnowledgeElementsUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
})

export function createSelfKnowledgeElementsHandler (
  customPayload?: PagedResponseSelfKnowledgeElementViewDTO,
  onRequest?: (params: GetSelfKnowledgeElementsParams) => void
) {
  return http.get(`*${getGetSelfKnowledgeElementsUrl()}`, ({ request }) => {
    const url = new URL(request.url)
    const categoryType = (url.searchParams.get('selfKnowledgeCategories')?.split(',')[0] ?? ESelfKnowledgeCategory.STRENGTHS) as ESelfKnowledgeCategory
    const page = Number.parseInt(url.searchParams.get('page') ?? '0')
    const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '3')

    if (onRequest) {
      onRequest({
        selfKnowledgeCategories: url.searchParams.get('selfKnowledgeCategories')?.split(',') as ESelfKnowledgeCategory[] | undefined,
        page: url.searchParams.has('page') ? Number(url.searchParams.get('page')) : undefined,
        pageSize: url.searchParams.has('pageSize') ? Number(url.searchParams.get('pageSize')) : undefined,
        isValorized: url.searchParams.has('isValorized') ? url.searchParams.get('isValorized') === 'true' : undefined
      })
    }

    const payload = customPayload ?? createMockedPagedResponseSelfKnowledgeElementViewDTO(categoryType, pageSize, 10, page)

    return HttpResponse.json<PagedResponseSelfKnowledgeElementViewDTO>(payload, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
}

export const createSelfKnowledgeElementErrorHandler = http.post(`*${getCreateSelfKnowledgeElementUrl(CATEGORY_URL_PARAM)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
    { status: 500 }
  )
})

export const putUpdateSelfKnowledgeElementErrorNotFoundHandler = http.put(`*${getUpdateSelfKnowledgeElementUrl(':selfKnowledgeElementId')}`, () => {
  return HttpResponse.json(
    { message: 'Self knowledge element not found', code: ErrorCodes.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND },
    { status: 404 }
  )
})

export const postCreateSelfKnowledgeElementErrorHandler = http.post(`*${getCreateSelfKnowledgeElementUrl(CATEGORY_URL_PARAM)}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error', code: ErrorCodes.SERVER },
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

  createSelfKnowledgeElementsHandler(),

  http.get(`*${getGetSelfKnowledgeCategoriesAvailableUrl()}`, () => {
    return HttpResponse.json<SelfKnowledgeCategoryDTO[]>(mockedSelfKnowledgeCategoriesAvailable, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }),

  http.post(`*${getAddSelfKnowledgeCategoriesUrl()}`, async ({ request }) => {
    const selfKnowledgeCategories = await request.json() as ESelfKnowledgeCategory[]

    if (selfKnowledgeCategories.length === 0) {
      return HttpResponse.json({ error: 'No categories provided', code: ErrorCodes.SELF_KNOWLEDGE_CATEGORY_IS_MANDATORY }, { status: 400 })
    }

    if ((selfKnowledgeCategories[0] as string) === 'ERROR_CATEGORY') {
      return HttpResponse.json(
        { error: 'Internal server error', code: ErrorCodes.SERVER },
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
      return HttpResponse.json({ error: 'No element provided', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (element.title === 'ERROR_ELEMENT') {
      return HttpResponse.json(
        { error: 'Internal server error', code: ErrorCodes.SERVER },
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

  http.delete(`*${getRemoveSelfKnowledgeCategoryUrl(CATEGORY_URL_PARAM)}`, async ({ params }) => {
    const selfKnowledgeCategory = params.selfKnowledgeCategory as string

    if (selfKnowledgeCategory === 'INVALID_CATEGORY_ID') {
      return HttpResponse.json({ error: 'Invalid category ID', code: ErrorCodes.SELF_KNOWLEDGE_CATEGORY_NOT_FOUND }, { status: 404 })
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
      return HttpResponse.json({ error: 'No element IDs provided', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (elementsIds.find(id => id === 'INVALID_ELEMENT_ID')) {
      return HttpResponse.json({ error: 'Invalid element ID', code: ErrorCodes.SELF_KNOWLEDGE_ELEMENT_NOT_FOUND }, { status: 404 })
    }

    const response = 'Elements successfully removed from user'
    return HttpResponse.json<string>(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),

  http.post(`*${getCreateSelfKnowledgeElementUrl(CATEGORY_URL_PARAM)}`, async ({ request, params }) => {
    const element = await request.json() as SelfKnowledgeElementRequest
    const selfKnowledgeCategory = params.selfKnowledgeCategory as ESelfKnowledgeCategory

    if (element.title === 'ERROR_ELEMENT') {
      return HttpResponse.json(
        { error: 'Internal server error', code: ErrorCodes.SERVER },
        { status: 500 }
      )
    }

    if (!element.title || element.title.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Validation error', code: ErrorCodes.NOT_BLANK },
        { status: 400 }
      )
    }

    const response: SelfKnowledgeElementViewDTO = {
      id: crypto.randomUUID(),
      title: element.title,
      description: element.description,
      rating: element.rating,
      category: { type: selfKnowledgeCategory, mandatory: true }
    }

    return HttpResponse.json<SelfKnowledgeElementViewDTO>(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }),
]
