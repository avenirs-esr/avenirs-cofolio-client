import type { PathParams } from 'msw'
import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { http, HttpResponse } from 'msw'
import { mockedAcceptedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { ERole, EUniverse, getGetMeUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils/http/http-status'

export const mockedLoggedInUser: LoggedInUserDTO = {
  roles: Object.values(ERole),
  universes: Object.values(EUniverse),
  acceptedCgu: mockedAcceptedCgu
}

export const meServerErrorHandler = http.get(`*${getGetMeUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Internal Server Error' },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR }
  )
})

export const meUnauthorizedHandler = http.get(`*${getGetMeUrl()}`, () => {
  return HttpResponse.json(
    { message: 'Unauthorized' },
    { status: HttpStatusCode.UNAUTHORIZED }
  )
})

export const meWithoutAcceptedCguHandler = http.get<PathParams, LoggedInUserDTO>(`*${getGetMeUrl()}`, () => {
  return HttpResponse.json<LoggedInUserDTO>(
    { ...mockedLoggedInUser, acceptedCgu: undefined },
    {
      status: HttpStatusCode.OK,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

export function meAs (user: Partial<LoggedInUserDTO>) {
  return http.get(`*${getGetMeUrl()}`, () => HttpResponse.json({ ...mockedLoggedInUser, ...user }))
}

export const genericHandlers = [
  http.get<PathParams, LoggedInUserDTO>(`*${getGetMeUrl()}`, () => {
    return HttpResponse.json<LoggedInUserDTO>(
      mockedLoggedInUser,
      {
        status: HttpStatusCode.OK,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }),
  http.get('https://example.com/:filename.:fileType', ({ params }) => {
    const { filename, fileType } = params as { filename: string, fileType: string }

    let contentType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`

    if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(fileType)) {
      contentType = 'application/octet-stream'
    }

    if (filename === 'error') {
      return HttpResponse.json(
        { message: 'Internal Server Error', code: ErrorCodes.SERVER },
        { status: HttpStatusCode.INTERNAL_SERVER_ERROR, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new HttpResponse('file content', {
      status: HttpStatusCode.OK,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="file"',
      },
    })
  }),
]
