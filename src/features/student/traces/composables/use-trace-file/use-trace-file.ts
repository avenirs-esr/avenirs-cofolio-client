import { EFileType, type FileDTO } from '@/api/avenir-esr'
import { useDateUtils, useFileValidation } from '@/common/composables'
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/traces/components/interactions/inputs/TraceFileUpload/types'
import { type ComputedRef, type MaybeRef, toValue } from 'vue'

const FIVE_MB = 5 * 1024 * 1024
const TEN_MB = 10 * 1024 * 1024

function dtoToFile (dto: FileDTO): File {
  const blob = new Blob([], { type: dto.fileType })
  return new File([blob], dto.fileName, {
    type: dto.fileType,
    lastModified: new Date(dto.uploadedAt).getTime(),
  })
}

interface UseTraceFileValidationReturn {
  /**
   * Validates a given file according to the allowed file types and size limits.
   *
   * @example
   * ```ts
   * const { validateFile } = useTraceFileValidation()
   * const file = new File(['content'], 'test.png', { type: 'image/png' })
   * const result = validateFile(file)
   * // result.isValid -> true/false
   * // result.errorMessage -> optional error string
   * ```
   */
  validateFile: (file: File | null) => string | undefined
}

/**
 * Vue composable to handle file validation for student trace attachments.
 *
 * This composable configures accepted file types and maximum sizes for each file category.
 * It uses the `useFileValidation` composable internally and provides a unified validator
 * that ensures uploaded files meet defined constraints.
 *
 * @example
 * ```ts
 * import { useTraceFileValidation } from '@/common/composables'
 *
 * const { validateFile } = useTraceFileValidation()
 * const result = validateFile(selectedFile)
 * if (!result.isValid) console.error(result.errorMessage)
 * ```
 *
 * @param {boolean} [isRequired] - Whether a file is mandatory for validation.
 * @returns {UseTraceFileValidationReturn} Object containing:
 *  - `validateFile`: function to validate a given file's type and size.
 */
export function useTraceFileValidation (isRequired: boolean = true): UseTraceFileValidationReturn {
  const { validateFile } = useFileValidation({
    acceptedFileTypes: [...TRACE_ACCEPTED_FILE_TYPES, ...Object.values(EFileType)],
    maxSizeConfig: {
      'image/*': FIVE_MB,
      'text/*': FIVE_MB,
      'audio/*': FIVE_MB,
      'video/*': TEN_MB,
      'application/*': TEN_MB,
      '*': FIVE_MB
    },
    isRequired
  })

  return {
    validateFile
  }
}

interface UseTraceAttachmentFileReturn {
  /**
   * Reactive computed value returning a `File` object built from the provided attachment DTO.
   *
   * @example
   * ```ts
   * const { attachmentFile } = useTraceAttachmentFile(attachment)
   * console.log(attachmentFile.value.name)
   * ```
   */
  attachmentFile: ComputedRef<File | null>

  /**
   * Reactive computed value returning the localized upload date and time of the attachment.
   *
   * @example
   * ```ts
   * const { uploadDate } = useTraceAttachmentFile(attachment)
   * console.log(uploadDate.value) // "15 octobre 2025 à 16:32"
   * ```
   */
  uploadDate: ComputedRef<string>
}

/**
 * Vue composable to handle the transformation and display of attachment data.
 *
 * This composable converts an `AttachmentUploadDTO` into a `File` object and formats
 * the upload date/time using the localized date utilities. It's typically used to
 * display uploaded files in a student trace view or to rehydrate DTOs as `File` objects
 * for further manipulation.
 *
 * @example
 * ```ts
 * import { useTraceAttachmentFile } from '@/common/composables'
 *
 * const attachment = ref({
 *   id: '1',
 *   fileName: 'project.pdf',
 *   fileType: 'application/pdf',
 *   fileSize: 2048000,
 *   version: 2,
 *   uploadedAt: '2025-10-15T14:32:00Z'
 * })
 *
 * const { attachmentFile, uploadDate } = useTraceAttachmentFile(attachment)
 *
 * console.log(attachmentFile.value) // File { name: 'project.pdf' }
 * console.log(uploadDate.value) // "15 octobre 2025 à 16:32"
 * ```
 *
 * @param {MaybeRef<FileDTO | undefined>} attachment - Reactive or static reference to an attachment DTO.
 * @returns {UseTraceAttachmentFileReturn} Object containing:
 *  - `attachmentFile`: computed reactive file object.
 *  - `uploadDate`: computed localized upload date string.
 */
export function useTraceAttachmentFile (attachment: MaybeRef<FileDTO | undefined>): UseTraceAttachmentFileReturn {
  const { formatTranslatedDateTime } = useDateUtils()

  const attachmentFile = computed(() => {
    const attachmentValue = toValue(attachment)

    return attachmentValue ? dtoToFile(attachmentValue) : null
  })

  const uploadDate = computed<string>(() => {
    const attachmentValue = toValue(attachment)

    return attachmentValue ? formatTranslatedDateTime(attachmentValue.uploadedAt) : ''
  })

  return {
    attachmentFile,
    uploadDate
  }
}
