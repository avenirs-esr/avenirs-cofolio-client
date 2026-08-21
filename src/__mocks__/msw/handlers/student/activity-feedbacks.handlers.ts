import { getDownloadFeedbackAttachmentUrl } from '@/api/avenir-esr'
import { ErrorCodes } from '@/common/constants'
import { HttpStatusCode } from '@/common/utils/http/http-status'
import { http, HttpResponse } from 'msw'

export const downloadFeedbackAttachmentHandler = http.get(
  `*${getDownloadFeedbackAttachmentUrl(':feedbackId', ':attachmentId')}`,
  ({ params }) => {
    const attachmentId = params.attachmentId

    if (attachmentId === 'INVALID_FEEDBACK_ID') {
      return new HttpResponse('Feedback attachment not found', {
        status: HttpStatusCode.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    return new HttpResponse('file content', {
      status: HttpStatusCode.OK,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="file"',
      },
    })
  }
)

export const downloadFeedbackAttachmentErrorHandler = http.get(
  `*${getDownloadFeedbackAttachmentUrl(':feedbackId', ':attachmentId')}`,
  () => HttpResponse.json(
    { message: 'Feedback attachment not found', code: ErrorCodes.ATTACHMENT_NOT_FOUND },
    { status: HttpStatusCode.NOT_FOUND, headers: { 'Content-Type': 'application/json' } }
  )
)

export const activityFeedbacksHandlers = [
  downloadFeedbackAttachmentHandler,
]
