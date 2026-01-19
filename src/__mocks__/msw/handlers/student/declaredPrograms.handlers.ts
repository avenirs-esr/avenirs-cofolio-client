import {
  createMockedDeclaredProgramsPagedResponse,
  declaredProgramViewDTOFixture
} from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import {
  type DeclaredProgramDetailedDTO,
  getCreateDeclaredProgramUrl,
  getGetDeclaredProgramsUrl,
  getGetDeclaredProgramUrl,
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
  const mockData = createMockedDeclaredProgramsPagedResponse(pageSize, 5, page)

  return HttpResponse.json<PagedResponseDeclaredProgramViewDTO>(mockData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})

export const declaredProgramDetailedHandler = http.get(`*${getGetDeclaredProgramUrl(':id')}`, () => {
  return HttpResponse.json<DeclaredProgramDetailedDTO>(declaredProgramViewDTOFixture, {
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

export const declaredProgramsHandlers = [
  declaredProgramsQueryHandler,
  http.post(
    `*${getCreateDeclaredProgramUrl()}`,
    () => {
      return HttpResponse.json(declaredProgramViewDTOFixture, { status: 200 })
    }
  ),
  declaredProgramDetailedHandler
]
