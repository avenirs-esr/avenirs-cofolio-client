import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { ERole, getGetMeUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse, type PathParams } from 'msw'

export const genericHandlers = [
  http.get<PathParams, LoggedInUserDTO>(`*${getGetMeUrl()}`, () => {
    return HttpResponse.json<LoggedInUserDTO>(
      {
        firstname: 'Lucas',
        lastname: 'Tessier',
        roles: [ERole.ROLE_STUDENT, ERole.ROLE_STAFF, ERole.ROLE_SUPER_ADMIN]
      },
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
