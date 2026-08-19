export const FEEDBACK_MAX_LENGTH = 2000
export const FEEDBACK_ATTACHMENT_MAX_FILE_SIZE = 10 * 1024 * 1024
export const FEEDBACK_ATTACHMENT_ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.docx',
  'application/vnd.oasis.opendocument.text',
  '.odt',
  'image/jpeg',
  'image/pjpeg',
  '.jpg',
  '.jpeg',
  'image/png',
  '.png'
] as const
