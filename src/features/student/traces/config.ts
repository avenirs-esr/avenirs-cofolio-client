import { MB } from '@/common/utils/file/file'

export const TRACE_IA_JUSTIFICATION_MAX_LENGTH = 200
export const TRACE_LINK_MAX_LENGTH = 2000
export const TRACE_NAME_MAX_LENGTH = 80
export const TRACE_PERSONAL_NOTE_MAX_LENGTH = 200
export const TRACE_MAX_SIZE_BYTES: Record<string, number> = {
  'image/*': 5 * MB,
  'text/*': 5 * MB,
  'audio/*': 5 * MB,
  'video/*': 10 * MB,
  'application/*': 10 * MB,
  '*': 10 * MB
}
