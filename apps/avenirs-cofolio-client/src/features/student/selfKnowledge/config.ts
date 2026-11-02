export const SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH = 80
export const SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH = 400
export const SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_MAX_FILE_SIZE = 10 * 1024 * 1024
export const SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'image/jpeg',
  'image/png',
  '.doc',
  '.docx',
  '.odt',
  '.jpg',
  '.jpeg',
  '.png'
] as const
