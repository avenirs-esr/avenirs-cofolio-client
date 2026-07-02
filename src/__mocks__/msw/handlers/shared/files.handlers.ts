import { getDownloadFileUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const filesHandlers = [
  http.get(`*${getDownloadFileUrl(':fileId')}`, ({ params }) => {
    const fileId: string | undefined = params.fileId as string | undefined

    if (!fileId) {
      return HttpResponse.json({ error: 'File ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (fileId === 'INVALID_FILE_ID') {
      return HttpResponse.json({ error: 'File not found', code: ErrorCodes.NOT_FOUND }, { status: 404 })
    }

    return new HttpResponse('file content', {
      status: HttpStatusCode.OK,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="file"',
      },
    })
  }),
]
