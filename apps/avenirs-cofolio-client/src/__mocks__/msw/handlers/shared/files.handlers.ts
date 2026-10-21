import { http, HttpResponse } from 'msw'
import { getLoremPicsumResponse, mockImageBlob } from '@/__mocks__/fixtures/shared/files.fixtures'
import { getDownloadActivityFileUrl, getDownloadAttachmentUrl, getDownloadDraftFileUrl, getGetResourceByFileIdUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants/error-codes'
import { HttpStatusCode } from '@/common/utils/http/http-status'

const getRessourceFileByIdHandler = http.get(`*${getGetResourceByFileIdUrl(':id')}`, async ({ params }) => {
  const id = params.id as string | undefined

  if (!id) {
    return HttpResponse.json(
      { error: 'File ID is required', code: ErrorCodes.NOT_BLANK },
      { status: 400 },
    )
  }

  if (id === 'INVALID_FILE_ID') {
    return HttpResponse.json(
      { error: 'File not found', code: ErrorCodes.NOT_FOUND },
      { status: 404 },
    )
  }

  if (id === 'TEST_ID') {
    return new HttpResponse(mockImageBlob, {
      headers: { 'Content-Type': 'image/png' },
    },)
  }

  const response = await getLoremPicsumResponse()

  return new HttpResponse(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'image/jpeg',
    },
  })
})

export const filesHandlers = [
  getRessourceFileByIdHandler,
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
  http.get(`*${getDownloadDraftFileUrl(':activityDraftId', ':fileId')}`, ({ params }) => {
    if (params.fileId === 'INVALID_FILE_ID') {
      return HttpResponse.json({ error: 'File not found', code: ErrorCodes.NOT_FOUND }, { status: 404 })
    }

    return new HttpResponse('draft file content', {
      status: HttpStatusCode.OK,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="file"',
      },
    })
  }),
]
