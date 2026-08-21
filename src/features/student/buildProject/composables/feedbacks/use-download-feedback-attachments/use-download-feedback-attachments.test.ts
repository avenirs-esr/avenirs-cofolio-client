import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import { feedback as feedbackFixture } from '@/__mocks__/fixtures/student/activitiy-feedbacks.fixtures'
import { downloadFeedbackAttachmentErrorHandler } from '@/__mocks__/msw/handlers/student/activity-feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import * as downloadUtils from '@/common/utils/download/download'
import {
  useDownloadFeedbackAttachments
} from '@/features/student/buildProject/composables/feedbacks/use-download-feedback-attachments/use-download-feedback-attachments'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const { mockAddErrorMessage } = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn(),
}))

const feedback: FeedbackOverviewDTO = {
  ...feedbackFixture
}

vi.mock('@/store', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
  }),
}))

BddTest().given('a useDownloadFeedbackAttachments composable', () => {
  let composable: ReturnType<typeof useDownloadFeedbackAttachments>
  const downloadBlobSpy = vi.spyOn(downloadUtils, 'downloadBlob')

  beforeEach(() => {
    vi.clearAllMocks()
    downloadBlobSpy.mockImplementation(() => undefined)
    composable = mountComposable(() => useDownloadFeedbackAttachments(feedback), {
      useI18n: true,
      useTanstack: true,
    }).result
  })

  BddTest().when('the composable is initialized with attachments', () => {
    BddTest().then('it should expose the feedback attachments list', () => {
      expect(composable.feedbackAttachments.value).toHaveLength(2)
      expect(composable.feedbackAttachments.value[0]?.id).toBe('file-1')
      expect(composable.feedbackAttachments.value[1]?.fileName).toBe('document-2.pdf')
    })
  })

  BddTest().when('downloadFeedbackAttachment is called', () => {
    beforeEach(async () => {
      await composable.downloadFeedbackAttachment('file-1', 'document-1.pdf')
    })

    BddTest().then('it should download the blob when the request succeeds', () => {
      expect(downloadBlobSpy).toHaveBeenCalledTimes(1)
      const [blob, fileName] = downloadBlobSpy.mock.calls[0]
      expect(blob).toMatchObject({
        size: expect.any(Number),
        type: 'application/octet-stream',
      })
      expect(fileName).toBe('document-1.pdf')
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('downloadAllFeedbackAttachments is called', () => {
    beforeEach(async () => {
      await composable.downloadAllFeedbackAttachments()
    })

    BddTest().then('it should download every attachment', () => {
      expect(downloadBlobSpy).toHaveBeenCalledTimes(2)
      expect(downloadBlobSpy.mock.calls[0]?.[1]).toBe('document-1.pdf')
      expect(downloadBlobSpy.mock.calls[1]?.[1]).toBe('document-2.pdf')
      expect(downloadBlobSpy.mock.calls[0]?.[0]).toMatchObject({
        type: 'application/octet-stream',
      })
      expect(downloadBlobSpy.mock.calls[1]?.[0]).toMatchObject({
        type: 'application/octet-stream',
      })
    })
  })

  BddTest().when('the download request fails', () => {
    beforeEach(async () => {
      server.use(downloadFeedbackAttachmentErrorHandler)
      await composable.downloadFeedbackAttachment('file-1', 'document-1.pdf')
    })

    BddTest().then('it should add an error toaster message', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith({
        title: 'Une erreur est survenue lors du téléchargement du fichier.',
        description: 'Pièce jointe introuvable',
      })
      expect(downloadBlobSpy).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the composable is initialized without attachments', () => {
    beforeEach(() => {
      composable = mountComposable(() => useDownloadFeedbackAttachments({
        ...feedback,
        attachments: undefined,
      }), {
        useI18n: true,
        useTanstack: true,
      }).result
    })

    BddTest().then('it should expose an empty attachments list', () => {
      expect(composable.feedbackAttachments.value).toEqual([])
    })
  })
})
