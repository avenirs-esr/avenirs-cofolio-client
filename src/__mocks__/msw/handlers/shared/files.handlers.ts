import { getDownloadActivityFileUrl, getDownloadAttachmentUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const filesHandlers = [
  http.get(`*${getDownloadAttachmentUrl(':traceId')}`, ({ params }) => {
    const traceId: string | undefined = params.traceId as string | undefined

    if (!traceId) {
      return HttpResponse.json({ error: 'Trace ID is required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
    }

    if (traceId === 'INVALID_FILE_ID') {
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
  http.get(`*${getDownloadActivityFileUrl(':activityId', ':fileId')}`, ({ params }) => {
    const activityId: string | undefined = params.activityId as string | undefined
    const fileId: string | undefined = params.fileId as string | undefined

    if (!activityId || !fileId) {
      return HttpResponse.json({ error: 'Activity ID and file ID are required', code: ErrorCodes.NOT_BLANK }, { status: 400 })
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
