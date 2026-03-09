import {
  createMockedDeclaredProgramsPagedResponse,
  declaredProgramViewDTOFixture,
  searchDeclaredProgramsById
} from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import {
  type DeclaredProgramDetailedDTO,
  getCreateDeclaredProgramUrl,
  getDeleteDeclaredProgramUrl,
  getGetDeclaredProgramsUrl,
  getGetDeclaredProgramUrl,
  getUpdateDeclaredProgramUrl,
  type PagedResponseDeclaredProgramViewDTO
} from '@/api/avenir-esr'
import { delay, http, HttpResponse } from 'msw'

export const createDeclaredProgramErrorHandler = http.post(
  `*${getCreateDeclaredProgramUrl()}`,
  () => {
    return HttpResponse.json(
      {
        status: 500,
        message: 'Internal Server Error',
        error: 'Failed to create declared program'
      },
      { status: 500 }
    )
  }
)

export const declaredProgramsQueryErrorHandler = http.get(`*${getGetDeclaredProgramsUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export const declaredProgramsQueryEmptyHandler = http.get(`*${getGetDeclaredProgramsUrl()}`, async ({ request }) => {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') ?? '0')
  const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

  await delay('real')
  const mockData = createMockedDeclaredProgramsPagedResponse(pageSize, 0, page)

  return HttpResponse.json<PagedResponseDeclaredProgramViewDTO>(mockData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredProgramsQueryHandler = http.get(`*${getGetDeclaredProgramsUrl()}`, async ({ request }) => {
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get('page') ?? '0')
  const pageSize = Number.parseInt(url.searchParams.get('pageSize') ?? '10')

  await delay('real')
  const mockData = createMockedDeclaredProgramsPagedResponse(pageSize, 60, page)

  return HttpResponse.json<PagedResponseDeclaredProgramViewDTO>(mockData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredProgramDetailedHandler = http.get(`*${getGetDeclaredProgramUrl(':id')}`, ({ params }) => {
  const { id } = params as { id: string }
  const program = searchDeclaredProgramsById(id)
  return HttpResponse.json<DeclaredProgramDetailedDTO>(program, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredProgramDetailedLoadingHandler = http.get(`*${getGetDeclaredProgramUrl(':id')}`, async ({ params }) => {
  await delay('infinite')
  const { id } = params as { id: string }
  const program = searchDeclaredProgramsById(id)
  return HttpResponse.json<DeclaredProgramDetailedDTO>(program, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredProgramDetailedErrorHandler = http.get(`*${getGetDeclaredProgramUrl(':id')}`, () => {
  return HttpResponse.json(
    {
      status: 500,
      message: 'Internal Server Error',
      error: 'Failed to fetch declared program details'
    },
    { status: 500 }
  )
})

export const declaredProgramDetailedNotFoundHandler = http.get(`*${getGetDeclaredProgramUrl(':id')}`, () => {
  return HttpResponse.json(
    { code: 'DECLARED_PROGRAM_NOT_FOUND', message: 'Internal server error' },
    { status: 404 }
  )
})

export const declaredProgramsHandlers = [
  declaredProgramsQueryHandler,
  http.post(
    `*${getCreateDeclaredProgramUrl()}`,
    () => {
      return HttpResponse.json(declaredProgramViewDTOFixture, { status: 200 })
    }
  ),
  http.put(
    `*${getUpdateDeclaredProgramUrl(':id')}`,
    () => {
      return HttpResponse.json(declaredProgramViewDTOFixture, { status: 200 })
    }
  ),
  declaredProgramDetailedHandler,
  http.delete(`*${getDeleteDeclaredProgramUrl()}`, async ({ request }) => {
    const declaredProgramIds = await request.json() as string[]

    if (declaredProgramIds.includes('INVALID_PROGRAM_ID')) {
      return HttpResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    if (declaredProgramIds.length === 0) {
      return HttpResponse.json({ error: 'No program IDs provided' }, { status: 400 })
    }

    const response = `${declaredProgramIds.length} program${declaredProgramIds.length > 1 ? 's' : ''} deleted successfully`
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })
]
