import type { FileDTO } from '@/api/avenir-esr'
import { EFileType } from '@/api/avenir-esr'
import { FEEDBACK_ATTACHMENT_MAX_FILE_SIZE, FEEDBACK_MAX_LENGTH } from '@/features/feedbacks/config'
import { useWriteFeedbackFormValidators } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form-validators/use-write-feedback-form-validators'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a write feedback form validators composable', () => {
  let composableResult: ReturnType<typeof useWriteFeedbackFormValidators>

  beforeEach(() => {
    const result = mountComposable(() => useWriteFeedbackFormValidators(), {
      useI18n: true
    })
    composableResult = result.result
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should expose feedback validators', () => {
      expect(composableResult.validateFeedback).toBeDefined()
    })

    BddTest().then('it should expose attachments validators', () => {
      expect(composableResult.validateAttachments).toBeDefined()
    })
  })

  BddTest().when('validating feedback', () => {
    BddTest().then('it should require feedback when empty', () => {
      expect(composableResult.validateFeedback('')).toBe('Ce champ est requis.')
    })

    BddTest().then('it should require feedback when undefined', () => {
      expect(composableResult.validateFeedback(undefined as unknown as string)).toBe('Ce champ est requis.')
    })

    BddTest().then('it should require feedback when null', () => {
      expect(composableResult.validateFeedback(null as unknown as string)).toBe('Ce champ est requis.')
    })

    BddTest().then('it should enforce max length', () => {
      const tooLongFeedback = 'a'.repeat(FEEDBACK_MAX_LENGTH + 1)
      expect(composableResult.validateFeedback(tooLongFeedback)).toBe(`Veuillez limiter votre saisie à ${FEEDBACK_MAX_LENGTH} caractères`)
    })

    BddTest().then('it should accept feedback at max length', () => {
      const feedbackAtMaxLength = 'a'.repeat(FEEDBACK_MAX_LENGTH)
      expect(composableResult.validateFeedback(feedbackAtMaxLength)).toBeUndefined()
    })

    BddTest().then('it should accept valid feedback', () => {
      expect(composableResult.validateFeedback('Feedback valide')).toBeUndefined()
    })
  })

  BddTest().when('validating attachments', () => {
    const buildFile = (name: string, type: string, size: number) => {
      const file = new File(['content'], name, { type })
      Object.defineProperty(file, 'size', { value: size })
      return file
    }

    const remoteAttachment: FileDTO = {
      id: 'attachment-1',
      fileName: 'existing.pdf',
      fileType: EFileType.PDF,
      fileSize: 1024,
      url: 'https://example.com/existing.pdf',
      uploadedAt: '2026-01-01T10:00:00Z'
    }

    BddTest().then('it should accept an empty list', () => {
      expect(composableResult.validateAttachments([])).toBeUndefined()
    })

    BddTest().then('it should accept every allowed format', () => {
      const attachments = [
        buildFile('doc.pdf', 'application/pdf', 1024),
        buildFile('doc.doc', 'application/msword', 1024),
        buildFile('doc.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1024),
        buildFile('doc.odt', 'application/vnd.oasis.opendocument.text', 1024),
        buildFile('image.jpg', 'image/jpeg', 1024),
        buildFile('image.png', 'image/png', 1024)
      ]

      expect(composableResult.validateAttachments(attachments)).toBeUndefined()
    })

    BddTest().then('it should reject an unsupported format', () => {
      expect(composableResult.validateAttachments([buildFile('archive.zip', 'application/zip', 1024)]))
        .toBe('Le fichier ne respecte pas le format attendu.')
    })

    BddTest().then('it should accept a file at the maximum size', () => {
      expect(composableResult.validateAttachments([buildFile('big.pdf', 'application/pdf', FEEDBACK_ATTACHMENT_MAX_FILE_SIZE)]))
        .toBeUndefined()
    })

    BddTest().then('it should reject a file exceeding the maximum size', () => {
      expect(composableResult.validateAttachments([buildFile('big.pdf', 'application/pdf', FEEDBACK_ATTACHMENT_MAX_FILE_SIZE + 1)]))
        .toBe('La taille du fichier dépasse la limite autorisée.')
    })

    BddTest().then('it should deduplicate identical errors', () => {
      const attachments = [
        buildFile('archive.zip', 'application/zip', 1024),
        buildFile('other.zip', 'application/zip', 1024)
      ]

      expect(composableResult.validateAttachments(attachments)).toBe('Le fichier ne respecte pas le format attendu.')
    })

    BddTest().then('it should join distinct errors', () => {
      const attachments = [
        buildFile('archive.zip', 'application/zip', 1024),
        buildFile('big.pdf', 'application/pdf', FEEDBACK_ATTACHMENT_MAX_FILE_SIZE + 1)
      ]

      expect(composableResult.validateAttachments(attachments))
        .toBe('Le fichier ne respecte pas le format attendu. La taille du fichier dépasse la limite autorisée.')
    })

    BddTest().then('it should ignore already uploaded attachments', () => {
      expect(composableResult.validateAttachments([remoteAttachment])).toBeUndefined()
    })
  })
})
