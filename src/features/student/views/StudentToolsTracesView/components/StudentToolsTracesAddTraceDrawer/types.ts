export interface TraceFormData {
  file: File | null
  traceName: string
  personalNote?: string
  isAuthentic: boolean
  isGroup: boolean
  useIA: boolean
  iaJustification?: string
}

export const TRACE_ACCEPTED_FILE_TYPES = [
  // Images
  'image/png',
  'image/jpeg',
  'image/pjpeg',
  'image/gif',
  'image/webp',

  // Documents
  'application/pdf',
  'application/postscript',
  'application/msword',
  'application/mspowerpoint',
  'application/powerpoint',
  'application/x-mspowerpoint',
  'application/excel',
  'application/x-excel',
  'application/x-msexcel',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.visio',
  'application/rtf',
  'application/x-rtf',

  // Audio
  'application/ogg',
  'audio/ogg',
  'audio/webm',
  'audio/3gpp',
  'audio/mp4',
  'audio/mpeg',
  'audio/mpeg4-generic',
  'audio/mpeg3',
  'audio/x-mpeg-3',
  'audio/vorbis',

  // Video
  'video/avi',
  'video/ogg',
  'video/msvideo',
  'video/x-msvideo',
  'video/mp4',
  'video/mpeg',
  'video/mpeg3',
  'video/x-mpeg',
  'video/webm',
  'video/3gpp',
  'video/3gpp2',

  // Text
  'text/csv',
  'text/calendar',
  'text/plain',
  'text/richtext'
] as const
