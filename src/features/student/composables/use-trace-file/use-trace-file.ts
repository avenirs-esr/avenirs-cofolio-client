import { type AttachmentUploadDTO, EFileType } from '@/api/avenir-esr'
import { useDateUtils, useFileValidation } from '@/common/composables'
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/components/inputs'
import { type MaybeRef, toValue } from 'vue'

const FIVE_MB = 5 * 1024 * 1024
const TEN_MB = 10 * 1024 * 1024

function dtoToFile (dto: AttachmentUploadDTO): File {
  const blob = new Blob([], { type: dto.fileType })
  return new File([blob], dto.fileName, {
    type: dto.fileType,
    lastModified: new Date(dto.uploadedAt).getTime(),
  })
}

export function useTraceFileValidation (isRequired: boolean = true) {
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

export function useTraceAttachmentFile (attachment: MaybeRef<AttachmentUploadDTO>) {
  const { formatTranslatedDateTime } = useDateUtils()

  const attachmentFile = computed(() => dtoToFile(toValue(attachment)))

  const uploadDate = computed<string>(() => {
    return formatTranslatedDateTime(toValue(attachment).uploadedAt)
  })

  return {
    attachmentFile,
    uploadDate
  }
}
