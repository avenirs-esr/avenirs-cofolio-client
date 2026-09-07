import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const genericHandlers = [
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
